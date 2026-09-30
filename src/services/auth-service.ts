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

/** Logs out server-side and clears the stored session. Idempotent. */
export async function logout(): Promise<void> {
  try {
    await api.post("/api/auth/logout", { refreshToken: undefined });
  } catch {
    // Even if the server call fails, the local session must go.
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
}

/** GET /api/auth/me — the signed-in user (throws when unauthenticated). */
export function fetchCurrentUser(): Promise<CurrentUser> {
  return api.get<CurrentUser>("/api/auth/me");
}
