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
import { requireAuth } from "@/server/lib/auth";
import { aiGenerateIdeaSchema } from "@/server/schemas";
import { generateIdea } from "@/server/services/ai-service";

/**
 * Groq calls are bounded by a 20s budget per call (src/server/lib/groq.ts)
 * and this route may make two in sequence, so give the function room to
 * finish and serve the fallback instead of being killed mid-request.
 */
export const maxDuration = 60;

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/**
 * POST /api/ideas/generate — invents one reuse/DIY idea for a material
 * with AI and persists it (auth required, AI rate limit).
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!isAllowed(`ai:${auth.id}`, RATE_LIMITS.ai)) {
      throw rateLimited();
    }

    const body = await parseJsonBody(request, aiGenerateIdeaSchema);
    const locale = resolveLocale(request, body.locale);
    const idea = await generateIdea(body.material, locale);

    return jsonResponse(request, idea, { status: 201 });
  } catch (error) {
    return errorResponse(request, error);
  }
}
