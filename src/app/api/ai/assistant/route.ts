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
    );

    // Persist both sides of the exchange for the Recent Chat card.
    await prisma.assistantMessage.createMany({
      data: [
        { userId: auth.id, role: "user", text: body.message, locale },
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

    logger.info("assistant replied", { userId: auth.id, source: reply.source });
    return jsonResponse(request, {
      text: reply.text,
      ideas: reply.ideas,
    });
  } catch (error) {
    return errorResponse(request, error);
  }
}
