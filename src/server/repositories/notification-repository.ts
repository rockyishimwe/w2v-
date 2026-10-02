/**
 * Notification repository: in-app notifications created from real product
 * events (someone is interested in your listing, a new listing appears in
 * your district, account created). Nothing is seeded or hardcoded — the
 * bell dropdown only ever shows rows that were actually created.
 */
import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

export type NotificationType = "interest" | "welcome";

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  /** In-app page to open when tapped, e.g. "/exchange/lst-abc". */
  href?: string;
}

/**
 * Creates one notification. Never throws: a failed notification must not
 * break the business event that triggered it (fire-and-forget semantics).
 */
export async function createNotification(
  input: CreateNotificationInput,
): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        ...(input.href ? { href: input.href } : {}),
      },
    });
  } catch (error) {
    logger.error("notification create failed", {
      type: input.type,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

/** The user's latest notifications (newest first) + unread badge count. */
export async function listNotifications(userId: string, take = 30) {
  const [rows, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);

  return {
    data: rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      body: row.body,
      ...(row.href ? { href: row.href } : {}),
      read: row.read,
      createdAt: row.createdAt.toISOString(),
    })),
    unread,
  };
}

/** Marks one notification read (owner-checked) and returns the new unread count. */
export async function markNotificationRead(
  userId: string,
  notificationId: string,
) {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
  return unreadCount(userId);
}

/** Marks everything read for the user and returns the new unread count. */
export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  return unreadCount(userId);
}

async function unreadCount(userId: string): Promise<number> {
  return prisma.notification.count({ where: { userId, read: false } });
}
