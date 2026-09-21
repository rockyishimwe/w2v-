import {
  BookIcon,
  BookmarkIcon,
  BotIcon,
  ChevronRightIcon,
  ExchangeIcon,
  EyeIcon,
  ZapIcon,
} from "./icons";

const QUICK_ACTIONS = [
  { icon: EyeIcon, label: "View Recommendation" },
  { icon: BookIcon, label: "View DIY Instructions" },
  { icon: ExchangeIcon, label: "Find Exchange Opportunities" },
  { icon: BookmarkIcon, label: "Save" },
];

export function ScannerQuickActionsCard() {
  return (
    <section className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)] sm:p-7">
      <div className="flex items-start gap-3.5">
        <ZapIcon className="mt-1.5 h-7 w-7 shrink-0 text-gray-900" />
        <div>
          <h2 className="text-[26px] font-bold leading-tight text-gray-900">
            Quick Actions
          </h2>
          <p className="mt-1.5 text-[14.5px] text-gray-500">
            What would you like to do next?
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-4">
        {QUICK_ACTIONS.map(({ icon: Icon, label }) => (
          <li key={label}>
            <a
              href="#"
              className="group flex items-center gap-3.5 rounded-2xl border border-brand-300/70 bg-white px-5 py-4 transition-colors hover:border-brand-500 hover:bg-brand-50/50"
            >
              <Icon className="h-5 w-5 shrink-0 text-brand-800" />
              <span className="min-w-0 flex-1 text-[16px] font-bold text-brand-800">
                {label}
              </span>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-brand-800/70 transition-transform group-hover:translate-x-0.5" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ScannerChatButton() {
  return (
    <button
      type="button"
      className="fixed bottom-5 right-8 z-10 flex h-[52px] items-center gap-3 rounded-full bg-brand-700 px-6 text-[16px] font-semibold text-white shadow-[0_8px_16px_rgba(20,92,54,0.2)] transition-colors hover:bg-brand-800"
    >
      <BotIcon className="h-6 w-6" />
      Chat
    </button>
  );
}
