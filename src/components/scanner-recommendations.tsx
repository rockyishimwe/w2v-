import Link from "next/link";
import {
  ChevronRightIcon,
  LoopIcon,
  PeopleIcon,
  RecycleIcon,
  SparkleIcon,
  ToolIcon,
  TrashIcon,
} from "./icons";

const RECOMMENDATIONS = [
  {
    icon: LoopIcon,
    title: "Reuse",
    sub: "Use it for storage or decoration",
    href: "/scanner/diy",
  },
  {
    icon: ToolIcon,
    title: "DIY",
    sub: "Turn it into a planter or lamp",
    href: "/scanner/diy",
  },
  {
    icon: PeopleIcon,
    title: "Exchange",
    sub: "Give or find someone who needs it",
    href: "/dashboard",
  },
  {
    icon: RecycleIcon,
    title: "Recycle",
    sub: "If not reusable, recycle at a collection point",
    href: "/scanner",
  },
  {
    icon: TrashIcon,
    title: "Dispose safely",
    sub: "Use proper waste bin if needed",
    href: "/scanner",
  },
];

export function AiRecommendationsCard() {
  return (
    <section className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:p-7">
      <div className="flex items-start gap-3.5">
        <SparkleIcon className="mt-1.5 h-7 w-7 shrink-0 text-gray-900" />
        <div>
          <h2 className="font-display text-[22px] font-bold leading-tight text-gray-900">
            AI Recommendations
          </h2>
          <p className="mt-1.5 text-[13px] text-gray-500">
            Best options for your glass jar:
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-4">
        {RECOMMENDATIONS.map(({ icon: Icon, title, sub, href }) => (
          <li key={title}>
            <Link
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
            >
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-pale-green text-brand-700">
                <Icon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-bold text-gray-900">
                  {title}
                </span>
                <span className="mt-0.5 block truncate text-[12.5px] text-gray-500">
                  {sub}
                </span>
              </span>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-900 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
