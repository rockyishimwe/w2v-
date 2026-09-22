import Link from "next/link";
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
import { DIY_GUIDE } from "@/constants/diy-guide";

const MATERIAL_ART = [
  MaterialJarArt,
  MaterialSoilArt,
  MaterialStonesArt,
  MaterialPlantArt,
  MaterialTwineArt,
];

const GUIDE = DIY_GUIDE;

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

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.05)] transition-colors hover:text-brand-700"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="M18 15.5H6c1.2-1.1 1.8-2.6 1.8-4.6 0-2.9 1.9-4.9 4.2-4.9s4.2 2 4.2 4.9c0 2 .6 3.5 1.8 4.6Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M10.3 18.2a1.8 1.8 0 0 0 3.4 0"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500" />
        </button>

        <button
          type="button"
          aria-label="Account menu"
          className="flex shrink-0 items-center gap-1.5"
        >
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-brand-100">
            <svg
              viewBox="0 0 96 96"
              className="h-full w-full"
              aria-hidden="true"
            >
              <rect width="96" height="96" fill="#e8ded2" />
              <path
                d="M27 50c-3-18 8-29 21-29s24 11 21 29l-3.5 14h-35Z"
                fill="#2e2620"
              />
              <circle cx="48" cy="47" r="13.5" fill="#c68863" />
              <path d="M28 96c2-15 9-21 20-21s18 6 20 21Z" fill="#35414b" />
            </svg>
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 text-gray-900"
            aria-hidden="true"
          >
            <path
              d="m6.5 9.5 5.5 5 5.5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
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

export function DiyHeroCard() {
  return (
    <section className="rounded-[32px] border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:p-7">
      <div className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        {/* Photo */}
        <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#c9ad85]">
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <rect width="400" height="400" fill="#3a3f45" />
            <rect x="0" y="238" width="400" height="162" fill="#a97845" />
            <path d="M0 238h400v10H0Z" fill="#8f6238" />
            <g>
              <rect
                x="74"
                y="118"
                width="140"
                height="26"
                rx="8"
                fill="#191b1e"
              />
              <rect
                x="74"
                y="118"
                width="140"
                height="9"
                rx="4.5"
                fill="#303338"
              />
              <path
                d="M80 144h128v158a26 26 0 0 1-26 26H106a26 26 0 0 1-26-26V144Z"
                fill="#cfd8d4"
                opacity="0.55"
              />
              <path d="M80 144h128v14H80Z" fill="#9fb0aa" opacity="0.6" />
            </g>
            <g>
              <rect
                x="212"
                y="140"
                width="128"
                height="24"
                rx="8"
                fill="#b98d3e"
              />
              <rect
                x="212"
                y="140"
                width="128"
                height="8"
                rx="4"
                fill="#d8b055"
              />
              <path
                d="M218 164h116v140a24 24 0 0 1-24 24H242a24 24 0 0 1-24-24V164Z"
                fill="#d6ded9"
                opacity="0.6"
              />
            </g>
          </svg>
          <span className="absolute left-3 top-3">
            <TagPill label="DIY" />
          </span>
        </div>

        {/* Copy + meta + CTAs */}
        <div className="flex min-w-0 flex-col py-1">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-pale-green px-3.5 py-2 text-[11.5px] font-bold uppercase tracking-wide text-brand-700">
            <LeafIcon className="h-4 w-4" />
            Recommendation
          </span>

          <h2 className="font-display mt-3 text-[24px] font-bold leading-tight text-brand-900 sm:text-[28px]">
            {GUIDE.title}
          </h2>

          <p className="mt-3 max-w-[520px] text-[13.5px] leading-relaxed text-gray-500">
            {GUIDE.intro}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-4">
            <div className="flex items-center gap-2.5">
              <ClockIcon className="h-5 w-5 shrink-0 text-gray-700" />
              <div>
                <p className="text-[11.5px] leading-tight text-gray-500">
                  Time Needed
                </p>
                <p className="mt-0.5 text-[13.5px] font-bold leading-tight text-gray-900">
                  {GUIDE.timeNeeded}
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
                  {GUIDE.difficulty}
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
                  {GUIDE.impact}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="flex h-[52px] items-center gap-2.5 rounded-2xl bg-brand-700 px-7 text-[14.5px] font-semibold text-white shadow-[0_10px_22px_rgba(20,92,54,0.28)] transition-colors hover:bg-brand-800"
            >
              <PlayIcon className="h-6 w-6" />
              Start DIY
            </button>
            <button
              type="button"
              className="flex h-[52px] items-center gap-2.5 rounded-2xl border border-brand-500 bg-white px-7 text-[14.5px] font-semibold text-brand-700 transition-colors hover:bg-brand-50"
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

export function DiyMaterialsCard() {
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
          Estimated cost: {GUIDE.estimatedCost}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-[24px] bg-white p-4 sm:grid-cols-3 lg:grid-cols-5 sm:p-5">
        {GUIDE.materials.map(({ name, note }, index) => {
          const Art = MATERIAL_ART[index] ?? MaterialJarArt;
          return (
            <div
              key={name}
              className="flex flex-col items-center rounded-2xl bg-[#f7fbf8] px-3 py-4 text-center"
            >
              <Art className="h-14 w-14" />
              <p className="mt-2.5 text-[13px] font-bold text-gray-900">
                {name}
              </p>
              <p className="mt-0.5 text-[11.5px] text-gray-500">{note}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function DiyStepsCard() {
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
          {GUIDE.steps.map(({ title, description }, index) => (
            <li key={title} className="flex items-start gap-4">
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
