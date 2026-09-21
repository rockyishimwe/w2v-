import Link from "next/link";
import {
  BellIcon,
  BotIcon,
  BrainIcon,
  CameraIcon,
  ChevronDownIcon,
  ExchangeIcon,
  LeafIcon,
  LightbulbIcon,
  RecycleIcon,
  SearchIcon,
  SparkleIcon,
  UploadIcon,
} from "./icons";
import {
  AvatarArt,
  BottlesPlantersArt,
  CardboardArt,
  FoodScrapArt,
  GlassJarsArt,
} from "./dashboard-art";

function ScannerPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.045)] ${className}`}
    >
      {children}
    </section>
  );
}

export function ScannerHeader() {
  return (
    <header className="flex flex-wrap items-start justify-between gap-5">
      <div>
        <h1 className="text-[40px] font-bold leading-none text-black">
          Scanner
        </h1>
        <p className="mt-3 text-[16px] text-[#607493]">
          Identify waste and discover what to do with it
        </p>
      </div>
      <div className="flex flex-1 items-center justify-end gap-5 pt-1">
        <label className="relative hidden w-full max-w-[584px] sm:block">
          <span className="sr-only">Search</span>
          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600" />
          <input
            type="search"
            placeholder="Search anything..."
            className="h-[48px] w-full rounded-full border border-white bg-white pl-12 pr-5 text-[14px] text-gray-900 shadow-[0_6px_16px_rgba(17,24,39,0.04)] outline-none placeholder:text-[#607493]"
          />
        </label>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-white text-gray-900 shadow-[0_6px_16px_rgba(17,24,39,0.04)]"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500" />
        </button>
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2"
        >
          <AvatarArt className="h-10 w-10 rounded-full" />
          <ChevronDownIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

export function UploadPanel() {
  return (
    <ScannerPanel className="p-5">
      <div className="relative flex min-h-[488px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-[#75d99a] bg-[#f5fbf7] px-6 text-center">
        <LeafIcon className="absolute -right-2 top-5 h-16 w-16 rotate-[25deg] text-brand-700 opacity-10" />
        <LeafIcon className="absolute -bottom-2 -left-1 h-16 w-16 rotate-[210deg] text-brand-700 opacity-10" />
        <span className="flex h-[114px] w-[114px] items-center justify-center rounded-full bg-[#dcf3e3]">
          <span className="flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-brand-700 text-white">
            <CameraIcon className="h-9 w-9" />
          </span>
        </span>
        <h2 className="mt-8 max-w-[500px] text-[27px] font-semibold leading-[1.35] text-[#153a2a]">
          Scan something you&apos;re about
          <br className="hidden xl:block" /> to throw away.
        </h2>
        <p className="mt-7 max-w-[480px] text-[17px] leading-[1.75] text-[#5d786d]">
          Take a photo or upload an image, and our AI will identify the item and
          suggest the best next steps.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-10">
          <Link
            href="/scanner/take-photo"
            className="flex h-[61px] min-w-[213px] items-center justify-center gap-3 rounded-2xl bg-brand-700 px-7 text-[16px] font-medium text-white shadow-[0_8px_16px_rgba(20,92,54,0.14)]"
          >
            <CameraIcon className="h-6 w-6" />
            Take Photo
          </Link>
          <label className="flex h-[61px] min-w-[213px] cursor-pointer items-center justify-center gap-3 rounded-2xl border border-brand-500 bg-white px-7 text-[16px] font-medium text-brand-500">
            <UploadIcon className="h-5 w-5" />
            Upload Image
            <input className="sr-only" type="file" accept="image/*" />
          </label>
        </div>
      </div>
    </ScannerPanel>
  );
}

const BENEFITS = [
  { label: "Reuse", icon: RecycleIcon },
  { label: "DIY", icon: SparkleIcon },
  { label: "Exchange", icon: ExchangeIcon },
  { label: "Recycle", icon: RecycleIcon },
  { label: "Dispose safely", icon: UploadIcon },
];

export function ScannerBenefits() {
  return (
    <section className="rounded-[25px] bg-[#f2faf5] px-5 py-5">
      <div className="flex items-center gap-3 text-[15px] font-semibold text-[#153a2a]">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9f2e2] text-brand-700">
          <LightbulbIcon className="h-5 w-5" />
        </span>
        What you can get:
      </div>
      <div className="mt-2 grid grid-cols-5">
        {BENEFITS.map(({ label, icon: Icon }, index) => (
          <div
            key={label}
            className={`flex min-w-0 flex-col items-center px-2 pt-2 text-center ${index ? "border-l border-[#e1eee5]" : ""}`}
          >
            <Icon className="h-6 w-6 text-brand-500" />
            <span className="mt-2 text-[16px] font-semibold leading-tight text-[#153a2a]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function QuickTip() {
  return (
    <section className="flex items-center gap-5 rounded-[28px] bg-[#f2faf5] px-7 py-6">
      <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-[#d9f2e2] text-brand-700">
        <LightbulbIcon className="h-7 w-7" />
      </span>
      <div>
        <h2 className="text-[22px] font-semibold text-[#153a2a]">Quick Tip</h2>
        <p className="mt-1 text-[18px] leading-snug text-[#5d786d]">
          Make sure the image is clear and well-lit for better results.
        </p>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "Scan or Upload",
    description:
      "Take a photo or upload an image of the item you want to identify.",
    icon: CameraIcon,
  },
  {
    title: "AI Analysis",
    description: "Our AI identifies the material, category and possible uses.",
    icon: BrainIcon,
  },
  {
    title: "Get Recommendations",
    description:
      "See the best options for reuse, DIY, exchange, recycling or safe disposal.",
    icon: LightbulbIcon,
  },
];

export function HowItWorks() {
  return (
    <ScannerPanel className="p-8">
      <h2 className="flex items-center gap-4 text-[27px] font-semibold text-[#153a2a]">
        <SparkleIcon className="h-6 w-6 text-brand-700" />
        How it works
      </h2>
      <ol className="mt-10 space-y-9">
        {STEPS.map(({ title, description, icon: Icon }, index) => (
          <li
            key={title}
            className="relative grid grid-cols-[42px_70px_1fr] items-start gap-5"
          >
            <span className="relative z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-brand-700 text-[18px] font-semibold text-white">
              {index + 1}
            </span>
            {index < STEPS.length - 1 && (
              <span className="absolute left-[20px] top-[42px] h-[54px] border-l-2 border-dashed border-[#bce6cb]" />
            )}
            <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#eaf6ee] text-brand-700">
              <Icon className="h-8 w-8" />
            </span>
            <div className="pt-1">
              <h3 className="text-[21px] font-semibold text-[#153a2a]">
                {title}
              </h3>
              <p className="mt-2 max-w-[285px] text-[18px] leading-[1.5] text-[#667d73]">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </ScannerPanel>
  );
}

const EXAMPLES = [
  { label: "Glass jars", art: GlassJarsArt },
  { label: "Cardboard boxes", art: CardboardArt },
  { label: "Plastic bottles", art: BottlesPlantersArt },
  { label: "Food scraps", art: FoodScrapArt },
];

export function ExamplesCard() {
  return (
    <ScannerPanel className="p-5">
      <h2 className="flex items-center gap-3 text-[19px] font-semibold text-[#153a2a]">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dcf3e3] text-brand-700">
          <LeafIcon className="h-6 w-6" />
        </span>
        Examples
      </h2>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {EXAMPLES.map(({ label, art: Art }) => (
          <div key={label} className="min-w-0 text-center">
            <Art className="aspect-square w-full rounded-2xl object-cover" />
            <p className="mt-2 text-[11px] font-semibold leading-tight text-[#254438]">
              {label}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-7 text-[13px] text-[#607493]">
        Almost anything can have a second life!
      </p>
    </ScannerPanel>
  );
}

export function ChatButton() {
  return (
    <button
      type="button"
      className="fixed bottom-4 right-9 z-10 flex h-[50px] items-center gap-3 rounded-full bg-brand-700 px-6 text-[16px] font-semibold text-white shadow-[0_8px_16px_rgba(20,92,54,0.2)]"
    >
      <BotIcon className="h-6 w-6" />
      Chat
    </button>
  );
}
