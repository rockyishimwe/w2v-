/**
 * Activity service layer — feed, stats and impact for the My Activity
 * page and the dashboard. All data comes from the real API for the
 * signed-in user; no mock entries.
 */
import { api } from "@/lib/api-client";

export type ActivityTag = "Scan" | "Reuse" | "Recycling" | "Exchange";
export type ActivityTypeFilter = ActivityTag | "All";

/** One row in the activity feed. */
export interface ActivityEntry {
  id: string;
  title: string;
  description: string;
  location: string;
  /** ISO timestamp (UI formats it relative to now). */
  timestamp: string;
  tag: ActivityTag;
  artKey: string;
  /** User-reported kg diverted, when provided. */
  wasteKg?: number;
}

export interface ActivityStats {
  itemsReused: number;
  exchanges: number;
  scans: number;
  wasteDivertedKg: number;
  wasteDiverted: string;
  /**
   * Percent change against the previous window of the same length;
   * null for a metric with no earlier data to compare against.
   */
  trend: {
    itemsReused: number | null;
    wasteDiverted: number | null;
    exchanges: number | null;
  };
}

export interface ActivityImpact {
  percent: number;
  current: string;
  target: string;
}

export interface ActivityFeedResponse {
  data: ActivityEntry[];
  page: number;
  pageSize: number;
  total: number;
  stats: ActivityStats;
  impact: ActivityImpact;
}

export interface CreateActivityInput {
  type: ActivityTag;
  title: string;
  description: string;
  location?: string;
  artKey?: string;
  wasteKg?: number;
}

/** GET /api/activity?filter=… — feed + stats + impact for the user. */
export function fetchActivity(
  filter: ActivityTypeFilter = "All",
): Promise<ActivityFeedResponse> {
  const qs = filter !== "All" ? `?filter=${encodeURIComponent(filter)}` : "";
  return api.get<ActivityFeedResponse>(`/api/activity${qs}`);
}

/** POST /api/activity — records a manual entry (auth required). */
export function logActivity(
  input: CreateActivityInput,
): Promise<ActivityEntry> {
  return api.post<ActivityEntry>("/api/activity", input);
}
