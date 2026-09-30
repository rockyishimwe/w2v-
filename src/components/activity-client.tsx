"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BagIcon,
  BellIcon,
  CalendarIcon,
  CameraIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  ExchangeIcon,
  LeafIcon,
  MapPinIcon,
  RecycleIcon,
  UpDownIcon,
} from "./icons";
import { AvatarArt } from "./dashboard-art";
import { ActivityArt } from "./activity-art";
import {
  ACTIVITY_BANNER,
  ACTIVITY_FILTERS,
  ACTIVITY_QUICK_ACTIONS,
  type ActivityTypeFilter,
} from "@/constants/activity";
import {
  fetchActivity,
  type ActivityEntry,
  type ActivityStats,
  type ActivityImpact,
} from "@/services/activity-service";
import { filterActivityEntries } from "@/lib/activity-filters";

const TAG_STYLES: Record<string, string> = {
  Recycling: "bg-brand-100 text-brand-800",
  Reuse: "bg-brand-100 text-brand-800",
  Exchange: "bg-brand-100 text-brand-800",
  Scan: "bg-brand-100 text-brand-800",
};

/** Left circle icon per feed-row tag (solid dark-green disc). */
const TAG_ICONS: Record<
  string,
  (props: { className?: string }) => React.ReactNode
> = {
  Recycling: RecycleIcon,
  Reuse: UpDownIcon,
  Exchange: UpDownIcon,
  Scan: CameraIcon,
};

const chipBase =
  "flex h-[46px] items-center gap-2 rounded-full border px-5 text-[13.5px] font-semibold transition-colors";

const DAY_MS = 86_400_000;

/** Formats an ISO timestamp like the design: "Today, 10:24 AM". */
function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const daysAgo = Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS);
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (daysAgo <= 0) return `Today, ${time}`;
  if (daysAgo === 1) return `Yesterday, ${time}`;
  if (daysAgo < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

export function ActivityClient() {
  const [filter, setFilter] = useState<ActivityTypeFilter>("All");

  // Real data from the API (feed + stats + impact for the signed-in user).
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [impact, setImpact] = useState<ActivityImpact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchActivity("All")
      .then((response) => {
        if (cancelled) return;
        setEntries(response.data);
        setStats(response.stats);
        setImpact(response.impact);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Couldn't load your activity. Please try again.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleEntries = useMemo(
    () => filterActivityEntries(entries, filter),
    [entries, filter],
  );

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <ClockIcon className="mt-1.5 h-7 w-7 text-gray-900" />
          <div>
            <h1 className="font-display text-[30px] font-bold leading-none text-black">
              My Activity
            </h1>
            <p className="mt-2.5 text-[14px] text-[#607493]">
              Track your actions, impact and progress
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-4 pt-1 sm:flex-nowrap">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.05)] transition-colors hover:text-brand-700"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500" />
          </button>

          <button
            type="button"
            aria-label="Account menu"
            className="flex shrink-0 items-center gap-1.5"
          >
            <AvatarArt className="h-11 w-11 rounded-full object-cover" />
            <ChevronDownIcon className="h-5 w-5 text-gray-900" />
          </button>
        </div>
      </header>

      {/* ── Summary card: banner + stat tiles ───────────────────── */}
      <section className="mt-6 grid grid-cols-1 gap-4 rounded-[28px] border border-gray-100 bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.05)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-5 lg:p-5">
        {/* Banner */}
        <div className="flex items-center gap-4 rounded-3xl bg-pale-green px-4 py-6 sm:gap-6 sm:px-7 sm:py-8">
          <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <LeafIcon className="h-9 w-9" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-[19px] font-bold text-gray-900 sm:text-[21px]">
              {ACTIVITY_BANNER.title}
            </h2>
            <p className="mt-1.5 max-w-[52ch] text-[13.5px] leading-relaxed text-gray-600">
              {ACTIVITY_BANNER.body}
            </p>
          </div>
        </div>

        {/* Stat tiles — real numbers from the API */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4">
          <StatTile
            icon={<RecycleIcon className="h-6 w-6" />}
            value={stats ? String(stats.itemsReused) : "—"}
            label="Items reused"
          />
          <StatTile
            icon={<BagIcon className="h-6 w-6" />}
            value={stats ? stats.wasteDiverted : "—"}
            label="Waste diverted"
          />
          <StatTile
            icon={<ExchangeIcon className="h-6 w-6" />}
            value={stats ? String(stats.exchanges) : "—"}
            label="Exchanges"
          />
        </div>
      </section>

      {/* ── Content grid ────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(380px,1fr)]">
        {/* Left column: filters + feed */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Filter row + date-range chip */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Filter activity by type"
              className="flex flex-wrap gap-2.5"
            >
              {ACTIVITY_FILTERS.map((option) => {
                const active = filter === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(option)}
                    className={`${chipBase} ${
                      active
                        ? "border-brand-700 bg-brand-700 text-white shadow-[0_8px_18px_rgba(20,92,54,0.28)]"
                        : "border-gray-100 bg-white text-gray-900 hover:border-brand-300"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Date range: last 30 days"
              className={`${chipBase} border-gray-100 bg-white hover:border-brand-300`}
            >
              <CalendarIcon className="h-4.5 w-4.5 text-gray-900" />
              Last 30 days
              <ChevronDownIcon className="h-4 w-4 text-gray-700" />
            </button>
          </div>

          {/* Feed */}
          {loading ? (
            <ul className="flex flex-col gap-4">
              {[0, 1, 2].map((index) => (
                <li
                  key={index}
                  className="h-[104px] animate-pulse rounded-[28px] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.05)]"
                />
              ))}
            </ul>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 rounded-[28px] bg-white px-6 py-12 text-center shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
              <p className="text-[14px] font-semibold text-gray-900">{error}</p>
            </div>
          ) : visibleEntries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-[28px] bg-white px-6 py-12 text-center shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
              <ClockIcon className="h-8 w-8 text-brand-700" />
              <p className="text-[14px] font-semibold text-gray-900">
                No activity of this type yet.
              </p>
              <p className="text-[12.5px] text-gray-500">
                Log a scan, recycle or exchange to see it here.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {visibleEntries.map((entry) => (
                <ActivityRow key={entry.id} entry={entry} />
              ))}
            </ul>
          )}
        </div>

        {/* Right rail */}
        <div className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-7 xl:self-start">
          <ImpactCard impact={impact} />
          <QuickActionsCard />
        </div>
      </div>

      {/* Chat FAB */}
      <Link
        href="/assistant"
        className="fixed bottom-24 right-4 z-10 flex h-[48px] items-center gap-3 rounded-full bg-brand-700 px-5 text-[14.5px] font-semibold text-white shadow-[0_8px_16px_rgba(20,92,54,0.2)] transition-colors hover:bg-brand-800 md:bottom-6 md:right-9"
      >
        <ChatGlyph className="h-5 w-5" />
        Chat
      </Link>
    </>
  );
}

/* ── Summary stat tile ────────────────────────────────────────── */

function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-3 py-5 text-center lg:py-7">
      {icon}
      <p className="mt-2 text-[19px] font-bold leading-none text-gray-900">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] text-gray-500">{label}</p>
    </div>
  );
}

/* ── Feed row ─────────────────────────────────────────────────── */

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  const Icon = TAG_ICONS[entry.tag] ?? CameraIcon;
  return (
    <li className="relative flex items-center gap-4 rounded-[28px] border border-gray-100 bg-white py-4 pl-4 pr-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
      <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
        <Icon className="h-6 w-6" />
      </span>

      <ActivityArt
        artKey={entry.artKey}
        className="h-[68px] w-[68px] shrink-0 rounded-2xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-bold text-gray-900">
          {entry.title}
        </h3>
        <p className="mt-0.5 truncate text-[12.5px] text-gray-500">
          {entry.description}
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-[12px] text-gray-500">
          <MapPinIcon className="h-3.5 w-3.5 text-brand-700" />
          {entry.location}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className={`rounded-md px-2.5 py-1 text-[10.5px] font-bold ${TAG_STYLES[entry.tag]}`}
        >
          {entry.tag}
        </span>
        <p className="text-[11.5px] text-gray-500">
          {formatTimestamp(entry.timestamp)}
        </p>
      </div>

      <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-900" />
    </li>
  );
}

/* ── Your Impact card — real percent from the API ─────────────── */

function ImpactCard({ impact }: { impact: ActivityImpact | null }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const percent = impact?.percent ?? 0;
  const filled = (percent / 100) * circumference;

  return (
    <section className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[16px] font-semibold text-gray-900">
          Your Impact
        </h2>
        <ChevronRightIcon className="h-4 w-4 text-gray-900" />
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div className="relative h-[104px] w-[104px] shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#e4ede6"
              strokeWidth="13"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#145c36"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circumference - filled}`}
            />
          </svg>
          <p className="absolute inset-0 flex items-center justify-center text-[19px] font-bold text-gray-900">
            {percent}%
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-gray-500">Monthly goal</p>
          <p className="mt-1 text-[15px] font-bold text-gray-900">
            {impact ? impact.current : "—"}
            <span className="font-medium text-gray-500">
              {" "}
              / {impact ? impact.target : "—"}
            </span>
          </p>
          <div
            className="mt-3 h-2 rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Monthly goal progress"
          >
            <div
              className="h-full rounded-full bg-brand-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Quick Actions card ───────────────────────────────────────── */

function QuickActionsCard() {
  return (
    <section className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
      <h2 className="font-display text-[16px] font-semibold text-gray-900">
        Quick Actions
      </h2>
      <ul className="mt-4 space-y-3">
        {ACTIVITY_QUICK_ACTIONS.map(({ title, sub, href }) => (
          <li key={title}>
            <Link
              href={href}
              className="group flex items-center gap-3.5 rounded-2xl border border-gray-100 p-3.5 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
            >
              <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                <QuickActionGlyph title={title} className="h-[22px] w-[22px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold text-gray-900">
                  {title}
                </span>
                <span className="mt-0.5 block text-[11.5px] text-gray-500">
                  {sub}
                </span>
              </span>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-900 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Icon per quick-action title (kept in sync with constants/activity). */
function QuickActionGlyph({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  if (title === "Scan Waste") return <CameraIcon className={className} />;
  if (title === "Explore Ideas") return <MapPinIcon className={className} />;
  return <ExchangeIcon className={className} />;
}

/** Chat bubble glyph for the floating Chat button. */
function ChatGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v7A2.75 2.75 0 0 1 17.25 16.5H9l-4 3.5v-13.25Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
