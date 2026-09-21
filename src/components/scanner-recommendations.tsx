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
  },
  {
    icon: ToolIcon,
    title: "DIY",
    sub: "Turn it into a planter or lamp",
  },
  {
    icon: PeopleIcon,
    title: "Exchange",
    sub: "Give or find someone who needs it",
  },
  {
    icon: RecycleIcon,
    title: "Recycle",
    sub: "If not reusable, recycle at a collection point",
  },
  {
    icon: TrashIcon,
    title: "Dispose safely",
    sub: "Use proper waste bin if needed",
  },
];

export function AiRecommendationsCard() {
  return (
    <section className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:p-7">
      <div className="flex items-start gap-3.5">
        <SparkleIcon className="mt-1.5 h-7 w-7 shrink-0 text-gray-900" />
        <div>
          <h2 className="text-[26px] font-bold leading-tight text-gray-900">
            AI Recommendations
          </h2>
          <p className="mt-1.5 text-[14.5px] text-gray-500">
            Best options for your glass jar:
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-4">
        {RECOMMENDATIONS.map(({ icon: Icon, title, sub }) => (
          <li key={title}>
            <a
              href="#"
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
            >
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-pale-green text-brand-700">
                <Icon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-bold text-gray-900">
                  {title}
                </span>
                <span className="mt-0.5 block truncate text-[13.5px] text-gray-500">
                  {sub}
                </span>
              </span>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-900 transition-transform group-hover:translate-x-0.5" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
