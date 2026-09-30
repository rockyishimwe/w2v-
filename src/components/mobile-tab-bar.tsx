"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  CameraIcon,
  ExchangeIcon,
  GridIcon,
  ClockIcon,
  GearIcon,
  SearchIcon,
} from "./icons";
import { useT } from "@/i18n/use-translation";

/**
 * Mobile primary navigation (replaces the md-hidden sidebar on phones).
 * HIG: bottom tab bars are the standard mobile primary nav pattern; six
 * tabs with ≥44pt touch targets, icons + short labels. Settings sits here
 * too because the sidebar that carries it is hidden on phones.
 */
const TABS: {
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
  href: Route;
}[] = [
  { label: "Home", icon: GridIcon, href: "/dashboard" },
  { label: "Scanner", icon: CameraIcon, href: "/scanner" },
  { label: "Discover", icon: SearchIcon, href: "/discover" },
  { label: "Exchange", icon: ExchangeIcon, href: "/exchange" },
  { label: "Activity", icon: ClockIcon, href: "/activity" },
  { label: "Settings", icon: GearIcon, href: "/settings" },
];

export function MobileTabBar({ activeItem = "Home" }: { activeItem?: string }) {
  const t = useT();

  return (
    <nav
      aria-label={t("Main")}
      className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-6">
        {TABS.map(({ label, icon: Icon, href }) => {
          const active = label === activeItem;
          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-[60px] flex-col items-center justify-center gap-1 px-0.5 text-[10px] font-medium transition-colors ${
                  active ? "text-brand-700" : "text-gray-500"
                }`}
              >
                <Icon className="h-[22px] w-[22px]" />
                {t(label)}
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
