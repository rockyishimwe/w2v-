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
import { changePasswordSchema } from "@/server/schemas";
import { authService } from "@/server/services/auth-service";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/**
 * POST /api/auth/password — changes the password after re-verifying the
 * current one. Every refresh token is revoked, so the client must log in
 * again (the Settings page clears the local session on success).
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!isAllowed(`auth:password:${auth.id}`, RATE_LIMITS.auth)) {
      throw rateLimited();
    }

    const body = await parseJsonBody(request, changePasswordSchema);
    await authService.changePassword(auth.id, body);
    return jsonResponse(request, { success: true });
  } catch (error) {
    return errorResponse(request, error);
  }
}
