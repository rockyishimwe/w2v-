"use client";

/**
 * The notification bell: the round top-bar button every page already
 * renders, now backed by the real API. Polls GET /api/notifications every
 * 20s (near real-time), shows the unread badge only when there is
 * something unread, and opens a dropdown in the product's card style.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { BellIcon } from "./icons";
import {
  fetchNotifications,
  markNotificationsRead,
  type NotificationItem,
} from "@/services/notification-service";
import { formatNotificationTime } from "@/lib/notification-time";

const POLL_MS = 20_000;

export interface NotificationBellProps {
  /** Same round-button classes every top bar already uses. */
  size?: 40 | 44;
  ariaLabel?: string;
}

export function NotificationBell({
  size = 44,
  ariaLabel = "Notifications",
}: NotificationBellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const feed = await fetchNotifications();
      setItems(feed.data);
      setUnread(feed.unread);
      setError(false);
    } catch {
      // 401 (signed out) or offline: keep the last state, drop the badge.
      setUnread(0);
      setError(true);
    }
  }, []);

  // Poll for near real-time updates while mounted.
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (!cancelled) void refresh();
    };
    tick();
    pollRef.current = setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refresh]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = () => {
    setOpen((previous) => !previous);
    if (!open) void refresh();
  };

  const markAll = async () => {
    try {
      const nextUnread = await markNotificationsRead();
      setUnread(nextUnread);
      setItems((current) => current.map((item) => ({ ...item, read: true })));
    } catch {
      // Leave state as-is; next poll will reconcile.
    }
  };

  const openItem = async (item: NotificationItem) => {
    setOpen(false);
    if (!item.read) {
      setUnread((count) => Math.max(0, count - 1));
      setItems((current) =>
        current.map((row) =>
          row.id === item.id ? { ...row, read: true } : row,
        ),
      );
      try {
        await markNotificationsRead(item.id);
      } catch {
        // Badge already optimistic; poll will reconcile.
      }
    }
    if (item.href) router.push(item.href as Route);
  };

  const dimension = `${size}px`;

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={toggle}
        style={{ width: dimension, height: dimension }}
        className="relative flex items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.05)] transition-colors hover:text-brand-700"
      >
        <BellIcon className="h-5 w-5" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500"
          />
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notification list"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(92vw,380px)] overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_18px_48px_rgba(17,24,39,0.14)]"
        >
          <div className="flex items-center justify-between px-5 pb-3 pt-4">
            <h2 className="font-display text-[16px] font-bold text-black">
              Notifications
            </h2>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="text-[12.5px] font-semibold text-brand-700 transition-colors hover:text-brand-500"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-5 pb-6 text-[13px] text-[#607493]">
                {error
                  ? "Could not load notifications right now."
                  : "You're all caught up — nothing new yet."}
              </p>
            ) : (
              <ul>
                {items.map((item) => (
                  <li key={item.id} className="border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => void openItem(item)}
                      className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-brand-50/50 ${
                        item.read ? "" : "bg-brand-50/60"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500"
                        style={{ opacity: item.read ? 0 : 1 }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="truncate text-[13.5px] font-semibold text-gray-900">
                            {item.title}
                          </span>
                          <span className="shrink-0 text-[11.5px] text-[#607493]">
                            {formatNotificationTime(item.createdAt)}
                          </span>
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-[12.5px] leading-snug text-[#607493]">
                          {item.body}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
