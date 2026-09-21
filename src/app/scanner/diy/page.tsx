import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import {
  DiyHeroCard,
  DiyMaterialsCard,
  DiyStepsCard,
  DiyTopBar,
} from "@/components/diy-guide";
import {
  DiyImpactNote,
  DiyShareCard,
  DiySimilarIdeasCard,
} from "@/components/diy-rail";

export const metadata = { title: "Waste2Value - DIY Idea" };

export default function DiyGuidePage() {
  return (
    <div className="flex min-h-dvh bg-page pb-20 md:pb-0">
      <DashboardSidebar activeItem="Scanner" />

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-6 lg:py-9">
        <DiyTopBar />

        <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.53fr)_minmax(400px,1fr)]">
          {/* Left: recommendation, materials, steps */}
          <div className="flex min-w-0 flex-col gap-6">
            <DiyHeroCard />
            <DiyMaterialsCard />
            <DiyStepsCard />
          </div>

          {/* Right rail: impact note, similar ideas, share. Pinned while the
              guide column scrolls; scrolls internally when taller than the
              viewport (HIG: keep secondary navigation/content reachable). */}
          <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-9 xl:max-h-[calc(100dvh-4.5rem)] xl:self-start xl:overflow-y-auto xl:pb-2 [scrollbar-width:thin]">
            <DiyImpactNote />
            <DiySimilarIdeasCard />
            <DiyShareCard />
          </div>
        </div>
      </main>

      <MobileTabBar activeItem="Scanner" />
    </div>
  );
}
