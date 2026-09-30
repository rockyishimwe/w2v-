"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
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
import { fetchActivity, type ActivityEntry } from "@/services/activity-service";
import { fetchIdeas } from "@/services/discover-service";
import { fetchListings } from "@/services/exchange-service";
import { api } from "@/lib/api-client";
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
}: {
  title: string;
  icon: (props: { className?: string }) => React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-display flex items-center gap-2.5 text-[16px] font-semibold text-gray-900">
        <Icon className="h-5 w-5 text-gray-900" />
        {title}
      </h2>
    </div>
  );
}

export function ScanWasteCard() {
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
            Scan Waste
          </h2>
          <p className="mt-1 text-[12.5px] leading-snug text-white/85">
            Identify what you have and discover the best next steps.
          </p>
        </div>
        <Link
          href="/scanner"
          aria-label="Open scanner"
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
  const [stats, setStats] = useState<{
    itemsReused: number;
    exchanges: number;
    wasteDiverted: string;
  } | null>(null);
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
  const tiles = [
    {
      icon: RecycleIcon,
      value: stats ? String(stats.itemsReused) : "—",
      label: "items reused",
      delta: null,
    },
    {
      icon: LeafIcon,
      value: stats ? stats.wasteDiverted : "—",
      label: "waste diverted",
      delta: null,
    },
    {
      icon: LoopIcon,
      value: stats ? String(stats.exchanges) : "—",
      label: "exchanges made",
      delta: null,
    },
  ];

  return (
    <Card className="mt-[13px] self-start p-3.5">
      <div className="grid grid-cols-3 gap-3">
        {tiles.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-100 px-2.5 py-3"
          >
            <Icon className="h-6 w-6 text-brand-500" />
            <p className="mt-1.5 text-[16px] font-bold leading-none text-gray-900">
              {value}
              {!stats && <span className="sr-only"> (loading)</span>}
            </p>
            <p className="mt-1 text-[10.5px] leading-tight text-gray-500">
              {label}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Recent activity — the user's latest 3 real entries ───────── */

export function RecentActivityCard() {
  const [entries, setEntries] = useState<ActivityEntry[] | null>(null);

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
      <CardHeader title="Recent Activity" icon={ClockIcon} />
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
          No activity yet — scan your first item!
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
                  {entry.tag}
                </p>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  {entry.location}
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
          <SparkleIcon className="h-5 w-5 text-gray-900" />
          Recommended for you
        </h2>
      </div>
      {ideas.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-gray-500">
          Ideas you create or ask the assistant about will appear here.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-gray-100">
          {ideas.map((idea) => (
            <li key={idea.id} className="flex items-center gap-4 py-4">
              <IdeaArt
                artKey={idea.artKey}
                className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-1.5 text-[14px] font-semibold text-gray-900">
                  {idea.title}
                  <ArrowRightIcon className="h-3.5 w-3.5 text-gray-900" />
                  {idea.tag}
                </p>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  {idea.tag} · {idea.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ── Nearby exchange — real listings from the API ──────────────── */

export function NearbyExchangeCard() {
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
          Nearby Exchange
          <br />
          Opportunities
        </h2>
        <Link
          href="/exchange"
          className="flex shrink-0 items-center gap-1.5 text-right text-[12.5px] font-semibold leading-snug text-brand-500 transition-colors hover:text-brand-700"
        >
          View
          <br />
          all
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
      {listings.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-gray-500">
          No listings yet — post one from the Exchange page.
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
                  {listing.tag}
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
      <CardHeader title="Recent Chat" icon={ChatIcon} />
      <Link
        href="/assistant"
        className="mt-4 flex items-center gap-3.5"
        aria-label="Open chat with Waste Assistant"
      >
        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
          <BotIcon className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-gray-900">
            Waste Assistant
            {last && (
              <span className="text-[10.5px] font-normal text-gray-500">
                {formatRelative(last.timestamp)}
              </span>
            )}
          </p>
          <p className="mt-0.5 truncate text-[12px] text-gray-500">
            {last ? last.text : "Ask the assistant what to do with your waste."}
          </p>
        </div>
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-gray-900" />
      </Link>
    </Card>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
