import { AuthGuard } from "@/components/auth-guard";
import { ActivityClient } from "@/components/activity-client";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";

export const metadata = { title: "Waste2Value - My Activity" };

export default function ActivityPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh bg-page pb-20 md:pb-0">
        {/* The design highlights "Exchange" on the My Activity page. */}
        <DashboardSidebar activeItem="Exchange" />

        <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-6 lg:py-9">
          <ActivityClient />
        </main>

        <MobileTabBar activeItem="Activity" />
      </div>
    </AuthGuard>
  );
}
