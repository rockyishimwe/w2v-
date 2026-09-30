"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  fetchCurrentUser,
  hasSession,
  type CurrentUser,
} from "@/services/auth-service";

/**
 * Shared access to the signed-in user's session and profile.
 *
 * The sidebar, the dashboard greeting, the route guard and the Settings
 * page all need the same record, so it is fetched once per page load and
 * cached in module scope; subscribers are notified when it arrives or
 * changes (e.g. after Settings saves a new name), which keeps every chrome
 * element in sync without a second request.
 *
 * State is exposed through useSyncExternalStore with a dedicated server
 * snapshot: localStorage doesn't exist while rendering on the server, so
 * this is what keeps the server HTML and the first client render identical
 * (a plain useState(hasSession()) would be a hydration mismatch).
 */

export interface CurrentUserState {
  /** A token is present locally — the optimistic "signed in" signal. */
  hasToken: boolean;
  /** The verified profile from GET /api/auth/me, once it has loaded. */
  user: CurrentUser | null;
  /** True while that request is in flight. */
  loading: boolean;
}

/** Rendered on the server, where no session can be known. */
const SERVER_STATE: CurrentUserState = {
  hasToken: false,
  user: null,
  loading: true,
};

let state: CurrentUserState = { hasToken: false, user: null, loading: true };
let inFlight: Promise<CurrentUser> | null = null;
const listeners = new Set<() => void>();

function publish(next: Partial<CurrentUserState>): void {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab signing in or out writes to the same storage keys.
  const onStorage = () => publish({ hasToken: hasSession() });
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): CurrentUserState {
  return state;
}

function getServerSnapshot(): CurrentUserState {
  return SERVER_STATE;
}

/** Replaces the cached profile (called after a successful profile save). */
export function setCurrentUser(user: CurrentUser): void {
  publish({ user, loading: false, hasToken: true });
}

/** Drops the cache — used on logout so the next session starts clean. */
export function clearCurrentUser(): void {
  inFlight = null;
  publish({ user: null, loading: false, hasToken: false });
}

/** Fetches the profile at most once, unless the cache was cleared. */
function ensureLoaded(): void {
  const signedIn = hasSession();
  if (!signedIn) {
    publish({ hasToken: false, user: null, loading: false });
    return;
  }
  if (state.user || inFlight) {
    publish({ hasToken: true });
    return;
  }

  publish({ hasToken: true, loading: true });
  inFlight = fetchCurrentUser()
    .then((user) => {
      publish({ user, loading: false });
      return user;
    })
    .catch((error: unknown) => {
      // A rejected /me means the token is no longer usable; the AuthGuard
      // reacts to `user === null && !loading` and signs the visitor out.
      publish({ user: null, loading: false });
      throw error;
    })
    .finally(() => {
      inFlight = null;
    });
  void inFlight.catch(() => undefined);
}

/**
 * Returns the current session state, fetching the profile on first use.
 * A failure (no or expired session) settles as `user: null, loading: false`
 * — callers decide what to show, since the AuthGuard handles redirecting.
 */
export function useCurrentUser(): CurrentUserState {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    ensureLoaded();
  }, []);

  return snapshot;
}
