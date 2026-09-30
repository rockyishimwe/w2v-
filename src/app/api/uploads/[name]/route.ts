import { NextRequest, NextResponse } from "next/server";
import { errorResponse, optionsResponse } from "@/server/lib/http";
import { readUpload } from "@/server/lib/uploads";

type Params = { params: Promise<{ name: string }> };

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/**
 * GET /api/uploads/[name] — serves a stored image with long-lived
 * immutable caching (filenames are content-unique).
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { name } = await params;
    const { data, mime } = await readUpload(name);

    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Length": String(data.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return errorResponse(request, error);
  }
}
