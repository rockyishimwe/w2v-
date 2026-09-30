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
import { createInterestSchema } from "@/server/schemas";
import {
  createInterest,
  getListingDetail,
} from "@/server/repositories/exchange-repository";

type Params = { params: Promise<{ id: string }> };

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/** GET /api/exchange/listings/[id] — full detail payload. */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const detail = await getListingDetail(id);
    return jsonResponse(request, detail);
  } catch (error) {
    return errorResponse(request, error);
  }
}

/** POST /api/exchange/listings/[id] — express interest in the item. */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth(request);
    if (!isAllowed(`exchange:${auth.id}`, RATE_LIMITS.default)) {
      throw rateLimited();
    }

    const { id } = await params;
    const body = await parseJsonBody(request, createInterestSchema);
    await createInterest(id, auth.id, body.message);
    return jsonResponse(request, { ok: true }, { status: 201 });
  } catch (error) {
    return errorResponse(request, error);
  }
}
