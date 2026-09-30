import { NextRequest } from "next/server";
import {
  parseJsonBody,
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/server/lib/http";
import { rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { refreshSchema } from "@/server/schemas";
import { authService } from "@/server/services/auth-service";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    if (!isAllowed(`auth:${ip}`, RATE_LIMITS.auth)) {
      throw rateLimited();
    }

    const body = await parseJsonBody(request, refreshSchema);
    const session = await authService.refresh(body.refreshToken);
    return jsonResponse(request, session);
  } catch (error) {
    return errorResponse(request, error);
  }
}
