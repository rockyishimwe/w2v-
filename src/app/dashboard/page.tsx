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

export const metadata = {
  title: "Waste2Value — Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-dvh bg-page">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-5 lg:py-12">
        <TopBar />

        <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.08fr)_minmax(340px,.94fr)] xl:gap-[18px]">
          {/* Left column: scan banner, recent activity, nearby exchange */}
          <div className="flex min-w-0 flex-col gap-6">
            <ScanWasteCard />
            <RecentActivityCard />
            <NearbyExchangeCard />
          </div>

          {/* Middle column: stats, recommendations, chat */}
          <div className="flex min-w-0 flex-col gap-6">
            <StatsCard />
            <RecommendedCard />
            <RecentChatCard />
          </div>

          {/* Right rail: impact, quick actions, help, quote */}
          <div className="flex min-w-0 flex-col gap-6">
            <ImpactCard />
            <QuickActionsCard />
            <HelpCard />
            <QuoteCard />
          </div>
        </div>
      </main>
    </div>
  );
}
