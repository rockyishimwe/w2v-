import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/server/lib/http";
import { prisma } from "@/server/lib/prisma";
import { isGroqConfigured } from "@/server/lib/groq";

export async function GET(request: NextRequest) {
  try {
    let db: "up" | "down" = "down";
    try {
      await prisma.$queryRaw`SELECT 1`;
      db = "up";
    } catch {
      db = "down";
    }

    return jsonResponse(request, {
      status: "ok",
      db,
      ai: isGroqConfigured() ? "configured" : "fallback",
      time: new Date().toISOString(),
    });
  } catch (error) {
    return errorResponse(request, error);
  }
}
