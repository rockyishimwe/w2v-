/**
 * OAuth helpers for "Continue with Facebook / Google".
 *
 * Flow (authorization-code with CSRF state cookie):
 *   1. GET  /api/auth/oauth/facebook|google → 302 to the provider with a
 *      random `state` also stored in an httpOnly cookie
 *   2. provider redirects back to /api/auth/oauth/<provider>/callback
 *   3. callback verifies the state cookie, exchanges the code for tokens,
 *      fetches the profile, upserts the user
 *   4. a short-lived one-time login code is stored in the DB and the
 *      browser is redirected to /?oauth-code=<otp>
 *   5. the frontend POSTs that code to /api/auth/oauth/exchange and
 *      receives the exact same JWT session as email login
 *
 * Provider access tokens never touch the browser.
 */
import { createHash, randomBytes } from "node:crypto";
import { unauthorized } from "./errors";
import { logger } from "./logger";

/* ── Provider configuration ─────────────────────────────────────── */

export type OAuthProvider = "facebook" | "google";

export interface ProviderProfile {
  /** Stable id at the provider. */
  oauthId: string;
  email: string;
  firstName: string;
  lastName: string;
  /** Verified email at the provider (Google) or via app review (FB). */
  emailVerified: boolean;
}

export function providerConfig(provider: OAuthProvider): {
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  scope: string;
} {
  if (provider === "facebook") {
    const clientId = process.env.FACEBOOK_APP_ID;
    const clientSecret = process.env.FACEBOOK_APP_SECRET;
    if (!clientId || !clientSecret) {
      throw unauthorized("Facebook login is not configured on this server.");
    }
    return {
      clientId,
      clientSecret,
      authorizeUrl: "https://www.facebook.com/v21.0/dialog/oauth",
      tokenUrl: "https://graph.facebook.com/v21.0/oauth/access_token",
      scope: "email public_profile",
    };
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw unauthorized("Google login is not configured on this server.");
  }
  return {
    clientId,
    clientSecret,
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scope: "openid email profile",
  };
}

export function isProviderEnabled(provider: OAuthProvider): boolean {
  if (provider === "facebook") {
    return Boolean(
      process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET,
    );
  }
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
}

/** Public base URL used for OAuth redirect URIs (must match the provider app settings). */
export function appUrl(): string {
  return (
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

export function redirectUri(provider: OAuthProvider): string {
  return `${appUrl()}/api/auth/oauth/${provider}/callback`;
}

/* ── State (CSRF) ───────────────────────────────────────────────── */

export function createState(): string {
  return randomBytes(24).toString("base64url");
}

export const OAUTH_STATE_COOKIE = (provider: OAuthProvider): string =>
  `w2v.oauth.state.${provider}`;

export const OAUTH_STATE_MAX_AGE = 600; // 10 minutes

/* ── Token exchange + profile fetch (per provider) ──────────────── */

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    logger.warn("oauth provider error", {
      status: response.status,
      body: body.slice(0, 300),
    });
    throw unauthorized(`OAuth provider error (${response.status}).`);
  }
  return response.json();
}

interface TokenResponse {
  access_token: string;
}

/** Exchanges the authorization code for a provider access token. */
export async function exchangeCodeForToken(
  provider: OAuthProvider,
  code: string,
): Promise<string> {
  const config = providerConfig(provider);
  const body = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: redirectUri(provider),
    grant_type: "authorization_code",
  });

  const token = (await fetchJson(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })) as TokenResponse;

  if (!token.access_token) {
    throw unauthorized("OAuth token exchange failed.");
  }
  return token.access_token;
}

/** Fetches and normalizes the user profile from the provider. */
export async function fetchProviderProfile(
  provider: OAuthProvider,
  accessToken: string,
): Promise<ProviderProfile> {
  if (provider === "facebook") {
    const profile = (await fetchJson(
      `https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=${encodeURIComponent(accessToken)}`,
    )) as {
      id: string;
      first_name?: string;
      last_name?: string;
      email?: string;
    };

    if (!profile.email) {
      throw unauthorized(
        "Your Facebook account has no email we can use. Please sign up with email instead.",
      );
    }
    return {
      oauthId: profile.id,
      email: profile.email.toLowerCase(),
      firstName: profile.first_name?.trim() || "Facebook",
      lastName: profile.last_name?.trim() || "User",
      // Facebook only shares a verified email after app review; treat as
      // verified only when the app is out of dev mode.
      emailVerified: false,
    };
  }

  const profile = (await fetchJson(
    `https://openidconnect.googleapis.com/v1/userinfo?access_token=${encodeURIComponent(accessToken)}`,
  )) as {
    sub: string;
    email?: string;
    email_verified?: boolean;
    given_name?: string;
    family_name?: string;
  };

  if (!profile.email) {
    throw unauthorized(
      "Your Google account has no email we can use. Please sign up with email instead.",
    );
  }
  return {
    oauthId: profile.sub,
    email: profile.email.toLowerCase(),
    firstName: profile.given_name?.trim() || "Google",
    lastName: profile.family_name?.trim() || "User",
    emailVerified: Boolean(profile.email_verified),
  };
}

/* ── One-time login codes ───────────────────────────────────────── */

/**
 * The code given to the browser derives from random bytes; we store a
 * SHA-256 hash so a DB leak cannot be replayed as a login.
 */
export function newLoginCode(): { code: string; hash: string } {
  const code = randomBytes(32).toString("base64url");
  return { code, hash: hashLoginCode(code) };
}

export function hashLoginCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}
