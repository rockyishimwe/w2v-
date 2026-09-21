import Image from "next/image";
import Link from "next/link";
import {
  CameraIcon,
  ChevronDownIcon,
  ClockIcon,
  ExchangeIcon,
  GearIcon,
  GridIcon,
  LogoutIcon,
  SearchIcon,
} from "./icons";
import { AvatarArt } from "./dashboard-art";

const NAV_ITEMS = [
  { label: "Dashboard", icon: GridIcon, href: "/dashboard" },
  { label: "Scanner", icon: CameraIcon, href: "/scanner" },
  // Discover maps to the scanner's examples until its page exists;
  // Activities maps to the dashboard feed until its page exists.
  { label: "Discover", icon: SearchIcon, href: "/scanner" },
  { label: "Exchange", icon: ExchangeIcon, href: "/exchange" },
  { label: "Activities", icon: ClockIcon, href: "/dashboard" },
];

function NavItem({
  label,
  icon: Icon,
  active,
  href,
}: {
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
  active: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex h-[46px] items-center gap-3.5 rounded-full px-4 text-[14px] font-medium transition-colors ${
        active
          ? "bg-[#237f22] text-white shadow-[0_10px_18px_rgba(20,92,54,0.28)]"
          : "text-gray-900 hover:bg-brand-50"
      }`}
    >
      <Icon className="h-[22px] w-[22px]" />
      {label}
    </Link>
  );
}

export function DashboardSidebar({
  activeItem = "Dashboard",
}: {
  activeItem?: string;
}) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[234px] shrink-0 self-start flex-col rounded-r-[42px] bg-white shadow-[5px_0_22px_rgba(17,24,39,0.025)] md:flex">
      <div className="flex flex-col items-center px-6 pb-6 pt-9">
        <Image
          src="/images/logo-small.png"
          alt="Waste2Value logo"
          width={88}
          height={59}
          priority
          className="h-auto w-[88px]"
        />
        <p className="font-display mt-2 text-[16px] font-semibold text-gray-900">
          Waste<span className="text-brand-500">2</span>Value
        </p>
      </div>

      <nav aria-label="Main" className="mt-1 space-y-1.5 px-[18px]">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            active={item.label === activeItem}
          />
        ))}
      </nav>

      <div className="mx-8 my-5 h-px bg-gray-200" />

      <nav aria-label="Secondary" className="space-y-1.5 px-[18px]">
        {/* No settings/logout pages yet — render as inert buttons, not fake links. */}
        <button
          type="button"
          className="flex h-[46px] w-full items-center gap-3.5 rounded-full px-4 text-left text-[14px] font-medium text-gray-900 transition-colors hover:bg-brand-50"
        >
          <GearIcon className="h-[22px] w-[22px]" />
          Settings
        </button>
        <button
          type="button"
          className="flex h-[46px] w-full items-center gap-3.5 rounded-full px-4 text-left text-[14px] font-medium text-gray-900 transition-colors hover:bg-brand-50"
        >
          <LogoutIcon className="h-[22px] w-[22px]" />
          Logout
        </button>
      </nav>

      <div className="mt-auto px-[18px] pb-5">
        <div className="flex flex-col items-center rounded-3xl bg-pale-green px-4 py-5 text-center">
          <span className="relative">
            <AvatarArt className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-500 ring-offset-2 ring-offset-pale-green" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-500" />
          </span>
          <p className="mt-3 text-[13.5px] font-semibold text-gray-900">
            Vanessa Mwiza
          </p>
          <p className="mt-0.5 text-[11.5px] text-gray-500">
            vanessa@gmail.com
          </p>
          <button
            type="button"
            aria-label="Account menu"
            className="mt-2 text-gray-700 transition-colors hover:text-gray-900"
          >
            <ChevronDownIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
