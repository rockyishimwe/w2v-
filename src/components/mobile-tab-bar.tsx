import Link from "next/link";
import { CameraIcon, ExchangeIcon, GridIcon, ClockIcon, SearchIcon } from "./icons";

/**
 * Mobile primary navigation (replaces the md-hidden sidebar on phones).
 * HIG: bottom tab bars are the standard mobile primary nav pattern; five
 * tabs with ≥44pt touch targets, icons + short labels.
 */
const TABS = [
  { label: "Home", icon: GridIcon, href: "/dashboard" },
  { label: "Scanner", icon: CameraIcon, href: "/scanner" },
  { label: "Discover", icon: SearchIcon, href: "/scanner#examples" },
  { label: "Exchange", icon: ExchangeIcon, href: "/exchange" },
  { label: "Activity", icon: ClockIcon, href: "/dashboard" },
];

export function MobileTabBar({
  activeItem = "Home",
}: {
  activeItem?: string;
}) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ label, icon: Icon, href }) => {
          const active = label === activeItem;
          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-[60px] min-w-[44px] flex-col items-center justify-center gap-1 text-[10.5px] font-medium transition-colors ${
                  active ? "text-brand-700" : "text-gray-500"
                }`}
              >
                <Icon className="h-[22px] w-[22px]" />
                {label}
                <span
                  aria-hidden="true"
                  className={`h-0.5 w-6 rounded-full ${
                    active ? "bg-brand-700" : "bg-transparent"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
