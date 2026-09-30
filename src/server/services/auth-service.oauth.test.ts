import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

/* The auth service imports the real prisma client; mock the module. */
vi.mock("@/server/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: { create: vi.fn() },
    oAuthLoginCode: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  },
}));

vi.mock("@/server/lib/tokens", () => ({
  ACCESS_TOKEN_TTL_SECONDS: 900,
  REFRESH_TOKEN_TTL_DAYS: 30,
  generateRefreshToken: () => "rt-test-token",
  hashRefreshToken: (t: string) => `hashed-${t}`,
  signAccessToken: async (p: unknown) => `jwt-${JSON.stringify(p).length}`,
}));

import {
  oauthCreateLoginCode,
  oauthExchangeCode,
  oauthUpsertUser,
} from "./auth-service";
import { prisma } from "@/server/lib/prisma";

const db = prisma as unknown as {
  user: Record<string, Mock>;
  refreshToken: Record<string, Mock>;
  oAuthLoginCode: Record<string, Mock>;
};

const profile = {
  oauthId: "fb-123",
  email: "vanessa@example.rw",
  firstName: "Vanessa",
  lastName: "Uwase",
  emailVerified: true,
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("oauthUpsertUser", () => {
  it("returns the existing user linked to the OAuth identity", async () => {
    db.user.findFirst.mockResolvedValue({
      id: "u1",
      email: profile.email,
      firstName: "Vanessa",
      lastName: "Uwase",
      locale: "en",
    });

    const user = await oauthUpsertUser("facebook", profile);

    expect(user.id).toBe("u1");
    expect(db.user.create).not.toHaveBeenCalled();
    expect(db.user.update).not.toHaveBeenCalled();
  });

  it("links the OAuth identity to an existing email (password) account", async () => {
    db.user.findFirst.mockResolvedValue(null);
    db.user.findUnique.mockResolvedValue({
      id: "u2",
      email: profile.email,
      firstName: "Vanessa",
      lastName: "Uwase",
      locale: "en",
      passwordHash: "hashed",
    });
    db.user.update.mockResolvedValue({
      id: "u2",
      email: profile.email,
      firstName: "Vanessa",
      lastName: "Uwase",
      locale: "en",
    });

    const user = await oauthUpsertUser("facebook", profile);

    expect(user.id).toBe("u2");
    expect(db.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "u2" },
        data: { oauthProvider: "facebook", oauthId: "fb-123" },
      }),
    );
    expect(db.user.create).not.toHaveBeenCalled();
  });

  it("creates a passwordless user when no account exists", async () => {
    db.user.findFirst.mockResolvedValue(null);
    db.user.findUnique.mockResolvedValue(null);
    db.user.create.mockResolvedValue({
      id: "u3",
      email: profile.email,
      firstName: "Vanessa",
      lastName: "Uwase",
      locale: "en",
    });

    const user = await oauthUpsertUser("google", profile);

    expect(user.id).toBe("u3");
    const createArg = db.user.create.mock.calls[0][0];
    expect(createArg.data).not.toHaveProperty("passwordHash");
    expect(createArg.data.oauthProvider).toBe("google");
    expect(createArg.data.oauthId).toBe("fb-123");
  });
});

describe("oauth login codes", () => {
  it("creates a code whose DB copy is a SHA-256 hash, not plaintext", async () => {
    db.oAuthLoginCode.create.mockResolvedValue({});

    const code = await oauthCreateLoginCode("u1");

    expect(code).toBeTruthy();
    const stored = db.oAuthLoginCode.create.mock.calls[0][0].data.code;
    expect(stored).not.toBe(code);
    expect(stored).toHaveLength(64); // sha256 hex
  });

  it("exchanges a valid code for a session and marks it used", async () => {
    db.oAuthLoginCode.findUnique.mockResolvedValue({
      code: "h",
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      user: {
        id: "u1",
        email: "v@e.rw",
        firstName: "Vanessa",
        lastName: "Uwase",
        locale: "en",
        passwordHash: null,
      },
    });
    db.oAuthLoginCode.update.mockResolvedValue({});
    db.refreshToken.create.mockResolvedValue({});

    // Produce a real code so its hash matches what findUnique returns.
    db.oAuthLoginCode.create.mockResolvedValue({});
    const code = await oauthCreateLoginCode("u1");
    db.oAuthLoginCode.findUnique.mockResolvedValue({
      code: expect.anything(),
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      user: {
        id: "u1",
        email: "v@e.rw",
        firstName: "Vanessa",
        lastName: "Uwase",
        locale: "en",
        passwordHash: null,
      },
    });

    const session = await oauthExchangeCode(code);
    expect(session.user.id).toBe("u1");
    expect(session.refreshToken).toBe("rt-test-token");
    expect(db.oAuthLoginCode.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { usedAt: expect.any(Date) } }),
    );
  });

  it("rejects an already-used code", async () => {
    db.oAuthLoginCode.findUnique.mockResolvedValue({
      code: "h",
      usedAt: new Date(Date.now() - 1000),
      expiresAt: new Date(Date.now() + 60_000),
      user: { id: "u1" },
    });

    await expect(oauthExchangeCode("whatever")).rejects.toMatchObject({
      status: 403,
    });
  });

  it("rejects an expired code", async () => {
    db.oAuthLoginCode.findUnique.mockResolvedValue({
      code: "h",
      usedAt: null,
      expiresAt: new Date(Date.now() - 60_000),
      user: { id: "u1" },
    });

    await expect(oauthExchangeCode("whatever")).rejects.toMatchObject({
      status: 403,
    });
  });
});
