import { beforeEach, describe, expect, it } from "vitest";
import { findReplay, recordResponse, resetIdempotency } from "./idempotency";
import { conflict } from "./errors";

describe("idempotency", () => {
  beforeEach(() => resetIdempotency());

  it("returns null the first time a key is seen", () => {
    expect(findReplay("key-1", "POST /x", { a: 1 })).toBeNull();
  });

  it("replays the stored response for the same key+body", () => {
    recordResponse("key-1", "POST /x", { a: 1 }, { id: "created" }, 201);
    const replay = findReplay("key-1", "POST /x", { a: 1 });
    expect(replay).toEqual({ body: { id: "created" }, status: 201 });
  });

  it("treats a different body with the same key as a conflict", () => {
    recordResponse("key-1", "POST /x", { a: 1 }, { id: "created" }, 201);
    expect(() => findReplay("key-1", "POST /x", { a: 2 })).toThrow(
      conflict(
        "Idempotency-Key was already used with a different request body.",
      ),
    );
  });

  it("scopes keys per endpoint", () => {
    recordResponse("key-1", "POST /a", { a: 1 }, { id: "a" }, 201);
    expect(findReplay("key-1", "POST /b", { a: 1 })).toBeNull();
  });

  it("ignores null keys entirely", () => {
    expect(findReplay(null, "POST /x", { a: 1 })).toBeNull();
    recordResponse(null, "POST /x", { a: 1 }, {}, 201);
    expect(findReplay(null, "POST /x", { a: 1 })).toBeNull();
  });
});
