import Link from "next/link";
import { ArrowLeftIcon, BellIcon, ChevronDownIcon, SearchIcon } from "./icons";
import { AvatarArt } from "./dashboard-art";

export function ScannerTopBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div>
        <div className="flex items-center gap-4">
          <Link
            href="/scanner"
            aria-label="Back to scanner"
            className="text-gray-900 transition-colors hover:text-brand-700"
          >
            <ArrowLeftIcon className="h-8 w-8" />
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
    </div>
  );
}
