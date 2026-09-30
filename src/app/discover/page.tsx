import { AuthGuard } from "@/components/auth-guard";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { DiscoverClient } from "@/components/discover-client";

export const metadata = { title: "Waste2Value - Discover" };

export default function DiscoverPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh bg-page pb-20 md:pb-0">
        <DashboardSidebar activeItem="Discover" />

        <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-6 lg:py-9">
          <DiscoverClient />
        </main>

        <MobileTabBar activeItem="Discover" />
      </div>
    </AuthGuard>
  );
}
