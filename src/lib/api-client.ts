/**
 * Frontend API client for the Waste2Value backend (Route Handlers under
 * /api). Features:
 *  - attaches the short-lived access token to every request,
 *  - retries once through POST /api/auth/refresh on 401 (single-flight),
 *  - persists tokens in localStorage (token-based auth per the SRS),
 *  - passes Idempotency-Key on POSTs so offline-queued sends can retry,
 *  - same-origin by default; NEXT_PUBLIC_API_BASE_URL overrides it.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const ACCESS_KEY = "w2v.access-token";
const REFRESH_KEY = "w2v.refresh-token";

/* ── Token storage ──────────────────────────────────────────────── */

export interface AuthSession {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    locale: string;
    /** False for Google accounts, which have no password. */
    hasPassword: boolean;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Token storage lives in localStorage — present in the browser, absent
 * during SSR (guarded below), stubbed in unit tests. Guarding on the
 * storage API itself (rather than `window`) keeps browser, SSR and test
 * environments all correct.
 */
function storageAvailable(): boolean {
  return typeof localStorage !== "undefined";
}

export function saveSession(session: AuthSession): void {
  if (!storageAvailable()) return;
  localStorage.setItem(ACCESS_KEY, session.accessToken);
  localStorage.setItem(REFRESH_KEY, session.refreshToken);
}

export function clearSession(): void {
  if (!storageAvailable()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getAccessToken(): string | null {
  if (!storageAvailable()) return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!storageAvailable()) return null;
  return localStorage.getItem(REFRESH_KEY);
}

/* ── Error shape ────────────────────────────────────────────────── */

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/* ── Refresh (single-flight) ────────────────────────────────────── */

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return false;
    saveSession((await response.json()) as AuthSession);
    return true;
  } catch {
    return false;
  }
}

async function refreshOnce(): Promise<boolean> {
  refreshPromise ??= refreshSession().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

/* ── Core request ───────────────────────────────────────────────── */

function idempotencyKey(): string {
  return `idem-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface RequestOptions {
  method?: "GET" | "POST";
  body?: unknown;
  /** Sent for POSTs; retries of an offline-queued send reuse the same key. */
  idempotencyKey?: string;
  locale?: string;
  signal?: AbortSignal;
  /** Internal: don't attempt refresh again (prevents loops). */
  _retried?: boolean;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    idempotencyKey: idemKey,
    locale,
    signal,
  } = options;

  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (locale) headers["Accept-Language"] = locale;
  if (method === "POST") {
    headers["Idempotency-Key"] = idemKey ?? idempotencyKey();
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (response.status === 401 && !options._retried) {
    const refreshed = await refreshOnce();
    if (refreshed) {
      return request<T>(path, { ...options, _retried: true });
    }
    clearSession();
  }

  // 304 handled by the browser cache; treat 2xx and 304 as success.
  if (response.status === 304) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const err = payload as ApiErrorResponse | null;
    throw new ApiClientError(
      response.status,
      err?.error?.code ?? "UNKNOWN",
      err?.error?.message ?? `Request failed (${response.status})`,
      err?.error?.details,
    );
  }

  return payload as T;
}

/* ── Typed convenience wrappers ─────────────────────────────────── */

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
};
