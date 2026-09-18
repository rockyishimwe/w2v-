import { BrandPanel } from "@/components/brand-panel";
import { AuthForms } from "@/components/auth-forms";

export const metadata = {
  title: "Waste2Value — Log in or create your account",
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode = mode === "signup" || mode === "forgot" ? mode : "login";

  return (
    <div className="flex h-dvh min-h-[560px] overflow-hidden bg-page">
      <BrandPanel />
      <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-page px-6 py-6 sm:px-10">
        <AuthForms initialMode={initialMode} />
      </main>
    </div>
  );
}
