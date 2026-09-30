/**
 * Auth service layer — the only module the UI talks to for authentication.
 * Wraps the API client (token attach/refresh handled there) and persists
 * sessions via api-client's storage helpers.
 */
import {
  ApiClientError,
  api,
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
  type AuthSession,
} from "@/lib/api-client";
export { ApiClientError };

export type { AuthSession };

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** Registers a new account and stores the session. */
export async function register(input: RegisterInput): Promise<AuthSession> {
  const session = await api.post<AuthSession>("/api/auth/register", input);
  saveSession(session);
  return session;
}

/** Logs in and stores the session. */
export async function login(input: LoginInput): Promise<AuthSession> {
  const session = await api.post<AuthSession>("/api/auth/login", input);
  saveSession(session);
  return session;
}

/**
 * Logs out server-side (revoking the refresh token) and clears the stored
 * session. Idempotent, and the local session always goes even when the
 * network call fails — an offline user must still be able to sign out.
 */
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await api.post("/api/auth/logout", { refreshToken });
    }
  } catch {
    // Even if the server call fails, the local session must go.
  }
  clearSession();
}

/** Revokes the session on every device, then clears this one. */
export async function logoutEverywhere(): Promise<void> {
  try {
    await api.post("/api/auth/logout-all");
  } catch {
    // Same reasoning as logout(): the local session must still go.
  }
  clearSession();
}

/** True when an access token exists (does not verify expiry server-side). */
export function hasSession(): boolean {
  return Boolean(getAccessToken()); // getAccessToken guards SSR itself
}

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
  /** False for Google accounts, which have no password. */
  hasPassword: boolean;
}

/** GET /api/auth/me — the signed-in user (throws when unauthenticated). */
export async function fetchCurrentUser(): Promise<CurrentUser> {
  const { user } = await api.get<{ user: CurrentUser }>("/api/auth/me");
  return user;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  locale?: string;
}

/** POST /api/auth/me — saves profile edits from the Settings page. */
export async function updateProfile(
  input: UpdateProfileInput,
): Promise<CurrentUser> {
  const { user } = await api.post<{ user: CurrentUser }>("/api/auth/me", input);
  return user;
}

/**
 * POST /api/auth/password — changes the password. The server revokes all
 * refresh tokens, so the caller is signed out locally afterwards.
 */
export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await api.post("/api/auth/password", input);
  clearSession();
}

/* ── OAuth (Continue with Google) ────────────────────────────── */

/**
 * Starts the OAuth dance: full-page navigation to the backend, which
 * 302s to the provider. The callback eventually lands back on /login
 * with a ?oauth-code= that exchangeOAuthCode swaps for a session.
 */
export function startOAuth(provider: "google"): void {
  window.location.href = `/api/auth/oauth/${provider}`;
}

/** POST /api/auth/oauth/exchange — swaps the one-time code for a session. */
export async function exchangeOAuthCode(code: string): Promise<AuthSession> {
  const session = await api.post<AuthSession>("/api/auth/oauth/exchange", {
    code,
  });
  saveSession(session);
  return session;
}
