import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/server/lib/http";
import { rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { requireAuth } from "@/server/lib/auth";
import { listNotifications } from "@/server/repositories/notification-repository";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/**
 * GET /api/notifications — the caller's latest notifications plus the
 * unread count for the bell badge. Polled by the frontend (~every 20s)
 * so the dropdown stays fresh without websockets.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!isAllowed(`notifications:${auth.id}`, RATE_LIMITS.default)) {
      throw rateLimited();
    }

    const result = await listNotifications(auth.id);
    return jsonResponse(request, result);
  } catch (error) {
    return errorResponse(request, error);
  }
}
