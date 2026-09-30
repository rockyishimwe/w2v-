"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { hasSession } from "@/services/auth-service";

/**
 * Client-side route guard. While a session is checked, children render
 * normally (the page itself handles loading/empty states); when there is
 * definitively no session, the user is redirected to the login page.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  // Checked synchronously on first render; hasSession guards SSR itself.
  const [checked] = useState(() => hasSession());

  useEffect(() => {
    if (!checked) {
      router.replace("/?redirected=1");
    }
  }, [checked, router]);

  if (!checked) {
    // Render children muted while the guard is deciding, avoiding layout
    // flicker; the redirect replaces the view within one tick when needed.
    return <div aria-hidden="true" className="min-h-dvh bg-page opacity-40" />;
  }

  return <>{children}</>;
}
