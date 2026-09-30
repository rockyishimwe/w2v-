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

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const user = await authService.me(auth.id);
    return jsonResponse(request, { user });
  } catch (error) {
    return errorResponse(request, error);
  }
}
