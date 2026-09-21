import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
  ChatButton,
  ExamplesCard,
  HowItWorks,
  QuickTip,
  ScannerBenefits,
  ScannerHeader,
  UploadPanel,
} from "@/components/scanner-components";
import { MobileTabBar } from "@/components/mobile-tab-bar";

export const metadata = { title: "Waste2Value - Scanner" };

export default function ScannerPage() {
  return (
    <div className="flex min-h-dvh bg-page pb-20 md:pb-0">
      <DashboardSidebar activeItem="Scanner" />

      <main className="min-w-0 flex-1 px-5 py-8 lg:px-7 lg:py-11">
        <ScannerHeader />

        <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.42fr)_minmax(410px,1fr)]">
          <div className="space-y-7">
            <UploadPanel />
            <ScannerBenefits />
            <QuickTip />
          </div>

          <div className="space-y-5">
            <HowItWorks />
            <ExamplesCard />
          </div>
        </div>
      </main>

      <ChatButton />
      <MobileTabBar activeItem="Scanner" />
    </div>
  );
}
