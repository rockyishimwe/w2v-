import Link from "next/link";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  ClockIcon,
  LeafIcon,
  LightbulbIcon,
  RecycleIcon,
  ShareIcon,
} from "./icons";
import {
  IdeaHangingLightsArt,
  IdeaHerbPlanterArt,
  IdeaLanternArt,
  IdeaStorageJarArt,
} from "./diy-art";
import { SIMILAR_IDEAS } from "@/constants/diy-guide";

const IDEA_ART = [IdeaLanternArt, IdeaHangingLightsArt, IdeaHerbPlanterArt, IdeaStorageJarArt];

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
            By reusing this glass jar, you&rsquo;re reducing waste and giving
            the material a second life!
          </p>
        </div>
      </div>
    </section>
  );
}

export function DiySimilarIdeasCard() {
  return (
    <section className="rounded-[32px] border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display flex items-center gap-2.5 text-[17px] font-bold text-brand-900">
          <LightbulbIcon className="h-5 w-5 text-brand-700" />
          Similar Ideas
        </h2>
        <Link
          href="/scanner"
          className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-500 transition-colors hover:text-brand-700"
        >
          See all
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ul className="mt-4 space-y-3">
        {SIMILAR_IDEAS.map(({ title, tag, time, impact }, index) => {
          const Art = IDEA_ART[index] ?? IdeaLanternArt;
          const TagIcon = IDEA_ICONS[tag];
          return (
            <li key={title}>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-2.5 transition-colors">
                <Art className="h-[52px] w-[52px] shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[14px] font-bold text-gray-900">
                    {title}
                    <span className="inline-flex items-center gap-1 rounded-full bg-pale-green px-2 py-0.5 text-[10.5px] font-bold text-brand-700">
                      <TagIcon className="h-3 w-3" />
                      {tag}
                    </span>
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5" />
                      {time}
                    </span>
                    <span className="flex items-center gap-1">
                      <LeafIcon className="h-3.5 w-3.5" />
                      {impact}
                    </span>
                  </p>
                </div>
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" />
              </div>
            </li>
          );
        })}
      </ul>
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
            className="mt-3 flex h-10 items-center gap-2 rounded-xl border border-brand-500 bg-white px-4 text-[13px] font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            <ShareIcon className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </section>
  );
}
