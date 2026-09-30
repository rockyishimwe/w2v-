import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/server/lib/http";
import { rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { requireAuth } from "@/server/lib/auth";
import { prisma } from "@/server/lib/prisma";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/**
 * GET /api/ai/assistant/history — the user's most recent assistant
 * messages (newest last), for restoring the chat and the dashboard's
 * "Recent Chat" card.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!isAllowed(`ai:${auth.id}`, RATE_LIMITS.default)) {
      throw rateLimited();
    }

    const messages = await prisma.assistantMessage.findMany({
      where: { userId: auth.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const data = messages.reverse().map((message) => ({
      id: message.id,
      role: message.role as "user" | "assistant",
      ...(message.text ? { text: message.text } : {}),
      ...(message.ideas ? { ideas: message.ideas } : {}),
      timestamp: message.createdAt.toISOString(),
    }));

    return jsonResponse(request, { data });
  } catch (error) {
    return errorResponse(request, error);
  }
}
