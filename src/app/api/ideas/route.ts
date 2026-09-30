import { NextRequest } from "next/server";
import {
  errorResponse,
  jsonResponse,
  optionsResponse,
} from "@/server/lib/http";
import { listIdeas } from "@/server/repositories/idea-repository";

export async function OPTIONS(request: NextRequest) {
  return optionsResponse(request);
}

/** GET /api/ideas?category=Plastic|Glass|Cardboard|Organic|Textile|... */
export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category") ?? undefined;
    const data = await listIdeas(category);
    return jsonResponse(request, { data });
  } catch (error) {
    return errorResponse(request, error);
  }
}
