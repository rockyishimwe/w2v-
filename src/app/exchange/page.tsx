import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { ExchangeClient } from "@/components/exchange-client";

export const metadata = { title: "Waste2Value - Exchange" };

export default function ExchangePage() {
  return (
    <div className="flex min-h-dvh bg-page pb-20 md:pb-0">
      <DashboardSidebar activeItem="Exchange" />

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-6 lg:py-9">
        <ExchangeClient />
      </main>

      <MobileTabBar activeItem="Exchange" />
    </div>
  );
}
