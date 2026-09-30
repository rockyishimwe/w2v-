"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  BotIcon,
  CameraIcon,
  ChatIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  LeafIcon,
  LoopIcon,
  MapPinIcon,
  RecycleIcon,
  SparkleIcon,
} from "./icons";
import {
  fetchActivity,
  type ActivityEntry,
  type ActivityStats,
} from "@/services/activity-service";
import { fetchIdeas } from "@/services/discover-service";
import { fetchListings } from "@/services/exchange-service";
import { api } from "@/lib/api-client";
import { useT, type Translate } from "@/i18n/use-translation";
import { ActivityArt } from "./activity-art";
import { IdeaArt } from "./discover-art";
import { ItemArt } from "./exchange-art";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  icon: Icon,
  action,
}: {
  title: string;
  icon: (props: { className?: string }) => React.ReactNode;
  action?: { label: string; href: Route };
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-display flex items-center gap-2.5 text-[16px] font-semibold text-gray-900">
        <Icon className="h-5 w-5 text-gray-900" />
        {title}
      </h2>
      {action && <ViewAllLink {...action} />}
    </div>
  );
}

/** The green "View all →" affordance repeated on every dashboard card. */
export function ViewAllLink({
  label,
  href,
  className = "",
}: {
  label: string;
  href: Route;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-brand-500 transition-colors hover:text-brand-700 ${className}`}
    >
      {label}
      <ArrowRightIcon className="h-3.5 w-3.5" />
    </Link>
  );
}

export function ScanWasteCard() {
  const t = useT();

  return (
    <section className="relative min-h-[181px] overflow-hidden rounded-[28px] bg-[linear-gradient(115deg,#168a3c_0%,#45bf68_100%)] p-6 text-white shadow-[0_18px_36px_rgba(20,92,54,0.24)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[98px] -left-16 h-36 w-[135%] rotate-[-7deg] rounded-[50%] bg-brand-800/55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[110px] -right-12 h-36 w-[110%] rotate-[8deg] rounded-[50%] bg-brand-500/45"
      />
      <div className="relative flex items-center gap-4">
        <span className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <CameraIcon className="h-9 w-9" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[19px] font-semibold leading-tight">
            {t("Scan Waste")}
          </h2>
          <p className="mt-1 text-[12.5px] leading-snug text-white/85">
            {t("Identify what you have and discover the best next steps.")}
          </p>
        </div>
        <Link
          href="/scanner"
          aria-label={t("Open scanner")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-md transition-transform hover:scale-105"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

/* ── Stats — real 30-day numbers from /api/activity ───────────── */

function useStats() {
  const [stats, setStats] = useState<ActivityStats | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetchActivity()
      .then((response) => {
        if (!cancelled) setStats(response.stats);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  return stats;
}

export function StatsCard() {
  const stats = useStats();
  const t = useT();
  const tiles = [
    {
      icon: RecycleIcon,
      value: stats ? String(stats.itemsReused) : "—",
      label: t("items reused"),
      trend: stats?.trend.itemsReused ?? null,
    },
    {
      icon: LeafIcon,
      value: stats ? stats.wasteDiverted : "—",
      label: t("organic waste diverted"),
      trend: stats?.trend.wasteDiverted ?? null,
    },
    {
      icon: LoopIcon,
      value: stats ? String(stats.exchanges) : "—",
      label: t("exchanges made"),
      trend: stats?.trend.exchanges ?? null,
    },
  ];

  return (
    <Card className="self-start p-4">
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {tiles.map(({ icon: Icon, value, label, trend }) => (
          <div key={label} className="px-3.5 first:pl-0 last:pr-0">
            <Icon className="h-6 w-6 text-brand-500" />
            <p className="mt-2.5 text-[17px] font-bold leading-none text-gray-900">
              {value}
              {!stats && <span className="sr-only"> (loading)</span>}
            </p>
            <p className="mt-1 text-[10.5px] leading-tight text-gray-500">
              {label}
            </p>
            {trend !== null && (
              <p
                className={`mt-2 flex items-center gap-1 text-[10.5px] font-semibold ${
                  trend >= 0 ? "text-brand-500" : "text-red-500"
                }`}
              >
                <ArrowUpIcon
                  className={`h-3 w-3 ${trend >= 0 ? "" : "rotate-180"}`}
                />
                {Math.abs(trend)}%
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Recent activity — the user's latest 3 real entries ───────── */

export function RecentActivityCard() {
  const [entries, setEntries] = useState<ActivityEntry[] | null>(null);
  const t = useT();

  useEffect(() => {
    let cancelled = false;
    fetchActivity()
      .then((response) => {
        if (!cancelled) setEntries(response.data.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card>
      <CardHeader
        title={t("Recent Activity")}
        icon={ClockIcon}
        action={{ label: t("View all"), href: "/activity" }}
      />
      {entries === null ? (
        <ul className="mt-2 divide-y divide-gray-100">
          {[0, 1, 2].map((index) => (
            <li key={index} className="flex items-center gap-3.5 py-4">
              <div className="h-[62px] w-[62px] shrink-0 animate-pulse rounded-2xl bg-gray-100" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-2/3 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
              </div>
            </li>
          ))}
        </ul>
      ) : entries.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-gray-500">
          {t("No activity yet — scan your first item!")}
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-gray-100">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center gap-3.5 py-4">
              <ActivityArt
                artKey={entry.artKey}
                className="h-[62px] w-[62px] shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-1.5 text-[14px] font-semibold text-gray-900">
                  {entry.title}
                  <ArrowRightIcon className="h-3.5 w-3.5 text-gray-900" />
                  {t(entry.tag)}
                </p>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  {entrySubtitle(entry, t)}
                </p>
              </div>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                <CheckIcon className="h-4 w-4" />
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ── Recommended — real ideas from /api/ideas ──────────────────── */

export function RecommendedCard() {
  const t = useT();
  const [ideas, setIdeas] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      time: string;
      tag: string;
      artKey: string;
    }>
  >([]);

  useEffect(() => {
    let cancelled = false;
    fetchIdeas()
      .then((response) => {
        if (!cancelled) setIdeas(response.data.slice(0, 3));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display flex items-center gap-2.5 text-[16px] font-semibold text-gray-900">
          <SparkleIcon className="h-5 w-5 text-brand-700" />
          {t("Recommended for you")}
        </h2>
        <ViewAllLink label={t("View all")} href="/discover" />
      </div>
      {ideas.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-gray-500">
          {t("Ideas you create or ask the assistant about will appear here.")}
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-gray-100">
          {ideas.map((idea) => (
            <li key={idea.id}>
              <Link
                href={`/scanner/diy?idea=${encodeURIComponent(idea.id)}`}
                className="group flex items-center gap-4 py-4"
              >
                <IdeaArt
                  artKey={idea.artKey}
                  className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-1.5 text-[14px] font-semibold text-gray-900">
                    {idea.title}
                    <ArrowRightIcon className="h-3.5 w-3.5 text-gray-900" />
                    {t(idea.tag)}
                  </p>
                  <p className="mt-0.5 text-[12px] text-gray-500">
                    {t(idea.tag)} · {idea.time}
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ── Nearby exchange — real listings from the API ──────────────── */

export function NearbyExchangeCard() {
  const t = useT();
  const [listings, setListings] = useState<
    Array<{
      id: string;
      title: string;
      distance: string;
      district: string;
      tag: string;
      image?: string;
    }>
  >([]);

  useEffect(() => {
    let cancelled = false;
    fetchListings({ sortByDistance: true })
      .then((response) => {
        if (!cancelled) setListings(response.data.slice(0, 3));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display flex items-center gap-2.5 text-[15px] font-semibold leading-snug text-gray-900">
          <MapPinIcon className="h-5 w-5 shrink-0 text-gray-900" />
          {t("Nearby Exchange")}
          <br />
          {t("Opportunities")}
        </h2>
        <Link
          href="/exchange"
          className="flex shrink-0 items-center gap-1.5 text-right text-[12.5px] font-semibold leading-snug text-brand-500 transition-colors hover:text-brand-700"
        >
          {t("View")}
          <br />
          {t("map")}
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
      {listings.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-gray-500">
          {t("No listings yet — post one from the Exchange page.")}
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-3 gap-3">
          {listings.map((listing) => (
            <li key={listing.id}>
              <Link href={`/exchange/${listing.id}`} className="block">
                {listing.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.image}
                    alt=""
                    className="h-[74px] w-full rounded-xl object-cover"
                  />
                ) : (
                  <ItemArt
                    artKey={listing.id}
                    className="h-[74px] w-full rounded-xl object-cover"
                  />
                )}
                <p className="mt-2 truncate text-[12px] font-semibold text-gray-900">
                  {listing.title}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-500">
                  {listing.distance} · {listing.district}
                </p>
                <span className="mt-2 inline-block rounded-full bg-brand-50 px-2.5 py-1 text-[10.5px] font-semibold text-brand-700">
                  {t(listing.tag)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ── Recent chat — the user's latest assistant exchange ────────── */

interface HistoryMessage {
  id: string;
  role: "user" | "assistant";
  text?: string;
  timestamp: string;
}

export function RecentChatCard() {
  const t = useT();
  const [last, setLast] = useState<HistoryMessage | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ data: HistoryMessage[] }>("/api/ai/assistant/history")
      .then((response) => {
        if (!cancelled) {
          setLast(response.data[response.data.length - 1] ?? null);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card>
      <CardHeader
        title={t("Recent Chat")}
        icon={ChatIcon}
        action={{ label: t("View all"), href: "/assistant" }}
      />
      <Link
        href="/assistant"
        className="mt-4 flex items-center gap-3.5"
        aria-label={t("Waste Assistant chat")}
      >
        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
          <BotIcon className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-gray-900">
            {t("Waste Assistant")}
            {last && (
              <span className="text-[10.5px] font-normal text-gray-500">
                {formatRelative(last.timestamp, t)}
              </span>
            )}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-gray-500">
            {last
              ? last.text
              : t("Ask the assistant what to do with your waste.")}
          </p>
        </div>
        <ArrowRightIcon className="h-4 w-4 shrink-0 self-start text-gray-900" />
      </Link>
    </Card>
  );
}

/**
 * Activity row subtitle, as in the design: "Today · 2.5 kg" when the
 * user reported a weight, otherwise the place the action happened.
 */
function entrySubtitle(entry: ActivityEntry, t: Translate): string {
  const day = formatDay(entry.timestamp, t);
  const detail =
    entry.wasteKg !== undefined ? `${entry.wasteKg} kg` : entry.location;
  return detail ? `${day} · ${detail}` : day;
}

function formatDay(iso: string, t: Translate): string {
  const date = new Date(iso);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const days = Math.floor(
    (startOfToday.getTime() - new Date(date).setHours(0, 0, 0, 0)) / 86_400_000,
  );
  if (days <= 0) return t("Today");
  if (days === 1) return t("Yesterday");
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatRelative(iso: string, t: Translate): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return t("just now");
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
