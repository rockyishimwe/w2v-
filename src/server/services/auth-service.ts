/**
 * Auth service: registration, login, refresh-token rotation and logout.
 * Access tokens are short-lived JWTs; refresh tokens are stored hashed
 * and rotated on every refresh (replay of an old token revokes the family).
 */
import { prisma } from "../lib/prisma";
import { badRequest, conflict, unauthorized } from "../lib/errors";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_DAYS,
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
  type AccessTokenPayload,
} from "../lib/tokens";
import { hashPassword, verifyPassword } from "../lib/password";

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
}

export interface AuthSession {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // access-token TTL in seconds
}

function toPublicUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    locale: user.locale,
  };
}

export const authService = {
  register,
  login,
  refresh,
  logout,
  me,
};

async function issueSession(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
}): Promise<AuthSession> {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    locale: user.locale,
  };
  const accessToken = await signAccessToken(payload);

  const refreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashRefreshToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 86_400_000),
    },
  });

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  };
}

export async function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  locale?: string;
}): Promise<AuthSession> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw conflict("An account with this email already exists.");
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash: await hashPassword(input.password),
      firstName: input.firstName,
      lastName: input.lastName,
      locale: input.locale ?? "en",
    },
  });

  return issueSession(user);
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw unauthorized("Invalid email or password.");
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    throw unauthorized("Invalid email or password.");
  }

  return issueSession(user);
}

/**
 * Exchanges a refresh token for a new session. The used token is revoked
 * and a fresh one issued (rotation). Reuse of a revoked token is treated
 * as theft: every active token of that user is revoked.
 */
export async function refresh(rawToken: string): Promise<AuthSession> {
  const tokenHash = hashRefreshToken(rawToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw unauthorized("Refresh token is invalid or expired.");
  }

  if (stored.revoked) {
    // Replay detected — revoke the whole family for this user.
    await prisma.refreshToken.updateMany({
      where: { userId: stored.userId, revoked: false },
      data: { revoked: true },
    });
    throw unauthorized("Refresh token was already used. Please log in again.");
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  });

  return issueSession(stored.user);
}

/** Revokes a single refresh token (logout). Idempotent. */
export async function logout(rawToken: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashRefreshToken(rawToken), revoked: false },
    data: { revoked: true },
  });
}

export async function me(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw badRequest("Account no longer exists.");
  }
  return toPublicUser(user);
}
