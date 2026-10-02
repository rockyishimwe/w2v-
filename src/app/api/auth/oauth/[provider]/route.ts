import { NextRequest, NextResponse } from "next/server";
import { errorResponse, optionsResponse } from "@/server/lib/http";
import {
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_MAX_AGE,
  appUrl,
  createState,
  isProviderEnabled,
  providerConfig,
  redirectUri,
} from "@/server/lib/oauth";
import { logger } from "@/server/lib/logger";

type Params = { params: Promise<{ provider: string }> };

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/**
 * GET /api/auth/oauth/[provider] — starts the OAuth dance: redirects to
 * Google with a CSRF state value also stored in an httpOnly
 * cookie (compared on callback). Unknown provider → 404-ish error page.
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { provider } = await params;
    if (provider !== "google") {
      return NextResponse.redirect(`${appUrl()}/?oauth=invalid`);
    }

    if (!isProviderEnabled()) {
      logger.warn("oauth start: provider not configured", { provider });
      return NextResponse.redirect(`${appUrl()}/?oauth=unavailable`);
    }

    const state = createState();
    const config = providerConfig();

    const authorizeUrl = new URL(config.authorizeUrl);
    authorizeUrl.searchParams.set("client_id", config.clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri(provider));
    authorizeUrl.searchParams.set("state", state);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("access_type", "offline");
    authorizeUrl.searchParams.set("prompt", "select_account");
    authorizeUrl.searchParams.set("scope", config.scope);

    const response = NextResponse.redirect(authorizeUrl.toString());
    response.cookies.set(OAUTH_STATE_COOKIE(provider), state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: OAUTH_STATE_MAX_AGE,
    });
    return response;
  } catch (error) {
    // Configuration is checked above, so anything here is a genuine failure:
    // report it as such instead of mislabelling it "not configured".
    logger.warn("oauth start failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    if (error instanceof Error) {
      return NextResponse.redirect(`${appUrl()}/?oauth=failed`);
    }
    return errorResponse(request, error);
  }
}
