import { AuthGuard } from "@/components/auth-guard";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
  NearbyExchangeCard,
  RecentActivityCard,
  RecentChatCard,
  RecommendedCard,
  ScanWasteCard,
  StatsCard,
} from "@/components/dashboard-cards";
import {
  HelpCard,
  ImpactCard,
  QuickActionsCard,
  QuoteCard,
  TopBar,
} from "@/components/dashboard-rail";
import { MobileTabBar } from "@/components/mobile-tab-bar";

export const metadata = {
  title: "Waste2Value — Dashboard",
};

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh bg-page pb-20 md:pb-0">
        <DashboardSidebar />

        <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-5 lg:py-12">
          <TopBar />

          {/* Three columns on wide screens, as in the design; they
              collapse to two and then one on smaller viewports. */}
          <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,1.08fr)_minmax(320px,1fr)]">
            <div className="flex min-w-0 flex-col gap-5">
              <ScanWasteCard />
              <RecentActivityCard />
              <NearbyExchangeCard />
            </div>

            <div className="flex min-w-0 flex-col gap-5">
              <StatsCard />
              <RecommendedCard />
              <RecentChatCard />
            </div>

            <div className="flex min-w-0 flex-col gap-5 lg:col-span-2 xl:col-span-1">
              <ImpactCard />
              <QuickActionsCard />
              <HelpCard />
              <QuoteCard />
            </div>
          </div>
        </main>

        <MobileTabBar activeItem="Home" />
      </div>
    </AuthGuard>
  );
}
