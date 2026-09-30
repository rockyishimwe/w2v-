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

          <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
            {/* Left: primary cards */}
            <div className="flex min-w-0 flex-col gap-6">
              <ScanWasteCard />
              <StatsCard />
              <RecentActivityCard />
              <RecommendedCard />
            </div>

            {/* Right rail */}
            <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-12 xl:self-start">
              <ImpactCard />
              <QuickActionsCard />
              <NearbyExchangeCard />
              <RecentChatCard />
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
