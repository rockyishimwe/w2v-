/**
 * The two languages the product supports: English and French. The server
 * validates the same set in `localeSchema`.
 */
export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Settings-page labels, each written in its own language. */
export const LOCALE_LABELS: { value: Locale; label: string; hint: string }[] = [
  { value: "en", label: "English", hint: "English" },
  { value: "fr", label: "French", hint: "Français" },
];

export function isLocale(value: string | null | undefined): value is Locale {
  return (
    value !== null &&
    value !== undefined &&
    (LOCALES as readonly string[]).includes(value)
  );
}

/**
 * Mirrors the signed-in user's language so the UI can render in it on the
 * very first paint, before GET /api/auth/me resolves.
 */
export const LOCALE_STORAGE_KEY = "w2v.locale";
