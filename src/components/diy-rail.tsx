"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  ClockIcon,
  LeafIcon,
  LightbulbIcon,
  RecycleIcon,
  ShareIcon,
} from "./icons";
import { IdeaArt } from "./discover-art";
import { fetchIdeas } from "@/services/discover-service";
import type { DiscoverIdea } from "@/services/discover-service";

const IDEA_ICONS = { DIY: LightbulbIcon, Reuse: RecycleIcon } as const;

export function DiyImpactNote() {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-pale-green p-5">
      {/* Watermark sits behind the content, tucked into the corner. */}
      <LeafIcon className="pointer-events-none absolute -bottom-3 -right-1 h-12 w-12 rotate-[20deg] text-brand-200/50" />

      <div className="relative z-10 flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
          <LeafIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 pr-8">
          <p className="font-display text-[14.5px] font-bold text-gray-900">
            Small change. Big impact.
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">
            By reusing items instead of throwing them away, you&rsquo;re
            reducing waste and giving materials a second life!
          </p>
        </div>
      </div>
    </section>
  );
}

/** "Similar Ideas" — real ideas from the API, excluding the open one. */
export function DiySimilarIdeasCard({ excludeId }: { excludeId?: string }) {
  const [ideas, setIdeas] = useState<DiscoverIdea[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchIdeas()
      .then((response) => {
        if (!cancelled) {
          setIdeas(
            response.data.filter((idea) => idea.id !== excludeId).slice(0, 4),
          );
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [excludeId]);

  return (
    <section className="rounded-[32px] border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display flex items-center gap-2.5 text-[17px] font-bold text-brand-900">
          <LightbulbIcon className="h-5 w-5 text-brand-700" />
          Similar Ideas
        </h2>
        <Link
          href="/discover"
          className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-700 transition-colors hover:text-brand-500"
        >
          See all
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      {ideas.length === 0 ? (
        <p className="mt-4 text-[13px] text-gray-500">
          No other ideas yet — explore the Discover page to create some.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {ideas.map((idea) => {
            const TagIcon = IDEA_ICONS[idea.tag];
            return (
              <li key={idea.id}>
                <Link
                  href={`/scanner/diy?idea=${encodeURIComponent(idea.id)}`}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 p-2.5 transition-colors hover:border-brand-200"
                >
                  <IdeaArt
                    artKey={idea.artKey}
                    className="h-[52px] w-[52px] shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[14px] font-bold text-gray-900">
                      {idea.title}
                      <span className="inline-flex items-center gap-1 rounded-full bg-pale-green px-2 py-0.5 text-[10.5px] font-bold text-brand-700">
                        <TagIcon className="h-3 w-3" />
                        {idea.tag}
                      </span>
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {idea.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <LeafIcon className="h-3.5 w-3.5" />
                        {idea.impact}
                      </span>
                    </p>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function DiyShareCard() {
  return (
    <section className="rounded-[28px] bg-pale-green p-5">
      <div className="flex items-start gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
          <ShareIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[14.5px] font-bold text-gray-900">
            Share this idea
          </p>
          <p className="mt-0.5 text-[12.5px] text-gray-600">
            Help others give waste a new purpose!
          </p>
          <button
            type="button"
            className="mt-3 flex h-10 items-center gap-2 rounded-xl border border-brand-500 bg-white px-3 text-[13px] font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            <ShareIcon className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </section>
  );
}
