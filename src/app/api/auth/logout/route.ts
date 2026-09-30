import { NextRequest } from "next/server";
import {
  parseJsonBody,
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/server/lib/http";
import { logoutSchema } from "@/server/schemas";
import { authService } from "@/server/services/auth-service";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody(request, logoutSchema);
    await authService.logout(body.refreshToken);
    return jsonResponse(request, { success: true });
  } catch (error) {
    return errorResponse(request, error);
  }
}
