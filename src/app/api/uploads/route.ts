import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/server/lib/http";
import { ApiError, rateLimited } from "@/server/lib/errors";
import { RATE_LIMITS, isAllowed } from "@/server/lib/rate-limit";
import { requireAuth } from "@/server/lib/auth";
import { saveUpload } from "@/server/lib/uploads";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/**
 * POST /api/uploads — multipart image upload (auth required).
 * Field name: "file". Returns { path, mime, bytes } where `path` is the
 * public URL to attach to a listing.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!isAllowed(`uploads:${auth.id}`, RATE_LIMITS.default)) {
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
    const saved = await saveUpload(buffer, file.type);

    return jsonResponse(request, saved, { status: 201 });
  } catch (error) {
    return errorResponse(request, error);
  }
}
