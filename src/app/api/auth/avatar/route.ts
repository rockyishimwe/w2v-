import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/server/lib/http";
import { ApiError, rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { requireAuth } from "@/server/lib/auth";
import { AVATAR_FORMATS, saveUpload } from "@/server/lib/uploads";
import { authService } from "@/server/services/auth-service";

/** Profile photos are small; 1 MB is plenty for an avatar. */
const MAX_AVATAR_BYTES = 1_000_000;

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/**
 * POST /api/auth/avatar — multipart profile photo upload (auth required).
 * Field name: "file". Accepts JPG, PNG and GIF only; the previous photo
 * is deleted. Returns the fresh public user.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!isAllowed(`avatar:${auth.id}`, RATE_LIMITS.default)) {
      throw rateLimited();
    }

    const form = await request.formData().catch(() => {
      throw new ApiError(
        400,
        "BAD_REQUEST",
        "Expected multipart/form-data with a 'file' field.",
      );
    });

    const file = form.get("file");
    if (!(file instanceof File)) {
      throw new ApiError(
        400,
        "BAD_REQUEST",
        "Missing 'file' field in form data.",
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await saveUpload(buffer, file.type, {
      allow: AVATAR_FORMATS,
      maxBytes: MAX_AVATAR_BYTES,
    });
    const user = await authService.setAvatar(auth.id, saved.path);

    return jsonResponse(request, { user }, { status: 201 });
  } catch (error) {
    return errorResponse(request, error);
  }
}

/** DELETE /api/auth/avatar — removes the photo, back to generated art. */
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const user = await authService.setAvatar(auth.id, null);
    return jsonResponse(request, { user });
  } catch (error) {
    return errorResponse(request, error);
  }
}
