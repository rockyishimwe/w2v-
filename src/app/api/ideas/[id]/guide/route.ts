import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
  resolveLocale,
} from "@/server/lib/http";
import { ApiError, rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { optionalAuth } from "@/server/lib/auth";
import { prisma } from "@/server/lib/prisma";
import {
  getGuidePayload,
  getIdea,
  saveGuide,
} from "@/server/repositories/idea-repository";
import { generateGuide } from "@/server/services/ai-service";

type Params = { params: Promise<{ id: string }> };

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
 * GET /api/ideas/[id]/guide — full DIY guide for an idea.
 * First request generates it with AI and caches it in the DB; later
 * requests serve the cached copy (real-time content, no hardcoding).
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const auth = await optionalAuth(request);
    if (!isAllowed(`guide:${auth?.id ?? "anon"}`, RATE_LIMITS.ai)) {
      throw rateLimited();
    }

    const { id } = await params;
    const idea = await getIdea(id);
    if (!idea) {
      throw new ApiError(404, "NOT_FOUND", "Idea not found.");
    }

    // Serve the cached guide when present…
    const cached = await getGuidePayload(id).catch(() => null);
    if (cached) {
      return jsonResponse(request, {
        id: cached.id,
        artKey: cached.artKey,
        ...cached.guide,
      });
    }

    // …otherwise generate it now with AI and cache it.
    const locale = resolveLocale(request);
    const row = await prisma.idea.findUniqueOrThrow({
      where: { seedId: id },
      select: {
        seedId: true,
        title: true,
        description: true,
        time: true,
        impact: true,
        categories: true,
      },
    });
    const guide = await generateGuide(row, locale);
    await saveGuide(id, guide);
    return jsonResponse(request, {
      id: row.seedId,
      artKey: idea.artKey,
      ...guide,
    });
  } catch (error) {
    return errorResponse(request, error);
  }
}
