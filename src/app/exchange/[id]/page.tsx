import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { ExchangeDetailClient } from "@/components/exchange-detail";

type Params = Promise<{ id: string }>;

/**
 * Listing detail — rendered client-side from the real API
 * (GET /api/exchange/listings/[id]); listings are dynamic DB rows, so
 * there are no static params to pre-render.
 */
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Waste2Value - Item ${id}` };
}

export default async function ExchangeItemPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <AuthGuard>
      <div className="flex min-h-dvh bg-page pb-20 md:pb-0">
        <DashboardSidebar activeItem="Exchange" />

        <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-6 lg:py-9">
          <ExchangeDetailClient listingId={id} />
        </main>

        <MobileTabBar activeItem="Exchange" />
      </div>
    </AuthGuard>
  );
}
