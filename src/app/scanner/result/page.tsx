import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ScannerTopBar } from "@/components/scanner-topbar";
import { ScannerResultCard } from "@/components/scanner-result-card";
import { AiRecommendationsCard } from "@/components/scanner-recommendations";
import {
  ScannerChatButton,
  ScannerQuickActionsCard,
} from "@/components/scanner-actions";
import { MobileTabBar } from "@/components/mobile-tab-bar";

export const metadata = { title: "Waste2Value - Scan Result" };

export default function ScannerResultPage() {
  return (
    <div className="flex min-h-dvh bg-page pb-20 md:pb-0">
      <DashboardSidebar activeItem="Scanner" />

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-6 lg:py-9">
        <ScannerTopBar />

        <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.53fr)_minmax(400px,1fr)] xl:gap-6">
          {/* Left: result card */}
          <div className="min-w-0">
            <ScannerResultCard />
          </div>

          {/* Right rail: AI recommendations + quick actions */}
          <div className="flex min-w-0 flex-col gap-6">
            <AiRecommendationsCard />
            <ScannerQuickActionsCard />
          </div>
        </div>
      </main>

      <ScannerChatButton />
      <MobileTabBar activeItem="Scanner" />
    </div>
  );
}
