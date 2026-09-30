import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
  parseJsonBody,
} from "@/server/lib/http";
import { updateProfileSchema } from "@/server/schemas";
import { requireAuth } from "@/server/lib/auth";
import { authService } from "@/server/services/auth-service";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const user = await authService.me(auth.id);
    return jsonResponse(request, { user });
  } catch (error) {
    return errorResponse(request, error);
  }
}

/**
 * POST /api/auth/me — updates the signed-in user's profile (Settings
 * page: name and preferred language). Returns the fresh public user.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body = await parseJsonBody(request, updateProfileSchema);
    const user = await authService.updateProfile(auth.id, body);
    return jsonResponse(request, { user });
  } catch (error) {
    return errorResponse(request, error);
  }
}
