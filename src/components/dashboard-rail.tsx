import {
  ArrowRightIcon,
  BellIcon,
  BotIcon,
  CameraIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LeafIcon,
  LightbulbIcon,
  SearchIcon,
} from "./icons";
import { AvatarArt, QuoteHillsArt } from "./dashboard-art";
import { Card } from "./dashboard-cards";

const MONTHLY_GOAL = {
  percent: 68,
  current: "15 kg",
  target: "22 kg",
};

export function TopBar() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-5">
      <h1 className="text-[40px] font-bold leading-[1.08] text-gray-900 sm:text-[44px]">
        Good Morning
        <span className="block text-[44px] text-brand-500">Vanessa!</span>
      </h1>

      <div className="flex flex-1 items-center justify-end gap-4 pt-1">
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

export function ImpactCard() {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const filled = (MONTHLY_GOAL.percent / 100) * circumference;

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-semibold text-gray-900">Your Impact</h2>
        <a
          href="#"
          className="flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-500 transition-colors hover:text-brand-700"
        >
          View activity
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </a>
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
          <p className="absolute inset-0 flex items-center justify-center text-[22px] font-bold text-gray-900">
            {MONTHLY_GOAL.percent}%
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] text-gray-500">Monthly goal</p>
          <p className="mt-1 text-[17px] font-bold text-gray-900">
            {MONTHLY_GOAL.current}
            <span className="font-medium text-gray-500">
              {" "}
              / {MONTHLY_GOAL.target}
            </span>
          </p>
          <div
            className="mt-3 h-2 rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow={MONTHLY_GOAL.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Monthly goal progress"
          >
            <div
              className="h-full rounded-full bg-brand-700"
              style={{ width: `${MONTHLY_GOAL.percent}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

const QUICK_ACTIONS = [
  {
    icon: CameraIcon,
    title: "Scan Waste",
    sub: "Identify and get options",
  },
  {
    icon: LightbulbIcon,
    title: "Explore Ideas",
    sub: "DIY, reuse and more",
  },
  {
    icon: SearchIcon,
    title: "Find Exchange Items",
    sub: "Give or get materials",
  },
];

export function QuickActionsCard() {
  return (
    <Card>
      <h2 className="text-[19px] font-semibold text-gray-900">Quick Actions</h2>
      <ul className="mt-4 space-y-3">
        {QUICK_ACTIONS.map(({ icon: Icon, title, sub }) => (
          <li key={title}>
            <a
              href="#"
              className="group flex items-center gap-3.5 rounded-2xl border border-gray-100 p-3.5 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
            >
              <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                <Icon className="h-[22px] w-[22px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-gray-900">
                  {title}
                </span>
                <span className="mt-0.5 block text-[12.5px] text-gray-500">
                  {sub}
                </span>
              </span>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-900 transition-transform group-hover:translate-x-0.5" />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function HelpCard() {
  return (
    <a
      href="#"
      className="group flex items-center gap-3.5 rounded-[28px] bg-brand-50 p-5 transition-colors hover:bg-brand-100"
    >
      <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
        <BotIcon className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-gray-900">
          Need help?
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-gray-600">
          Chat with Waste Assistant
          <br />
          Ask anything about your waste.
        </span>
      </span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-900 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

export function QuoteCard() {
  return (
    <figure className="relative h-[150px] overflow-hidden rounded-[28px]">
      <QuoteHillsArt className="absolute inset-0 h-full w-full object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
      />
      <blockquote className="absolute inset-x-0 bottom-0 p-5 text-[17px] font-semibold leading-snug text-white">
        &ldquo;A cleaner Kigali,
        <LeafIcon className="mx-1 inline h-4 w-4 text-brand-200" />
        <br />
        starts with you.&rdquo;
      </blockquote>
    </figure>
  );
}
