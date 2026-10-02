import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
  parseJsonBody,
} from "@/server/lib/http";
import { rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { requireAuth } from "@/server/lib/auth";
import { z } from "zod";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/server/repositories/notification-repository";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

const markReadSchema = z.object({
  /** Specific notification to mark read; omit to mark ALL as read. */
  id: z.string().min(1).max(64).optional(),
});

/**
 * POST /api/notifications/read — mark one notification read ({ id }) or
 * everything ({ }). Returns the updated unread count for the badge.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!isAllowed(`notifications:${auth.id}`, RATE_LIMITS.default)) {
      throw rateLimited();
    }

    const body = await parseJsonBody(request, markReadSchema);

    const unread =
      body.id !== undefined
        ? await markNotificationRead(auth.id, body.id)
        : await markAllNotificationsRead(auth.id);

    return jsonResponse(request, { ok: true, unread });
  } catch (error) {
    return errorResponse(request, error);
  }
}
