import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/server/lib/http";
import { requireAuth } from "@/server/lib/auth";
import { authService } from "@/server/services/auth-service";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/**
 * POST /api/auth/logout-all — revokes every refresh token of the caller
 * ("sign out on all devices"). Idempotent.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    await authService.logoutAll(auth.id);
    return jsonResponse(request, { success: true });
  } catch (error) {
    return errorResponse(request, error);
  }
}
