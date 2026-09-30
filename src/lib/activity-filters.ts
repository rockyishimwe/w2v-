import type {
  ActivityEntry,
  ActivityTypeFilter,
} from "@/services/activity-service";

/**
 * Pure filtering for the My Activity feed.
 * Extracted from the client so the rules are unit-testable;
 * All passes everything, otherwise the entry's tag must match.
 */
export function filterActivityEntries(
  entries: ActivityEntry[],
  filter: ActivityTypeFilter,
): ActivityEntry[] {
  if (filter === "All") return entries;
  return entries.filter((entry) => entry.tag === filter);
}
