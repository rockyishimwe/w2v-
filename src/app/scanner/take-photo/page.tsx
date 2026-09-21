import { CameraCapture, CameraChatButton, CameraHeader, ScanGuide } from "@/components/camera-components";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileTabBar } from "@/components/mobile-tab-bar";

export const metadata = { title: "Waste2Value - Take Photo" };

export default function TakePhotoPage() {
  return <div className="flex min-h-dvh bg-page pb-20 md:pb-0"><DashboardSidebar activeItem="Scanner" /><main className="min-w-0 flex-1 px-5 py-8 lg:px-7 lg:py-8"><CameraHeader /><div className="mt-7 grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,.73fr)]"><CameraCapture /><ScanGuide /></div></main><CameraChatButton /><MobileTabBar activeItem="Scanner" /></div>;
}
