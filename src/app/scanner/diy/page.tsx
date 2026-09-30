import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { DiyGuideClient, DiyTopBar } from "@/components/diy-guide";
import {
  DiyImpactNote,
  DiyShareCard,
  DiySimilarIdeasCard,
} from "@/components/diy-rail";

export const metadata = { title: "Waste2Value - DIY Idea" };

/**
 * DIY guide detail. The idea is chosen with ?idea=<slug> (linked from
 * Discover and assistant idea cards); the guide itself is AI-generated
 * server-side and rendered here.
 */
export default async function DiyGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ idea?: string }>;
}) {
  const { idea } = await searchParams;

  return (
    <div className="flex min-h-dvh bg-page pb-20 md:pb-0">
      <DashboardSidebar activeItem="Scanner" />

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-6 lg:py-9">
        <DiyTopBar />

        <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.53fr)_minmax(400px,1fr)]">
          {/* Left: guide content (hero, materials, steps) */}
          <div className="flex min-w-0 flex-col gap-6">
            <DiyGuideClient ideaId={idea} />
          </div>

          {/* Right rail: impact note, similar ideas, share. Pinned as one
              solid block while the guide column scrolls — no internal
              scrolling, so cards can never clip or overlap each other. */}
          <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-9 xl:self-start">
            <DiyImpactNote />
            <DiySimilarIdeasCard excludeId={idea} />
            <DiyShareCard />
          </div>
        </div>
      </main>

      <MobileTabBar activeItem="Scanner" />
    </div>
  );
}
