/**
 * Idempotency-Key support for POST endpoints.
 *
 * Offline-queued requests (SRS requirement) may be retried after reconnect;
 * storing the recorded response per (endpoint, key) lets replays return the
 * original result instead of creating duplicates. Reusing a key with a
 * different payload is a client bug and yields 409 CONFLICT.
 *
 * Records live in the IdempotencyRecord table rather than in memory: on a
 * serverless host each instance has its own memory and loses it on cold
 * start, so a retry landing elsewhere would duplicate the work the key
 * exists to deduplicate.
 *
 * Narrow remaining race: two *concurrent* requests with the same key can
 * both miss the lookup and do the work, since the record is written after
 * the fact. The unique key means only one record survives, so the second
 * caller still gets a consistent answer on any later replay. Closing that
 * window entirely needs a claim-before-work protocol, which the offline
 * queue (sequential retries, seconds to hours apart) does not require.
 */
import { createHash } from "node:crypto";
import { conflict } from "./errors";
import { prisma } from "./prisma";
import { logger } from "./logger";

const TTL_MS = 24 * 60 * 60 * 1000;

/** Instances sweep at most this often, so expiry costs ~no extra writes. */
const SWEEP_INTERVAL_MS = 60 * 60 * 1000;
let lastSweep = 0;

function bodyHash(body: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(body ?? null))
    .digest("hex");
}

/** The table's primary key: one namespace per endpoint. */
function recordKey(endpoint: string, key: string): string {
  return `${endpoint}:${key}`;
}

/** Drops expired records, at most once per SWEEP_INTERVAL_MS per instance. */
async function sweep(): Promise<void> {
  const now = Date.now();
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;

  try {
    await prisma.idempotencyRecord.deleteMany({
      where: { createdAt: { lt: new Date(now - TTL_MS) } },
    });
  } catch (error) {
    // Housekeeping only — never fail the request it rode along with.
    logger.warn("idempotency sweep failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
  }
}

/**
 * Returns the stored response for a replayed (endpoint, key) pair:
 * - same body  → previous response (replay)
 * - other body → 409 CONFLICT (client bug)
 * - no entry   → null (first time through; caller proceeds normally)
 */
export async function findReplay(
  key: string | null,
  endpoint: string,
  body: unknown,
): Promise<{ body: unknown; status: number } | null> {
  if (!key) return null;
  await sweep();

  const record = await prisma.idempotencyRecord.findUnique({
    where: { key: recordKey(endpoint, key) },
  });
  if (!record) return null;

  // An expired record is a miss: the caller redoes the work and the write
  // below overwrites it.
  if (Date.now() - record.createdAt.getTime() > TTL_MS) return null;

  if (record.requestBody !== bodyHash(body)) {
    throw conflict(
      "Idempotency-Key was already used with a different request body.",
    );
  }

  return {
    body: JSON.parse(record.responseBody) as unknown,
    status: record.status,
  };
}

/** Records the response produced for an (endpoint, key) pair. */
export async function recordResponse(
  key: string | null,
  endpoint: string,
  body: unknown,
  response: unknown,
  status: number,
  userId?: string,
): Promise<void> {
  if (!key) return;

  // Only the hash is kept: request bodies carry photo data URLs, and all
  // this needs to answer is "same payload as last time?".
  const data = {
    userId: userId ?? null,
    endpoint,
    requestBody: bodyHash(body),
    status,
    responseBody: JSON.stringify(response ?? null),
    createdAt: new Date(),
  };

  try {
    await prisma.idempotencyRecord.upsert({
      where: { key: recordKey(endpoint, key) },
      create: { key: recordKey(endpoint, key), ...data },
      update: data,
    });
  } catch (error) {
    // The work itself succeeded; a bookkeeping failure must not turn that
    // into an error response. The retry simply redoes the work.
    logger.warn("idempotency record failed", {
      endpoint,
      message: error instanceof Error ? error.message : "unknown",
    });
  }
}

/** Clears the idempotency records (used by tests). */
export async function resetIdempotency(): Promise<void> {
  await prisma.idempotencyRecord.deleteMany({});
  lastSweep = 0;
}
