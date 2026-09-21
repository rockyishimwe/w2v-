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
    <div className="flex min-h-dvh bg-page">
      <BrandPanel />
      <main className="flex min-h-dvh w-full flex-1 items-center justify-center bg-page px-6 py-8 sm:px-10">
        <AuthForms initialMode={initialMode} />
      </main>
    </div>
  );
}
