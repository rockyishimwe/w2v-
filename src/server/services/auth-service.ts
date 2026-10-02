/**
 * Auth service: registration, login, refresh-token rotation and logout.
 * Access tokens are short-lived JWTs; refresh tokens are stored hashed
 * and rotated on every refresh (replay of an old token revokes the family).
 */
import { prisma } from "../lib/prisma";
import { badRequest, conflict, unauthorized, forbidden } from "../lib/errors";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_DAYS,
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
  type AccessTokenPayload,
} from "../lib/tokens";
import { hashPassword, verifyPassword } from "../lib/password";
import { deleteUpload } from "../lib/uploads";
import {
  hashLoginCode,
  newLoginCode,
  type OAuthProvider,
  type ProviderProfile,
} from "../lib/oauth";
import { createNotification } from "../repositories/notification-repository";

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
  /**
   * False for accounts created through Google: they have no
   * password, so the Settings page hides the password form for them.
   */
  hasPassword: boolean;
  /** Uploaded profile photo path, or null when none has been set. */
  avatarPath: string | null;
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
  passwordHash?: string | null;
  avatarPath?: string | null;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    locale: user.locale,
    hasPassword: Boolean(user.passwordHash),
    avatarPath: user.avatarPath ?? null,
  };
}

/**
 * Stores a freshly uploaded profile photo and drops the previous file,
 * so the uploads directory does not grow with every replacement.
 * Passing null removes the photo and falls back to the generated art.
 */
export async function setAvatar(
  userId: string,
  avatarPath: string | null,
): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw badRequest("Account no longer exists.");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { avatarPath },
  });

  if (user.avatarPath && user.avatarPath !== avatarPath) {
    await deleteUpload(user.avatarPath);
  }
  return toPublicUser(updated);
}

export const authService = {
  register,
  login,
  refresh,
  logout,
  me,
  updateProfile,
  setAvatar,
  changePassword,
  logoutAll,
  oauthUpsertUser,
  oauthCreateLoginCode,
  oauthExchangeCode,
};

async function issueSession(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
  passwordHash?: string | null;
  avatarPath?: string | null;
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

  await createNotification({
    userId: user.id,
    type: "welcome",
    title: `Welcome to Waste2Value, ${user.firstName}!`,
    body: "Scan waste, track your impact and exchange reusable items with your community.",
    href: "/dashboard",
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

  // OAuth-only accounts have no password — point them at their provider.
  if (!user.passwordHash) {
    throw unauthorized(
      "This email is registered with Google. Continue with Google to sign in.",
    );
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

/** Updates the editable parts of a profile (Settings page). */
export async function updateProfile(
  userId: string,
  input: { firstName?: string; lastName?: string; locale?: string },
): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw badRequest("Account no longer exists.");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
      ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
      ...(input.locale !== undefined ? { locale: input.locale } : {}),
    },
  });
  return toPublicUser(updated);
}

/**
 * Changes the password after re-verifying the current one, then revokes
 * every refresh token so other devices must sign in again.
 */
export async function changePassword(
  userId: string,
  input: { currentPassword: string; newPassword: string },
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw badRequest("Account no longer exists.");
  }
  if (!user.passwordHash) {
    throw badRequest(
      "This account signs in with Google, so it has no password to change.",
    );
  }

  const valid = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!valid) {
    throw unauthorized("Your current password is incorrect.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(input.newPassword) },
  });
  await logoutAll(userId);
}

/** Revokes every active refresh token of a user ("sign out everywhere"). */
export async function logoutAll(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  });
}

/* ── OAuth (Google) ────────────────────────────────────────────── */

/**
 * Finds or creates the user for an OAuth profile. When an email account
 * already exists (registered with password), the OAuth identity is
 * linked to it — Google-verified emails are trusted.
 */
export async function oauthUpsertUser(
  provider: OAuthProvider,
  profile: ProviderProfile,
): Promise<PublicUser> {
  // 1. Existing OAuth identity → straight in.
  const linked = await prisma.user.findFirst({
    where: { oauthProvider: provider, oauthId: profile.oauthId },
  });
  if (linked) return toPublicUser(linked);

  // 2. Existing email account → link the OAuth identity to it.
  const byEmail = await prisma.user.findUnique({
    where: { email: profile.email },
  });
  if (byEmail) {
    const updated = await prisma.user.update({
      where: { id: byEmail.id },
      data: { oauthProvider: provider, oauthId: profile.oauthId },
    });
    return toPublicUser(updated);
  }

  // 3. New user — passwordless (passwordHash stays null).
  const created = await prisma.user.create({
    data: {
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      oauthProvider: provider,
      oauthId: profile.oauthId,
    },
  });

  await createNotification({
    userId: created.id,
    type: "welcome",
    title: `Welcome to Waste2Value, ${created.firstName}!`,
    body: "Scan waste, track your impact and exchange reusable items with your community.",
    href: "/dashboard",
  });

  return toPublicUser(created);
}

/** Creates a short-lived one-time login code for a just-authenticated user. */
export async function oauthCreateLoginCode(userId: string): Promise<string> {
  const { code, hash } = newLoginCode();
  await prisma.oAuthLoginCode.create({
    data: {
      code: hash,
      userId,
      expiresAt: new Date(Date.now() + 120_000), // 2 minutes
    },
  });
  return code;
}

/**
 * Consumes a one-time login code and issues the real JWT session.
 * Codes are single-use: replay is rejected.
 */
export async function oauthExchangeCode(code: string): Promise<AuthSession> {
  const hash = hashLoginCode(code);
  const stored = await prisma.oAuthLoginCode.findUnique({
    where: { code: hash },
    include: { user: true },
  });

  if (!stored || stored.usedAt || stored.expiresAt < new Date()) {
    throw forbidden("This login link has expired. Please try again.");
  }

  await prisma.oAuthLoginCode.update({
    where: { code: hash },
    data: { usedAt: new Date() },
  });

  return issueSession({
    id: stored.user.id,
    email: stored.user.email,
    firstName: stored.user.firstName,
    lastName: stored.user.lastName,
    locale: stored.user.locale,
  });
}
