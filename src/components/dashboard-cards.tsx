import Link from "next/link";
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
  BottlesPlantersArt,
  CardboardArt,
  FlowerPotsArt,
  FoodScrapArt,
  GlassJarsArt,
  SaladBowlArt,
  StackedBoxesArt,
} from "./dashboard-art";

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

const STATS = [
  {
    icon: RecycleIcon,
    value: "23",
    label: "items reused",
    delta: "12%",
  },
  {
    icon: LeafIcon,
    value: "8 kg",
    label: "organic waste diverted",
    delta: "8%",
  },
  {
    icon: LoopIcon,
    value: "12",
    label: "exchanges made",
    delta: "20%",
  },
];

export function StatsCard() {
  return (
    <Card className="mt-[13px] self-start p-3.5">
      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ icon: Icon, value, label, delta }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-100 px-2.5 py-3"
          >
            <Icon className="h-6 w-6 text-brand-500" />
            <p className="mt-1.5 text-[16px] font-bold leading-none text-gray-900">
              {value}
            </p>
            <p className="mt-1 text-[10.5px] leading-tight text-gray-500">
              {label}
            </p>
            <p className="mt-1.5 flex items-center gap-1 text-[10.5px] font-semibold text-brand-500">
              <ArrowUpIcon className="h-3 w-3" />
              {delta}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

const ACTIVITIES = [
  {
    art: FoodScrapArt,
    item: "Organic waste",
    outcome: "Compost",
    meta: "Today · 2.5 kg",
  },
  {
    art: CardboardArt,
    item: "Cardboard",
    outcome: "Reused",
    meta: "Yesterday · 5 items",
  },
  {
    art: GlassJarsArt,
    item: "Glass jars",
    outcome: "Exchanged",
    meta: "Sep 6 · 10 items",
  },
];

export function RecentActivityCard() {
  return (
    <Card>
      <CardHeader title="Recent Activity" icon={ClockIcon} />
      <ul className="mt-2 divide-y divide-gray-100">
        {ACTIVITIES.map(({ art: Art, item, outcome, meta }) => (
          <li key={item} className="flex items-center gap-3.5 py-4">
            <Art className="h-[62px] w-[62px] shrink-0 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-x-1.5 text-[14px] font-semibold text-gray-900">
                {item}
                <ArrowRightIcon className="h-3.5 w-3.5 text-gray-900" />
                {outcome}
              </p>
              <p className="mt-0.5 text-[12px] text-gray-500">{meta}</p>
            </div>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
              <CheckIcon className="h-4 w-4" />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const RECOMMENDATIONS = [
  {
    art: CardboardArt,
    item: "Cardboard",
    outcome: "Storage Box",
    meta: "DIY · Easy · 30 min",
  },
  {
    art: SaladBowlArt,
    item: "Food scraps",
    outcome: "Compost",
    meta: "DIY · Easy · 1-2 weeks",
  },
  {
    art: BottlesPlantersArt,
    item: "Plastic bottles",
    outcome: "Planters",
    meta: "DIY · Medium · 1 hour",
  },
];

export function RecommendedCard() {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display flex items-center gap-2.5 text-[16px] font-semibold text-gray-900">
          <SparkleIcon className="h-5 w-5 text-gray-900" />
          Recommended for you
        </h2>
      </div>
      <ul className="mt-2 divide-y divide-gray-100">
        {RECOMMENDATIONS.map(({ art: Art, item, outcome, meta }) => (
          <li key={outcome} className="flex items-center gap-4 py-4">
            <Art className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-x-1.5 text-[14px] font-semibold text-gray-900">
                {item}
                <ArrowRightIcon className="h-3.5 w-3.5 text-gray-900" />
                {outcome}
              </p>
              <p className="mt-0.5 text-[12px] text-gray-500">{meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const OPPORTUNITIES = [
  {
    art: GlassJarsArt,
    title: "Glass Jars (free)",
    meta: "1.2 km · Kicukiro",
    tag: "Free",
  },
  {
    art: StackedBoxesArt,
    title: "Cardboard Boxes",
    meta: "2.4 km · Remera",
    tag: "Exchange",
  },
  {
    art: FlowerPotsArt,
    title: "Flower Pots",
    meta: "3.1 km · Nyarugenge",
    tag: "Exchange",
  },
];

export function NearbyExchangeCard() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display flex items-center gap-2.5 text-[15px] font-semibold leading-snug text-gray-900">
          <MapPinIcon className="h-5 w-5 shrink-0 text-gray-900" />
          Nearby Exchange
          <br />
          Opportunities
        </h2>
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-3">
        {OPPORTUNITIES.map(({ art: Art, title, meta, tag }) => (
          <li key={title}>
            <div className="block">
              <Art className="h-[74px] w-full rounded-xl object-cover" />
              <p className="mt-2 text-[12px] font-semibold text-gray-900">
                {title}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">{meta}</p>
              <span className="mt-2 inline-block rounded-full bg-brand-50 px-2.5 py-1 text-[10.5px] font-semibold text-brand-700">
                {tag}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function RecentChatCard() {
  return (
    <Card>
      <CardHeader title="Recent Chat" icon={ChatIcon} />
      <div className="mt-4 flex items-center gap-3.5">
        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
          <BotIcon className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-gray-900">
            Waste Assistant
            <span className="text-[10.5px] font-normal text-gray-500">
              2h ago
            </span>
          </p>
          <p className="mt-0.5 truncate text-[12px] text-gray-500">
            Here are some options for your glass jars. Would you like to see...
          </p>
        </div>
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-gray-900" />
      </div>
    </Card>
  );
}
