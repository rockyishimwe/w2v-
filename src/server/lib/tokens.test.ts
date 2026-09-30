import { beforeEach, describe, expect, it } from "vitest";
import {
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
  verifyAccessToken,
} from "./tokens";

describe("access tokens", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-that-is-long-enough-1234";
  });

  it("round-trips a valid token", async () => {
    const token = await signAccessToken({
      sub: "user-1",
      email: "u@w.rw",
      firstName: "A",
      lastName: "B",
      locale: "en",
    });
    const payload = await verifyAccessToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe("user-1");
    expect(payload?.email).toBe("u@w.rw");
  });

  it("rejects tampered tokens", async () => {
    const token = await signAccessToken({
      sub: "user-1",
      email: "u@w.rw",
      firstName: "A",
      lastName: "B",
      locale: "en",
    });
    const payload = await verifyAccessToken(`${token}x`);
    expect(payload).toBeNull();
  });
});

describe("refresh tokens", () => {
  it("generates url-safe opaque tokens", () => {
    const token = generateRefreshToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{40,}$/);
  });

  it("hashes deterministically without storing the raw token", () => {
    const token = generateRefreshToken();
    expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
    expect(hashRefreshToken(token)).not.toContain(token);
    expect(hashRefreshToken(token)).toHaveLength(64);
  });

  it("produces different hashes for different tokens", () => {
    expect(hashRefreshToken("a")).not.toBe(hashRefreshToken("b"));
  });
});
