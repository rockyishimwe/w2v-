/**
 * Idempotency-Key support for POST endpoints.
 *
 * Offline-queued requests (SRS requirement) may be retried after reconnect;
 * storing the recorded response per (endpoint, key) lets replays return the
 * original result instead of creating duplicates. Reusing a key with a
 * different payload is a client bug and yields 409 CONFLICT.
 *
 * Keys are held in memory with a TTL for the MVP; a production deployment
 * can persist the same records in the IdempotencyRecord table.
 */
import { createHash } from "node:crypto";
import { conflict } from "./errors";

interface StoredEntry {
  bodyHash: string;
  responseBody: unknown;
  status: number;
  createdAt: number;
}

const TTL_MS = 24 * 60 * 60 * 1000;
const store = new Map<string, StoredEntry>(); // `${endpoint}:${key}` → entry

function bodyHash(body: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(body ?? null))
    .digest("hex");
}

function entryKey(endpoint: string, key: string): string {
  return `${endpoint}:${key}`;
}

function sweep(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.createdAt > TTL_MS) store.delete(key);
  }
}

/**
 * Returns the stored response for a replayed (endpoint, key) pair:
 * - same body  → previous response (replay)
 * - other body → 409 CONFLICT (client bug)
 * - no entry   → null (first time through; caller proceeds normally)
 */
export function findReplay(
  key: string | null,
  endpoint: string,
  body: unknown,
): { body: unknown; status: number } | null {
  if (!key) return null;
  sweep();

  const entry = store.get(entryKey(endpoint, key));
  if (!entry) return null;

  if (entry.bodyHash !== bodyHash(body)) {
    throw conflict(
      "Idempotency-Key was already used with a different request body.",
    );
  }
  return { body: entry.responseBody, status: entry.status };
}

/** Records the response produced for an (endpoint, key) pair. */
export function recordResponse(
  key: string | null,
  endpoint: string,
  body: unknown,
  response: unknown,
  status: number,
): void {
  if (!key) return;
  store.set(entryKey(endpoint, key), {
    bodyHash: bodyHash(body),
    responseBody: response,
    status,
    createdAt: Date.now(),
  });
}

/** Clears the idempotency store (used by tests). */
export function resetIdempotency(): void {
  store.clear();
}
