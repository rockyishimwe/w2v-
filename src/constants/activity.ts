/**
 * My Activity page UI constants — copy, filter labels and quick actions.
 * All feed/stats/impact DATA now comes from the API (see
 * services/activity-service.ts); nothing here is mock content.
 */

import type { Route } from "next";
import type { ActivityTypeFilter } from "@/services/activity-service";

/** Filter chip above the activity feed (design order: All first). */
export const ACTIVITY_FILTERS: ActivityTypeFilter[] = [
  "All",
  "Recycling",
  "Reuse",
  "Exchange",
  "Scan",
];

export type { ActivityTypeFilter };

/** Intro banner copy on the summary card. */
export const ACTIVITY_BANNER = {
  title: "Small actions. Big impact.",
  body: "Every item you recycle, reuse or exchange helps build a cleaner, greener future.",
} as const;

/** Rows in the Quick Actions rail (design order). */
export const ACTIVITY_QUICK_ACTIONS: {
  title: string;
  sub: string;
  href: Route;
}[] = [
  { title: "Scan Waste", sub: "Identify what you can reuse", href: "/scanner" },
  { title: "Explore Ideas", sub: "DIY, reuse and more", href: "/discover" },
  {
    title: "Find Exchange Items",
    sub: "Local & user exchanges",
    href: "/exchange",
  },
];
