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
import { aiAssistantSchema } from "@/server/schemas";
import { assistantReply } from "@/server/services/ai-service";
import { prisma } from "@/server/lib/prisma";
import { logger } from "@/server/lib/logger";

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
    const auth = await requireAuth(request);

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    if (!isAllowed(`ai:${auth.id}:${ip}`, RATE_LIMITS.ai)) {
      throw rateLimited();
    }

    const body = await parseJsonBody(request, aiAssistantSchema);
    const locale = resolveLocale(request, body.locale);

    const reply = await assistantReply(
      body.message,
      body.history ?? [],
      locale,
      body.image,
    );

    // Persist both sides of the exchange for the Recent Chat card. The
    // photo itself is never stored (same rule as scans — keep rows small);
    // the transcript just records that one was attached.
    await prisma.assistantMessage.createMany({
      data: [
        {
          userId: auth.id,
          role: "user",
          text: body.image ? `${body.message} (photo attached)` : body.message,
          locale,
        },
        {
          userId: auth.id,
          role: "assistant",
          text: reply.text,
          ideas:
            reply.ideas.length > 0
              ? reply.ideas.map((idea) => ({ ...idea }))
              : undefined,
          locale,
        },
      ],
    });

    logger.info("assistant replied", {
      userId: auth.id,
      source: reply.source,
      withPhoto: Boolean(body.image),
    });
    return jsonResponse(request, {
      text: reply.text,
      ideas: reply.ideas,
    });
  } catch (error) {
    return errorResponse(request, error);
  }
}
