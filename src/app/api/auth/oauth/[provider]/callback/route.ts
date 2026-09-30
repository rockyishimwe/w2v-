import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/server/lib/logger";
import {
  OAUTH_STATE_COOKIE,
  appUrl,
  exchangeCodeForToken,
  fetchProviderProfile,
} from "@/server/lib/oauth";
import {
  oauthCreateLoginCode,
  oauthUpsertUser,
} from "@/server/services/auth-service";

type Params = { params: Promise<{ provider: string }> };

/**
 * GET /api/auth/oauth/[provider]/callback — the provider redirects here
 * after the user approves. Verifies the state cookie, exchanges the
 * authorization code, upserts the user, then redirects to the frontend
 * with a one-time login code (?oauth-code=...). Provider tokens never
 * reach the browser.
 */
export async function GET(request: NextRequest, { params }: Params) {
  const { provider } = await params;
  const base = appUrl();

  try {
    if (provider !== "google") {
      return NextResponse.redirect(`${base}/?oauth=invalid`);
    }

    const url = request.nextUrl;
    const providerError = url.searchParams.get("error");
    if (providerError) {
      // User cancelled the consent screen.
      return NextResponse.redirect(`${base}/?oauth=cancelled`);
    }

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const expectedState = request.cookies.get(
      OAUTH_STATE_COOKIE(provider),
    )?.value;

    if (!code || !state || !expectedState || state !== expectedState) {
      return NextResponse.redirect(`${base}/?oauth=state_mismatch`);
    }

    const accessToken = await exchangeCodeForToken(provider, code);
    const profile = await fetchProviderProfile(provider, accessToken);
    const user = await oauthUpsertUser(provider, profile);
    const loginCode = await oauthCreateLoginCode(user.id);

    const response = NextResponse.redirect(
      `${base}/?oauth-code=${encodeURIComponent(loginCode)}`,
    );
    // State cookie is single-use.
    response.cookies.delete(OAUTH_STATE_COOKIE(provider));
    return response;
  } catch (error) {
    logger.warn("oauth callback failed", {
      provider,
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.redirect(`${base}/?oauth=failed`);
  }
}
