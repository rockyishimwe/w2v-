/**
 * Activity repository: data access for the My Activity feed, dashboard
 * stats and the impact goal. Pure Prisma — no HTTP concerns.
 */
import { prisma } from "../lib/prisma";

export type ActivityType = "Scan" | "Reuse" | "Recycling" | "Exchange";

export interface CreateActivityInput {
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  location: string;
  artKey: string;
  /** User-reported kg diverted (real input, optional). */
  wasteKg?: number;
  occurredAt?: Date;
}

/** Impact goal shown on the dashboard (design: 15 of 22 kg). */
export const IMPACT_TARGET_KG = 22;

/** Converts an entry type to the tag used by the UI filter chips. */
function tagFor(type: string): string {
  return type; // Scan/Reuse/Recycling/Exchange already match the UI tags
}

/** Converts an entry type to the dashboard stat it feeds. */
export function isDiversionType(type: string): boolean {
  return type !== "Scan";
}

export async function listEntries(
  userId: string,
  options: {
    filter?: string;
    days?: number;
    page?: number;
    pageSize?: number;
  } = {},
) {
  const { filter = "All", days = 30, page = 1, pageSize = 50 } = options;
  const since = new Date(Date.now() - days * 86_400_000);

  const where = {
    userId,
    occurredAt: { gte: since },
    ...(filter !== "All" ? { type: filter } : {}),
  };

  const [total, entries] = await Promise.all([
    prisma.activityEntry.count({ where }),
    prisma.activityEntry.findMany({
      where,
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        location: true,
        artKey: true,
        wasteKg: true,
        occurredAt: true,
      },
      orderBy: { occurredAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    data: entries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      location: entry.location,
      timestamp: entry.occurredAt.toISOString(),
      tag: tagFor(entry.type),
      artKey: entry.artKey,
      ...(entry.wasteKg !== null ? { wasteKg: entry.wasteKg } : {}),
    })),
    page,
    pageSize,
    total,
  };
}

export async function computeStats(userId: string, days = 30) {
  const since = new Date(Date.now() - days * 86_400_000);
  const entries = await prisma.activityEntry.findMany({
    where: { userId, occurredAt: { gte: since } },
    select: { type: true, wasteKg: true },
  });

  const itemsReused = entries.filter(
    (entry) => entry.type === "Reuse" || entry.type === "Exchange",
  ).length;
  const exchanges = entries.filter((entry) => entry.type === "Exchange").length;
  const scans = entries.filter((entry) => entry.type === "Scan").length;

  // Real diverted mass: the sum of kg the user actually reported on their
  // diversion actions (no estimates). Unknown weights contribute nothing.
  const wasteDivertedKg = round1(
    entries
      .filter((entry) => isDiversionType(entry.type))
      .reduce((sum, entry) => sum + (entry.wasteKg ?? 0), 0),
  );

  return {
    itemsReused,
    exchanges,
    scans,
    wasteDivertedKg,
    wasteDiverted: `${wasteDivertedKg.toFixed(1)} kg`,
  };
}

export async function computeImpact(userId: string, days = 30) {
  const stats = await computeStats(userId, days);
  const current = stats.wasteDivertedKg;
  const percent = Math.min(100, Math.round((current / IMPACT_TARGET_KG) * 100));
  return {
    percent,
    current: `${current.toFixed(1)} kg`,
    target: `${IMPACT_TARGET_KG} kg`,
  };
}

/** Rounds to one decimal (avoids float drift in sums). */
function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export async function createEntry(input: CreateActivityInput) {
  const entry = await prisma.activityEntry.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      description: input.description,
      location: input.location,
      artKey: input.artKey,
      ...(input.wasteKg !== undefined ? { wasteKg: input.wasteKg } : {}),
      ...(input.occurredAt ? { occurredAt: input.occurredAt } : {}),
    },
  });
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    location: entry.location,
    timestamp: entry.occurredAt.toISOString(),
    tag: tagFor(entry.type),
    artKey: entry.artKey,
    ...(entry.wasteKg !== null ? { wasteKg: entry.wasteKg } : {}),
  };
}
