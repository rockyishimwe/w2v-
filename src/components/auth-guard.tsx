"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { hasSession, logout } from "@/services/auth-service";
import { clearCurrentUser, useCurrentUser } from "@/hooks/use-current-user";

/**
 * Client-side route guard for every signed-in page.
 *
 * Two levels of checking, so neither a missing nor a stale token lets a
 * visitor browse the app:
 *  1. the presence of a token in local storage — without one, nothing of
 *     the page is painted and the visitor is sent to the login screen;
 *  2. a server check through GET /api/auth/me (shared with the rest of the
 *     chrome via useCurrentUser, so it costs one request per page load) —
 *     if the token is expired, revoked or the account is gone, the local
 *     session is cleared and the visitor is sent back to log in.
 *
 * The token check comes from useCurrentUser's external store rather than
 * from localStorage during render, which keeps server and client markup
 * identical on the first paint (no hydration mismatch).
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { hasToken, user, loading } = useCurrentUser();

  // No token at all → straight to the login screen.
  useEffect(() => {
    if (!hasToken && !hasSession()) {
      router.replace("/?redirected=1");
    }
  }, [hasToken, router]);

  // The server rejected the token (expired / revoked / deleted account).
  useEffect(() => {
    if (!hasToken || loading || user) return;
    let cancelled = false;
    void logout().finally(() => {
      if (cancelled) return;
      clearCurrentUser();
      router.replace("/?expired=1");
    });
    return () => {
      cancelled = true;
    };
  }, [hasToken, loading, user, router]);

  if (!hasToken) {
    // Blank while the session is resolved or the redirect lands, so no
    // protected content is ever painted to a signed-out visitor.
    return <div aria-hidden="true" className="min-h-dvh bg-page opacity-40" />;
  }

  return <>{children}</>;
}
