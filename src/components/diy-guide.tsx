"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarsIcon,
  BookmarkIcon,
  ClipboardIcon,
  ClockIcon,
  CoinsIcon,
  LeafIcon,
  LightbulbIcon,
  PlayIcon,
} from "./icons";
import {
  MaterialJarArt,
  MaterialPlantArt,
  MaterialSoilArt,
  MaterialStonesArt,
  MaterialTwineArt,
} from "./diy-art";
import {
  fetchGuide,
  type DiyGuide as DiyGuidePayload,
} from "@/services/discover-service";
import { IdeaArt } from "./discover-art";

const MATERIAL_ART = [
  MaterialJarArt,
  MaterialSoilArt,
  MaterialStonesArt,
  MaterialPlantArt,
  MaterialTwineArt,
];

export function DiyTopBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div>
        <div className="flex items-center gap-4">
          <Link
            href="/scanner/result"
            aria-label="Back to scan result"
            className="text-gray-900 transition-colors hover:text-brand-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <path
                d="M19.5 12h-14m0 0L11 6.5M5.5 12l5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <h1 className="font-display text-[28px] font-bold leading-none text-gray-900">
            Scanner
          </h1>
        </div>
        <p className="mt-2 text-[14px] text-gray-500">
          Identify waste and discover what to do with it
        </p>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <label className="relative hidden min-w-0 max-w-[584px] flex-1 sm:block">
          <span className="sr-only">Search</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="6.25"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="m19.5 19.5-4.2-4.2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            name="search"
            placeholder="Search anything..."
            className="h-[52px] w-full rounded-full border border-gray-100 bg-white pl-12 pr-5 text-[14.5px] text-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.05)] placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </label>
      </div>
    </div>
  );
}

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-pale-green px-3 py-1.5 text-[11.5px] font-bold text-brand-700">
      <LeafIcon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

/**
 * Full DIY guide page body — fetches the AI-generated guide for the
 * requested idea (cache: server-side DB) and renders it. All content is
 * real AI output; there is no placeholder guide anymore.
 */
export function DiyGuideClient({ ideaId }: { ideaId?: string }) {
  const [guide, setGuide] = useState<DiyGuidePayload | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">(() =>
    ideaId ? "loading" : "error",
  );

  useEffect(() => {
    if (!ideaId) return;
    let cancelled = false;
    fetchGuide(ideaId)
      .then((payload) => {
        if (cancelled) return;
        setGuide(payload);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [ideaId]);

  if (state === "loading") {
    return (
      <div className="grid gap-6">
        <div className="h-[320px] animate-pulse rounded-[32px] bg-white" />
        <div className="h-[220px] animate-pulse rounded-[32px] bg-pale-green" />
        <div className="h-[260px] animate-pulse rounded-[32px] bg-pale-green" />
      </div>
    );
  }

  if (state === "error" || !guide) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[32px] bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
        <LightbulbIcon className="h-8 w-8 text-brand-700" />
        <p className="text-[15px] font-semibold text-gray-900">
          {ideaId
            ? "This guide couldn't be generated right now."
            : "Pick an idea on the Discover page to see its guide."}
        </p>
        <Link
          href="/discover"
          className="flex h-11 items-center rounded-xl bg-brand-700 px-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-800"
        >
          Browse ideas
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <DiyHeroCard guide={guide} />
      <DiyMaterialsCard guide={guide} />
      <DiyStepsCard guide={guide} />
    </div>
  );
}

function DiyHeroCard({ guide }: { guide: DiyGuidePayload }) {
  return (
    <section className="rounded-[32px] border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:p-7">
      <div className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        {/* Art keyed by the idea's own artKey */}
        <div className="relative aspect-square overflow-hidden rounded-[24px] bg-pale-green">
          <IdeaArt
            artKey={guide.id}
            className="absolute inset-0 h-full w-full"
          />
          <span className="absolute left-3 top-3">
            <TagPill label={guide.tag} />
          </span>
        </div>

        {/* Copy + meta + CTAs */}
        <div className="flex min-w-0 flex-col py-1">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-pale-green px-3.5 py-2 text-[11.5px] font-bold uppercase tracking-wide text-brand-700">
            <LeafIcon className="h-4 w-4" />
            Recommendation
          </span>

          <h2 className="font-display mt-3 text-[24px] font-bold leading-tight text-brand-900 sm:text-[28px]">
            {guide.title}
          </h2>

          <p className="mt-3 max-w-[520px] text-[13.5px] leading-relaxed text-gray-500">
            {guide.intro}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-4">
            <div className="flex items-center gap-2.5">
              <ClockIcon className="h-5 w-5 shrink-0 text-gray-700" />
              <div>
                <p className="text-[11.5px] leading-tight text-gray-500">
                  Time Needed
                </p>
                <p className="mt-0.5 text-[13.5px] font-bold leading-tight text-gray-900">
                  {guide.timeNeeded}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <BarsIcon className="h-5 w-5 shrink-0 text-gray-700" />
              <div>
                <p className="text-[11.5px] leading-tight text-gray-500">
                  Difficulty
                </p>
                <p className="mt-0.5 text-[13.5px] font-bold leading-tight text-gray-900">
                  {guide.difficulty}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <LeafIcon className="h-5 w-5 shrink-0 text-gray-700" />
              <div>
                <p className="text-[11.5px] leading-tight text-gray-500">
                  Impact
                </p>
                <p className="mt-0.5 text-[13.5px] font-bold leading-tight text-gray-900">
                  {guide.impact}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="flex h-[52px] items-center gap-2.5 rounded-2xl bg-brand-700 px-3 text-[14.5px] font-semibold text-white shadow-[0_10px_22px_rgba(20,92,54,0.28)] transition-colors hover:bg-brand-800"
            >
              <PlayIcon className="h-6 w-6" />
              Start DIY
            </button>
            <button
              type="button"
              className="flex h-[52px] items-center gap-2.5 rounded-2xl border border-brand-500 bg-white px-3 text-[14.5px] font-semibold text-brand-700 transition-colors hover:bg-brand-50"
            >
              <BookmarkIcon className="h-5 w-5" />
              Save Idea
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiyMaterialsCard({ guide }: { guide: DiyGuidePayload }) {
  return (
    <section className="rounded-[32px] bg-pale-green p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display flex items-center gap-3 text-[19px] font-bold text-brand-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
            <ClipboardIcon className="h-5 w-5" />
          </span>
          Materials Needed
        </h2>
        <p className="flex items-center gap-2 text-[13px] font-semibold text-gray-600">
          <CoinsIcon className="h-5 w-5 text-gray-600" />
          Estimated cost: {guide.estimatedCost}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-[24px] bg-white p-4 sm:grid-cols-3 lg:grid-cols-5 sm:p-5">
        {guide.materials.map(({ name, note }, index) => {
          const Art = MATERIAL_ART[index] ?? MaterialJarArt;
          return (
            <div
              key={`${name}-${index}`}
              className="flex flex-col items-center rounded-2xl bg-[#f7fbf8] px-3 py-4 text-center"
            >
              <Art className="h-14 w-14" />
              <p className="mt-2.5 text-[13px] font-bold text-gray-900">
                {name}
              </p>
              {note && (
                <p className="mt-0.5 text-[11.5px] text-gray-500">{note}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DiyStepsCard({ guide }: { guide: DiyGuidePayload }) {
  return (
    <section className="rounded-[32px] bg-pale-green p-5 sm:p-6">
      <h2 className="font-display flex items-center gap-3 text-[19px] font-bold text-brand-900">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
          <LightbulbIcon className="h-5 w-5" />
        </span>
        Step-by-Step Instructions
      </h2>

      <div className="mt-5 rounded-[24px] bg-white p-5 sm:p-7">
        <ol className="space-y-6">
          {guide.steps.map(({ title, description }, index) => (
            <li key={`${title}-${index}`} className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[13px] font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-display text-[15px] font-bold text-gray-900">
                  {title}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-gray-500">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
