import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

/* The auth service imports the real prisma client; mock the module. */
vi.mock("@/server/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    refreshToken: { updateMany: vi.fn() },
  },
}));

vi.mock("@/server/lib/password", () => ({
  hashPassword: async (value: string) => `hashed-${value}`,
  verifyPassword: async (plain: string, hash: string) =>
    hash === `hashed-${plain}`,
}));

import { changePassword, logoutAll, me, updateProfile } from "./auth-service";
import { prisma } from "@/server/lib/prisma";

const db = prisma as unknown as {
  user: Record<string, Mock>;
  refreshToken: Record<string, Mock>;
};

const row = {
  id: "u1",
  email: "vanessa@example.rw",
  firstName: "Vanessa",
  lastName: "Uwase",
  locale: "en",
  passwordHash: "hashed-Secret123",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("me", () => {
  it("reports whether the account has a password", async () => {
    db.user.findUnique.mockResolvedValue(row);
    await expect(me("u1")).resolves.toMatchObject({ hasPassword: true });

    db.user.findUnique.mockResolvedValue({ ...row, passwordHash: null });
    await expect(me("u1")).resolves.toMatchObject({ hasPassword: false });
  });

  it("never leaks the password hash", async () => {
    db.user.findUnique.mockResolvedValue(row);
    expect(await me("u1")).not.toHaveProperty("passwordHash");
  });
});

describe("updateProfile", () => {
  it("writes only the provided fields", async () => {
    db.user.findUnique.mockResolvedValue(row);
    db.user.update.mockResolvedValue({
      ...row,
      firstName: "Vanessa M.",
      locale: "fr",
    });

    const user = await updateProfile("u1", {
      firstName: "Vanessa M.",
      locale: "fr",
    });

    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { firstName: "Vanessa M.", locale: "fr" },
    });
    expect(user).toMatchObject({ firstName: "Vanessa M.", locale: "fr" });
  });

  it("rejects an unknown account", async () => {
    db.user.findUnique.mockResolvedValue(null);
    await expect(updateProfile("nope", { locale: "fr" })).rejects.toMatchObject(
      {
        status: 400,
      },
    );
  });
});

describe("changePassword", () => {
  it("stores the new hash and revokes every session", async () => {
    db.user.findUnique.mockResolvedValue(row);
    db.user.update.mockResolvedValue(row);

    await changePassword("u1", {
      currentPassword: "Secret123",
      newPassword: "Brandnew1",
    });

    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { passwordHash: "hashed-Brandnew1" },
    });
    expect(db.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: "u1", revoked: false },
      data: { revoked: true },
    });
  });

  it("rejects a wrong current password without touching the account", async () => {
    db.user.findUnique.mockResolvedValue(row);

    await expect(
      changePassword("u1", {
        currentPassword: "WrongPass1",
        newPassword: "Brandnew1",
      }),
    ).rejects.toMatchObject({ status: 401 });
    expect(db.user.update).not.toHaveBeenCalled();
  });

  it("refuses for OAuth-only accounts", async () => {
    db.user.findUnique.mockResolvedValue({ ...row, passwordHash: null });

    await expect(
      changePassword("u1", {
        currentPassword: "whatever",
        newPassword: "Brandnew1",
      }),
    ).rejects.toMatchObject({ status: 400 });
  });
});

describe("logoutAll", () => {
  it("revokes all active refresh tokens of the user", async () => {
    await logoutAll("u1");
    expect(db.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: "u1", revoked: false },
      data: { revoked: true },
    });
  });
});
