import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
  parseJsonBody,
} from "@/server/lib/http";
import { rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { z } from "zod";
import { oauthExchangeCode } from "@/server/services/auth-service";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

const exchangeSchema = z.object({
  code: z.string().min(20).max(200),
});

/**
 * POST /api/auth/oauth/exchange — swaps the one-time ?oauth-code= from
 * the OAuth redirect for the real { user, accessToken, refreshToken }
 * session (same shape as login/register). Codes are single-use.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isAllowed("oauth-exchange", RATE_LIMITS.auth)) {
      throw rateLimited();
    }

    const body = await parseJsonBody(request, exchangeSchema);
    const session = await oauthExchangeCode(body.code);
    return jsonResponse(request, session);
  } catch (error) {
    return errorResponse(request, error);
  }
}
