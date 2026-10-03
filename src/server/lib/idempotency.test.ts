import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The store is now the IdempotencyRecord table, so the Prisma delegate is
 * stubbed with an in-memory map that behaves like the three calls the
 * module makes (findUnique / upsert / deleteMany on `key`).
 */
type Row = {
  key: string;
  userId: string | null;
  endpoint: string;
  requestBody: string;
  status: number;
  responseBody: string;
  createdAt: Date;
};

const rows = new Map<string, Row>();

vi.mock("@/server/lib/prisma", () => ({
  prisma: {
    idempotencyRecord: {
      findUnique: vi.fn(
        async ({ where }: { where: { key: string } }) =>
          rows.get(where.key) ?? null,
      ),
      upsert: vi.fn(
        async ({
          where,
          create,
          update,
        }: {
          where: { key: string };
          create: Row;
          update: Omit<Row, "key">;
        }) => {
          const existing = rows.get(where.key);
          const row = existing
            ? { ...existing, ...update }
            : { ...create, key: where.key };
          rows.set(where.key, row);
          return row;
        },
      ),
      deleteMany: vi.fn(
        async (args?: { where?: { createdAt?: { lt: Date } } }) => {
          const before = args?.where?.createdAt?.lt;
          if (!before) {
            const count = rows.size;
            rows.clear();
            return { count };
          }
          let count = 0;
          for (const [key, row] of rows) {
            if (row.createdAt < before) {
              rows.delete(key);
              count += 1;
            }
          }
          return { count };
        },
      ),
    },
  },
}));

vi.mock("@/server/lib/logger", () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

import { findReplay, recordResponse, resetIdempotency } from "./idempotency";
import { conflict } from "./errors";

describe("idempotency", () => {
  beforeEach(async () => {
    await resetIdempotency();
  });

  it("returns null the first time a key is seen", async () => {
    await expect(findReplay("key-1", "POST /x", { a: 1 })).resolves.toBeNull();
  });

  it("replays the stored response for the same key+body", async () => {
    await recordResponse("key-1", "POST /x", { a: 1 }, { id: "created" }, 201);
    await expect(findReplay("key-1", "POST /x", { a: 1 })).resolves.toEqual({
      body: { id: "created" },
      status: 201,
    });
  });

  it("treats a different body with the same key as a conflict", async () => {
    await recordResponse("key-1", "POST /x", { a: 1 }, { id: "created" }, 201);
    await expect(findReplay("key-1", "POST /x", { a: 2 })).rejects.toThrow(
      conflict(
        "Idempotency-Key was already used with a different request body.",
      ),
    );
  });

  it("scopes keys per endpoint", async () => {
    await recordResponse("key-1", "POST /a", { a: 1 }, { id: "a" }, 201);
    await expect(findReplay("key-1", "POST /b", { a: 1 })).resolves.toBeNull();
  });

  it("ignores null keys entirely", async () => {
    await expect(findReplay(null, "POST /x", { a: 1 })).resolves.toBeNull();
    await recordResponse(null, "POST /x", { a: 1 }, {}, 201);
    await expect(findReplay(null, "POST /x", { a: 1 })).resolves.toBeNull();
  });

  it("records the user so the table can be queried per account", async () => {
    await recordResponse(
      "key-1",
      "POST /x",
      { a: 1 },
      { id: "created" },
      201,
      "user-1",
    );
    expect(rows.get("POST /x:key-1")?.userId).toBe("user-1");
  });

  it("stores only a hash of the request body", async () => {
    await recordResponse(
      "key-1",
      "POST /x",
      { photo: "data:image/png;base64,AAAA" },
      {},
      201,
    );
    const stored = rows.get("POST /x:key-1")?.requestBody ?? "";
    expect(stored).toMatch(/^[a-f0-9]{64}$/);
    expect(stored).not.toContain("base64");
  });

  it("treats an expired record as a miss", async () => {
    await recordResponse("key-1", "POST /x", { a: 1 }, { id: "created" }, 201);
    const row = rows.get("POST /x:key-1")!;
    // Older than the 24h TTL.
    row.createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000);
    await expect(findReplay("key-1", "POST /x", { a: 1 })).resolves.toBeNull();
  });
});
