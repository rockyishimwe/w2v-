import { describe, expect, it } from "vitest";
import { formatNotificationTime } from "./notification-time";

describe("formatNotificationTime", () => {
  const now = new Date("2026-10-01T12:00:00Z");

  it("returns now for anything under a minute", () => {
    expect(formatNotificationTime("2026-10-01T11:59:30Z", now)).toBe("now");
  });

  it("returns minutes below an hour", () => {
    expect(formatNotificationTime("2026-10-01T11:40:00Z", now)).toBe("20m");
  });

  it("returns hours below a day", () => {
    expect(formatNotificationTime("2026-10-01T08:00:00Z", now)).toBe("4h");
  });

  it("returns days below a week", () => {
    expect(formatNotificationTime("2026-09-29T12:00:00Z", now)).toBe("2d");
  });

  it("falls back to a short date after a week", () => {
    expect(formatNotificationTime("2026-09-20T12:00:00Z", now)).toBe("Sep 20");
  });

  it("returns empty for an unparseable timestamp", () => {
    expect(formatNotificationTime("not-a-date", now)).toBe("");
  });
});
