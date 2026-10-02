/**
 * Notification service layer — the only module the UI talks to for the
 * bell dropdown. Wraps the API client (token attach/refresh handled
 * there); the dropdown polls fetchNotifications so updates are near
 * real-time without websockets.
 */
import { api } from "@/lib/api-client";

export type NotificationType = "interest" | "welcome";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  /** In-app page to open when tapped; null/absent = not clickable. */
  href?: string | null;
  read: boolean;
  /** ISO timestamp from the server. */
  createdAt: string;
}

export interface NotificationFeed {
  data: NotificationItem[];
  unread: number;
}

/** GET /api/notifications — latest items + unread badge count. */
export async function fetchNotifications(): Promise<NotificationFeed> {
  return api.get<NotificationFeed>("/api/notifications");
}

/**
 * POST /api/notifications/read — mark one notification read, or all when
 * no id is given. Returns the fresh unread count for the badge.
 */
export async function markNotificationsRead(id?: string): Promise<number> {
  const { unread } = await api.post<{ ok: true; unread: number }>(
    "/api/notifications/read",
    id ? { id } : {},
  );
  return unread;
}
