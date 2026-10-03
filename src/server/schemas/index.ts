/**
 * Zod schemas for every request body/query the API accepts.
 * ALL input is validated — never trust client data.
 */
import { z } from "zod";

/* ── Shared ─────────────────────────────────────────────────────── */

export const localeSchema = z.enum(["en", "fr"]);

/* ── Auth ───────────────────────────────────────────────────────── */

export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[a-zA-Z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a number"),
  locale: localeSchema.optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(16).max(512),
});

export const logoutSchema = refreshSchema;

/** POST /api/auth/me — profile edits from the Settings page. */
export const updateProfileSchema = z
  .object({
    firstName: z.string().trim().min(1).max(60).optional(),
    lastName: z.string().trim().min(1).max(60).optional(),
    locale: localeSchema.optional(),
  })
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    "Nothing to update.",
  );

/** POST /api/auth/password — password change from the Settings page. */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[a-zA-Z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

/* ── AI ─────────────────────────────────────────────────────────── */

const dataUrlImage = z
  .string()
  .max(1_400_000) // ~1.4 MB dataURL cap (client downscales to ≤1200px JPEG)
  .refine(
    (value) =>
      value.startsWith("data:image/jpeg;base64,") ||
      value.startsWith("data:image/png;base64,") ||
      value.startsWith("data:image/webp;base64,"),
    "image must be a base64 JPEG, PNG or WebP data URL",
  );

export const aiScanSchema = z.object({
  image: dataUrlImage,
  locale: localeSchema.optional(),
});

export const assistantRoleSchema = z.enum(["user", "assistant"]);

export const aiAssistantSchema = z.object({
  message: z.string().trim().min(1).max(2_000),
  /** Optional photo of the item, so the assistant can see what it is. */
  image: dataUrlImage.optional(),
  history: z
    .array(
      z.object({
        role: assistantRoleSchema,
        content: z.string().max(2_000),
      }),
    )
    .max(12)
    .optional(),
  locale: localeSchema.optional(),
});

export const aiTipsSchema = z.object({
  material: z.string().trim().min(1).max(120),
  locale: localeSchema.optional(),
});

/** POST /api/ideas/generate — invent one reuse/DIY idea for a material. */
export const aiGenerateIdeaSchema = z.object({
  material: z.string().trim().min(2).max(120),
  locale: localeSchema.optional(),
});

/* ── Activity ───────────────────────────────────────────────────── */

export const activityFilterSchema = z.enum([
  "All",
  "Recycling",
  "Reuse",
  "Exchange",
  "Scan",
]);

export const createActivitySchema = z.object({
  type: z.enum(["Scan", "Reuse", "Recycling", "Exchange"]),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
  location: z.string().trim().min(1).max(120).default("Home"),
  artKey: z.string().trim().min(1).max(60).default("glass-jar"),
  /** Estimated kg of waste diverted — feeds the impact stats. */
  wasteKg: z.number().nonnegative().max(1000).optional(),
  /** Client timestamp for offline-queued events. */
  occurredAt: z.string().datetime().optional(),
});

/* ── Exchange ───────────────────────────────────────────────────── */

export const createListingSchema = z.object({
  title: z.string().trim().min(3).max(120),
  meta: z.string().trim().min(1).max(120),
  tag: z.enum(["Free", "Exchange", "Sale"]),
  district: z.string().trim().min(2).max(60),
  distanceKm: z.number().nonnegative().max(200),
  material: z.enum([
    "Organic",
    "Paper",
    "Plastic",
    "Glass",
    "Metal",
    "Wood",
    "Textile",
    "Electronics",
  ]),
  category: z.string().trim().min(2).max(60),
  condition: z.enum(["New", "Good", "Fair"]),
  /** Public path returned by POST /api/uploads ("/api/uploads/img-..."). */
  imagePath: z
    .string()
    .regex(
      /^\/api\/uploads\/img-[a-z0-9-]+\.(jpg|png|webp)$/,
      "invalid image path",
    )
    .optional(),
});

export const createInterestSchema = z.object({
  message: z.string().trim().max(500).optional(),
});
