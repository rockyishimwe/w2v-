import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { ExchangeDetailClient } from "@/components/exchange-detail";
import { ALL_ITEMS, getExchangeItemDetail } from "@/constants/exchange";

type Params = Promise<{ id: string }>;

/**
 * The mock dataset is fully known at build time, so every item detail
 * renders statically; typedRoutes can then validate /exchange/<id> links.
 */
export function generateStaticParams() {
  return ALL_ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = getExchangeItemDetail(id);
  return {
    title: detail
      ? `Waste2Value - ${detail.title}`
      : "Waste2Value - Item not found",
  };
}

export default async function ExchangeItemPage({ params }: { params: Params }) {
  const { id } = await params;
  const detail = getExchangeItemDetail(id);

  if (!detail) notFound();

  return (
    <div className="flex min-h-dvh bg-page pb-20 md:pb-0">
      <DashboardSidebar activeItem="Exchange" />

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-6 lg:py-9">
        {/* Keyed by item so gallery/favorite state resets between items. */}
        <ExchangeDetailClient key={detail.id} detail={detail} />
      </main>

      <MobileTabBar activeItem="Exchange" />
    </div>
  );
}
