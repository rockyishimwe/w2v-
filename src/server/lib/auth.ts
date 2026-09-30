/**
 * Request authentication: resolves the caller from the Authorization
 * bearer token and enforces presence/validity on protected endpoints.
 */
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { unauthorized } from "./errors";
import { bearerToken } from "./http";
import { verifyAccessToken } from "./tokens";

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
}

/**
 * Verifies the access JWT and loads the user from the database.
 * Throws 401 UNAUTHORIZED when the token is missing, expired or the user
 * no longer exists.
 */
export async function requireAuth(
  request: NextRequest,
): Promise<AuthenticatedUser> {
  const token = bearerToken(request);
  if (!token) {
    throw unauthorized();
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    throw unauthorized("Session expired. Please log in again.");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw unauthorized("Account no longer exists.");
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    locale: user.locale,
  };
}

/** Same as requireAuth but returns null instead of throwing. */
export async function optionalAuth(
  request: NextRequest,
): Promise<AuthenticatedUser | null> {
  try {
    return await requireAuth(request);
  } catch {
    return null;
  }
}
