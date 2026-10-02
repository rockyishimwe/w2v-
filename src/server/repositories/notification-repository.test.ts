import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("@/server/lib/prisma", () => ({
  prisma: {
    notification: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("@/server/lib/logger", () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

import {
  createNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notification-repository";
import { prisma } from "@/server/lib/prisma";

const db = prisma as unknown as {
  notification: Record<string, Mock>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createNotification", () => {
  it("creates a notification row with the given fields", async () => {
    db.notification.create.mockResolvedValue({ id: "n1" });

    await createNotification({
      userId: "u1",
      type: "interest",
      title: "Someone is interested in your item",
      body: "Glass jars received a new interest.",
      href: "/exchange/lst-1",
    });

    expect(db.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "u1",
        type: "interest",
        title: "Someone is interested in your item",
        body: "Glass jars received a new interest.",
        href: "/exchange/lst-1",
      },
    });
  });

  it("omits href when none is given", async () => {
    db.notification.create.mockResolvedValue({ id: "n2" });

    await createNotification({
      userId: "u1",
      type: "welcome",
      title: "Welcome!",
      body: "Get started.",
    });

    const call = db.notification.create.mock.calls[0][0] as {
      data: Record<string, unknown>;
    };
    expect(call.data.href).toBeUndefined();
  });

  it("swallows database failures instead of throwing", async () => {
    db.notification.create.mockRejectedValue(new Error("db down"));

    await expect(
      createNotification({
        userId: "u1",
        type: "welcome",
        title: "Welcome!",
        body: "Get started.",
      }),
    ).resolves.toBeUndefined();
  });
});

describe("listNotifications", () => {
  it("returns mapped rows and the unread count", async () => {
    db.notification.findMany.mockResolvedValue([
      {
        id: "n1",
        type: "interest",
        title: "Interest",
        body: "Body",
        href: "/exchange/lst-1",
        read: false,
        createdAt: new Date("2026-10-01T10:00:00Z"),
      },
      {
        id: "n2",
        type: "welcome",
        title: "Welcome",
        body: "Body",
        href: null,
        read: true,
        createdAt: new Date("2026-09-30T10:00:00Z"),
      },
    ]);
    db.notification.count.mockResolvedValue(1);

    const result = await listNotifications("u1");

    expect(result.unread).toBe(1);
    expect(result.data).toEqual([
      {
        id: "n1",
        type: "interest",
        title: "Interest",
        body: "Body",
        href: "/exchange/lst-1",
        read: false,
        createdAt: "2026-10-01T10:00:00.000Z",
      },
      {
        id: "n2",
        type: "welcome",
        title: "Welcome",
        body: "Body",
        read: true,
        createdAt: "2026-09-30T10:00:00.000Z",
      },
    ]);
    expect(db.notification.findMany).toHaveBeenCalledWith({
      where: { userId: "u1" },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
  });
});

describe("markNotificationRead", () => {
  it("updates only the caller's row and returns the fresh unread count", async () => {
    db.notification.updateMany.mockResolvedValue({ count: 1 });
    db.notification.count.mockResolvedValue(0);

    const unread = await markNotificationRead("u1", "n1");

    expect(unread).toBe(0);
    expect(db.notification.updateMany).toHaveBeenCalledWith({
      where: { id: "n1", userId: "u1" },
      data: { read: true },
    });
  });
});

describe("markAllNotificationsRead", () => {
  it("updates every unread row and returns the fresh unread count", async () => {
    db.notification.updateMany.mockResolvedValue({ count: 3 });
    db.notification.count.mockResolvedValue(0);

    const unread = await markAllNotificationsRead("u1");

    expect(unread).toBe(0);
    expect(db.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: "u1", read: false },
      data: { read: true },
    });
  });
});
