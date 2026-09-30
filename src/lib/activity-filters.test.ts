import { describe, expect, it } from "vitest";
import type { ActivityEntry } from "@/services/activity-service";
import { filterActivityEntries } from "./activity-filters";

function makeEntry(overrides: Partial<ActivityEntry> = {}): ActivityEntry {
  return {
    id: "test-entry",
    title: "Test Entry",
    description: "A test entry.",
    location: "Home",
    timestamp: new Date().toISOString(),
    tag: "Scan",
    artKey: "test-entry",
    ...overrides,
  };
}

describe("filterActivityEntries", () => {
  const entries: ActivityEntry[] = [
    makeEntry({ id: "scan-1", tag: "Scan" }),
    makeEntry({ id: "recycle-1", tag: "Recycling" }),
    makeEntry({ id: "recycle-2", tag: "Recycling" }),
    makeEntry({ id: "exchange-1", tag: "Exchange" }),
  ];

  it("returns everything for All", () => {
    expect(filterActivityEntries(entries, "All")).toEqual(entries);
  });

  it("keeps only entries with the chosen tag", () => {
    const recycling = filterActivityEntries(entries, "Recycling");
    expect(recycling.map((entry) => entry.id)).toEqual([
      "recycle-1",
      "recycle-2",
    ]);
  });

  it("returns nothing when no entry matches", () => {
    const only = [makeEntry({ id: "a", tag: "Reuse" })];
    expect(filterActivityEntries(only, "Exchange")).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const copy = [...entries];
    filterActivityEntries(entries, "Scan");
    expect(entries).toEqual(copy);
  });
});
