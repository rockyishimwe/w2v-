"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AppleIcon,
  BellIcon,
  BotIcon,
  BoxIcon,
  BottleIcon,
  ChatSolidIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  CompassIcon,
  GridSquaresIcon,
  HeartIcon,
  JarIcon,
  LeafIcon,
  LightbulbIcon,
  RecycleIcon,
  SearchIcon,
  ShirtIcon,
  SparkleIcon,
} from "./icons";
import { AvatarArt } from "./dashboard-art";
import {
  ASSISTANT_CARD,
  DID_YOU_KNOW,
  DISCOVER_CATEGORIES,
  DISCOVER_HERO,
  POPULAR_SEARCHES,
  RECOMMENDED_IDEAS,
  RECYCLING_TIPS,
  TRENDING_IDEAS,
  filterIdeasByCategory,
  type DiscoverCategoryFilter,
  type DiscoverIdea,
} from "@/constants/discover";
import {
  DiscoverHeroArt,
  DiscoverLeafWatermarkArt,
  IdeaArt,
} from "./discover-art";

/** Icon per category chip label ("All" uses a grid-of-squares glyph). */
const CATEGORY_ICONS: Record<
  DiscoverCategoryFilter,
  (props: { className?: string }) => React.ReactNode
> = {
  All: GridSquaresIcon,
  Plastic: BottleIcon,
  Glass: JarIcon,
  Cardboard: BoxIcon,
  Organic: AppleIcon,
  Textile: ShirtIcon,
};

/** The DIY guide page is the detail view for every idea card. */
const IDEA_DETAIL_HREF = "/scanner/diy" as const;

export function DiscoverClient() {
  const [category, setCategory] = useState<DiscoverCategoryFilter>("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const trending = useMemo(
    () => filterIdeasByCategory(TRENDING_IDEAS, category),
    [category],
  );
  const recommended = useMemo(
    () => filterIdeasByCategory(RECOMMENDED_IDEAS, category),
    [category],
  );

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="font-display text-[30px] font-bold leading-none text-black">
            Discover
          </h1>
          <p className="mt-2.5 text-[14px] text-[#607493]">
            Explore creative ways to give new life to your waste
          </p>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-4 pt-1 sm:flex-nowrap">
          <label className="relative order-last block w-full min-w-0 sm:order-none sm:w-auto sm:max-w-[520px] sm:flex-1">
            <span className="sr-only">Search ideas</span>
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              name="search"
              placeholder="Search anything..."
              className="h-[52px] w-full rounded-full border border-gray-100 bg-white pl-12 pr-5 text-[14.5px] text-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.05)] placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>

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

      {/* ── Content grid ────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(400px,1fr)]">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-6">
          {/* Hero banner */}
          <section className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
            <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,42%)]">
              <div className="flex flex-col items-start p-7 sm:p-9">
                <span className="flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-[12px] font-semibold text-brand-700">
                  <LeafIcon className="h-3.5 w-3.5" />
                  {DISCOVER_HERO.pill}
                </span>
                <h2 className="font-display mt-4 whitespace-pre-line text-[26px] font-bold leading-[1.15] text-brand-900 sm:text-[32px]">
                  {DISCOVER_HERO.title}
                </h2>
                <p className="mt-3 max-w-[46ch] text-[13.5px] leading-relaxed text-gray-600">
                  {DISCOVER_HERO.body}
                </p>
                <Link
                  href="/scanner"
                  className="mt-6 flex h-[48px] items-center gap-2.5 rounded-full bg-brand-700 px-6 text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(20,92,54,0.28)] transition-colors hover:bg-brand-800"
                >
                  {DISCOVER_HERO.cta}
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </div>
              <DiscoverHeroArt className="hidden h-full w-full object-cover md:block" />
            </div>
          </section>

          {/* Browse by Category */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <h2 className="font-display text-[17px] font-bold text-gray-900">
              Browse by Category
            </h2>
            <button
              type="button"
              onClick={() => setCategory("All")}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 transition-colors hover:text-brand-500"
            >
              View all
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {DISCOVER_CATEGORIES.map(({ label }) => {
              const Icon = CATEGORY_ICONS[label];
              const active = category === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setCategory(label)}
                  aria-pressed={active}
                  className={`flex h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border text-[12.5px] font-semibold transition-colors ${
                    active
                      ? "border-brand-300 bg-brand-50 text-brand-700"
                      : "border-gray-100 bg-white text-gray-900 hover:border-brand-200"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Trending Ideas */}
          <IdeaRailCard
            icon={<LightbulbIcon className="h-5 w-5 text-brand-700" />}
            title="Trending Ideas"
            subtitle="Popular reuse ideas in your area"
            ideas={trending}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onReset={() => setCategory("All")}
          />

          {/* Recommended for You */}
          <IdeaRailCard
            icon={<SparkleIcon className="h-5 w-5 text-brand-700" />}
            title="Recommended for You"
            subtitle="Based on your interests and recent scans"
            ideas={recommended}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onReset={() => setCategory("All")}
          />
        </div>

        {/* Right rail — solid sticky block (no internal scrolling) */}
        <div className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-7 xl:self-start">
          {/* Did you know? */}
          <section className="rounded-[24px] bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.045)]">
            <div className="relative overflow-hidden rounded-2xl bg-pale-green p-5">
              <DiscoverLeafWatermarkArt className="pointer-events-none absolute -bottom-2 right-1 h-14 w-14 text-brand-300/60" />
              <div className="relative z-10 flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
                  <CompassIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 pr-8">
                  <p className="font-display text-[14.5px] font-bold text-gray-900">
                    {DID_YOU_KNOW.title}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">
                    {DID_YOU_KNOW.body}
                  </p>
                </div>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-5">
              <h3 className="font-display flex items-center gap-2.5 text-[16px] font-bold text-gray-900">
                <SearchIcon className="h-5 w-5 text-brand-700" />
                Popular Searches
              </h3>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                {POPULAR_SEARCHES.map((term) => (
                  <Link
                    key={term}
                    href="/scanner"
                    className="flex h-[38px] items-center gap-2 rounded-full bg-pale-green px-4 text-[12.5px] font-semibold text-gray-700 transition-colors hover:bg-brand-100 hover:text-brand-700"
                  >
                    <SearchIcon className="h-3.5 w-3.5 text-brand-700" />
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Recycling Tips */}
          <section className="rounded-[24px] bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.045)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display flex items-center gap-2.5 text-[16px] font-bold text-gray-900">
                <LightbulbIcon className="h-5 w-5 text-brand-700" />
                Recycling Tips
              </h3>
              <Link
                href="/scanner"
                className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-700 transition-colors hover:text-brand-500"
              >
                View all
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <ul className="mt-2 divide-y divide-gray-100">
              {RECYCLING_TIPS.map((tip) => (
                <li key={tip}>
                  <button
                    type="button"
                    onClick={() => showToast("Tip articles are coming soon.")}
                    className="group flex w-full items-center gap-3 py-3.5 text-left"
                  >
                    <RecycleIcon className="h-4.5 w-4.5 shrink-0 text-brand-600" />
                    <span className="min-w-0 flex-1 text-[13.5px] font-medium text-gray-900">
                      {tip}
                    </span>
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-700 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Assistant card */}
            <div className="relative mt-4 overflow-hidden rounded-2xl bg-pale-green p-5">
              <DiscoverLeafWatermarkArt className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 text-brand-300/50" />
              <div className="relative z-10 flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
                  <BotIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[14.5px] font-bold text-gray-900">
                    {ASSISTANT_CARD.title}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">
                    {ASSISTANT_CARD.body}
                  </p>
                  <button
                    type="button"
                    onClick={() => showToast("Waste Assistant is coming soon.")}
                    className="mt-3 flex h-[44px] items-center gap-2.5 rounded-full bg-brand-700 px-5 text-[13.5px] font-semibold text-white shadow-[0_8px_18px_rgba(20,92,54,0.28)] transition-colors hover:bg-brand-800"
                  >
                    <ChatSolidIcon className="h-4.5 w-4.5" />
                    {ASSISTANT_CARD.cta}
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Chat FAB */}
      <button
        type="button"
        onClick={() => showToast("Waste Assistant is coming soon.")}
        className="fixed bottom-24 right-4 z-10 flex h-[48px] items-center gap-3 rounded-full bg-brand-700 px-5 text-[14.5px] font-semibold text-white shadow-[0_8px_16px_rgba(20,92,54,0.2)] transition-colors hover:bg-brand-800 md:bottom-6 md:right-9"
      >
        <ChatSolidIcon className="h-5 w-5" />
        Chat
      </button>

      {/* Toast */}
      <div aria-live="polite">
        {toast && (
          <div className="fixed bottom-40 left-1/2 z-30 -translate-x-1/2 rounded-full bg-gray-900 px-5 py-2.5 text-[13px] font-medium text-white shadow-lg md:bottom-8">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}

/* ── Idea rail (Trending / Recommended share one layout) ──────── */

function IdeaRailCard({
  icon,
  title,
  subtitle,
  ideas,
  favorites,
  onToggleFavorite,
  onReset,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  ideas: DiscoverIdea[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.045)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display flex items-center gap-2.5 text-[16px] font-bold text-gray-900">
            {icon}
            {title}
          </h2>
          <p className="mt-0.5 text-[12px] text-gray-500">{subtitle}</p>
        </div>
        <Link
          href="/scanner/diy"
          className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-700 transition-colors hover:text-brand-500"
        >
          View all
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl bg-pale-green px-6 py-8 text-center">
          <SparkleIcon className="h-7 w-7 text-brand-700" />
          <p className="text-[13.5px] font-semibold text-gray-900">
            Nothing here for this category yet.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-1 flex h-10 items-center rounded-xl bg-brand-700 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Show all categories
          </button>
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              favorite={favorites.has(idea.id)}
              onToggleFavorite={() => onToggleFavorite(idea.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

/* ── Idea card ────────────────────────────────────────────────── */

function IdeaCard({
  idea,
  favorite,
  onToggleFavorite,
}: {
  idea: DiscoverIdea;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <li className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-[0_10px_24px_rgba(17,24,39,0.08)]">
      {/* Detail target: the DIY guide page renders every idea's guide. */}
      <Link
        href={IDEA_DETAIL_HREF}
        className="absolute inset-0 z-10"
        aria-label={`Open ${idea.title} guide`}
      />
      <div className="relative aspect-[1.05]">
        <IdeaArt
          artKey={idea.artKey}
          className="absolute inset-0 h-full w-full"
        />
        <span className="absolute left-2.5 top-2.5 rounded-md bg-white/95 px-2 py-1 text-[10.5px] font-bold text-brand-700 shadow-sm">
          {idea.tag}
        </span>
      </div>
      <div className="p-3">
        <p className="truncate text-[13.5px] font-bold text-gray-900">
          {idea.title}
        </p>
        <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-gray-500">
          {idea.description}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <ClockIcon className="h-3.5 w-3.5 text-brand-600" />
            {idea.time}
          </p>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={
              favorite
                ? `Remove ${idea.title} from favorites`
                : `Save ${idea.title} to favorites`
            }
            aria-pressed={favorite}
            className={`relative z-20 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
              favorite
                ? "bg-brand-50 text-brand-700"
                : "text-gray-400 hover:text-brand-700"
            }`}
          >
            <HeartIcon
              className={`h-4 w-4 ${favorite ? "fill-brand-700" : ""}`}
            />
          </button>
        </div>
      </div>
    </li>
  );
}
