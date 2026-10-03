import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
  parseJsonBody,
  resolveLocale,
} from "@/server/lib/http";
import { rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { optionalAuth } from "@/server/lib/auth";
import { aiTipsSchema } from "@/server/schemas";
import { recyclingTips } from "@/server/services/ai-service";

/**
 * Groq calls are bounded by a 20s budget per call (src/server/lib/groq.ts)
 * and this route may make two in sequence, so give the function room to
 * finish and serve the fallback instead of being killed mid-request.
 */
export const maxDuration = 60;

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await optionalAuth(request);

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    if (!isAllowed(`ai:${auth?.id ?? ip}`, RATE_LIMITS.ai)) {
      throw rateLimited();
    }

    const body = await parseJsonBody(request, aiTipsSchema);
    const locale = resolveLocale(request, body.locale);
    const result = await recyclingTips(body.material, locale);

    return jsonResponse(request, {
      material: body.material,
      tips: result.tips,
    });
  } catch (error) {
    return errorResponse(request, error);
  }
}
