/**
 * Compact relative timestamps for notification rows: "now", "5m", "2h",
 * "3d", otherwise a short date ("Sep 28"). Pure so it is unit-testable.
 */
export function formatNotificationTime(
  iso: string,
  now: Date = new Date(),
): string {
  const then = new Date(iso);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (Number.isNaN(seconds)) return "";

  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
