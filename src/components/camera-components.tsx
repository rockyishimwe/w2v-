import Link from "next/link";
import {
  ArrowLeftIcon,
  BellIcon,
  BotIcon,
  CameraIcon,
  ChevronDownIcon,
  LightbulbIcon,
  RecycleIcon,
  SearchIcon,
  SparkleIcon,
  UploadIcon,
} from "./icons";
import { AvatarArt } from "./dashboard-art";
import { CameraViewfinder } from "./camera-viewfinder";
import { UploadImageButton } from "./upload-image-button";

export function CameraHeader() {
  return (
    <header className="flex flex-wrap items-start justify-between gap-5">
      <div>
        <h1 className="font-display flex items-center gap-3 text-[30px] font-bold leading-none text-black">
          <Link
            href="/scanner"
            aria-label="Back to scanner"
            className="text-gray-900"
          >
            <ArrowLeftIcon className="h-7 w-7" />
          </Link>
          Scanner
        </h1>
        <p className="mt-3 text-[14.5px] text-[#607493]">
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

export function CameraCapture() {
  return <CameraViewfinder />;
}

const SCAN_ITEMS = [
  "Plastic bottles & containers",
  "Glass jars & bottles",
  "Cardboard boxes",
  "Food scraps",
  "Old clothes",
  "Electronics",
  "Metal items",
];
function ScanItemIcon({ index }: { index: number }) {
  const Icon =
    index === 2
      ? RecycleIcon
      : index === 3
        ? SparkleIcon
        : index === 5
          ? CameraIcon
          : index === 6
            ? BotIcon
            : UploadIcon;
  return <Icon className="h-5 w-5 text-[#277651]" />;
}

function GuideNote({
  icon: Icon,
  title,
  text,
}: {
  icon: (props: { className?: string }) => React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-[#eaf7ee] px-4 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d9f2e2] text-brand-700">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-[12px] leading-snug text-[#4d6480]">
        <strong className="mb-1 block text-[13.5px] text-[#1f6541]">
          {title}
        </strong>
        {text}
      </p>
    </div>
  );
}

export function ScanGuide() {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
      <h2 className="font-display flex items-center gap-3 text-[20px] font-semibold text-[#153a2a]">
        <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#e9f6ee] text-brand-700">
          <LightbulbIcon className="h-8 w-8" />
        </span>
        What to scan?
      </h2>
      <p className="ml-[76px] -mt-3 text-[12px] font-semibold text-[#637796]">
        Look for items like:
      </p>
      <ul className="mt-5 space-y-4">
        {SCAN_ITEMS.map((item, index) => (
          <li
            key={item}
            className="flex items-center gap-7 text-[15px] text-[#3b4b67]"
          >
            <ScanItemIcon index={index} />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-7 space-y-3">
        <GuideNote
          icon={SparkleIcon}
          title="Good lighting"
          text="Natural light works best for clear and accurate results."
        />
        <GuideNote
          icon={RecycleIcon}
          title="Keep it steady"
          text="Hold your phone steady and keep the item in focus."
        />
      </div>
      <UploadImageButton className="mt-4 flex h-[52px] items-center justify-center gap-4 rounded-2xl border border-[#c8ebd1] bg-[#eaf7ee] px-5 text-[14.5px] font-semibold text-[#207246]" />
    </section>
  );
}

export function CameraChatButton() {
  return (
    <button
      type="button"
      className="fixed bottom-24 right-4 z-10 flex h-[48px] items-center gap-3 rounded-full bg-brand-700 px-5 text-[14.5px] font-semibold text-white shadow-[0_8px_16px_rgba(20,92,54,0.2)] md:bottom-6 md:right-9"
    >
      <BotIcon className="h-6 w-6" />
      Chat
    </button>
  );
}
