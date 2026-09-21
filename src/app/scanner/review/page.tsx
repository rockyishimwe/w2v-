import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ArrowLeftIcon } from "@/components/icons";
import { CaptureResult } from "@/components/capture-result";
import { CameraChatButton } from "@/components/camera-components";
import { MobileTabBar } from "@/components/mobile-tab-bar";

export const metadata = { title: "Waste2Value - Review Photo" };

export default function ReviewPage() {
  return (
    <div className="flex min-h-dvh bg-page">
      <DashboardSidebar activeItem="Scanner" />

      <main className="min-w-0 flex-1 px-4 py-7 sm:px-5 lg:px-7 lg:py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/scanner/take-photo"
            aria-label="Back to camera"
            className="text-gray-900 transition-colors hover:text-brand-700"
          >
            <ArrowLeftIcon className="h-7 w-7" />
          </Link>
          <div>
            <h1 className="font-display text-[26px] font-bold leading-none text-gray-900">
              Scanner
            </h1>
            <p className="mt-1.5 text-[13.5px] text-gray-500">
              Confirm the capture before analysis
            </p>
          </div>
        </div>

        <CaptureResult />
      </main>

      <CameraChatButton />
      <MobileTabBar activeItem="Scanner" />
    </div>
  );
}
