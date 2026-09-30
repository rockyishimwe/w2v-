"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { dictionaries } from "./dictionaries";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "./locales";

/**
 * UI translation.
 *
 * Keys are the English source strings, so English needs no dictionary and
 * an untranslated key degrades to readable English instead of a blank or a
 * `missing.key` marker. French supplies the overrides.
 *
 * The language comes from the signed-in user's profile (`user.locale`),
 * which Settings writes. It is mirrored into localStorage so a reload
 * paints in the right language immediately instead of flashing English
 * while GET /api/auth/me is in flight. That mirror is read through
 * useSyncExternalStore with a server snapshot of the default locale, which
 * is what keeps the server HTML and the first client render identical.
 */

let mirrored: Locale | null = null;
const listeners = new Set<() => void>();
const LOCALE_CHANGED_EVENT = "w2v:locale-changed";

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab switching language writes the same key.
  const onStorage = (event: StorageEvent | Event) => {
    if (
      event.type === LOCALE_CHANGED_EVENT ||
      (event as StorageEvent).key === LOCALE_STORAGE_KEY
    ) {
      mirrored = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCALE_CHANGED_EVENT, onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCALE_CHANGED_EVENT, onStorage);
  };
}

function getSnapshot(): Locale {
  if (mirrored === null) {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      // Blocked storage only costs us the pre-hydration hint.
    }
    mirrored = isLocale(stored) ? stored : DEFAULT_LOCALE;
  }
  return mirrored;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

/** Mirrors the language locally so the next first paint uses it. */
export function rememberLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Same as above — the mirror is an optimisation, not the source.
  }
  mirrored = locale;
  for (const listener of listeners) listener();
  window.dispatchEvent(new Event(LOCALE_CHANGED_EVENT));
}

/** The language the UI should render in right now. */
export function useLocale(): Locale {
  const { user } = useCurrentUser();
  const stored = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  // The profile is authoritative once it has loaded.
  const locale = isLocale(user?.locale) ? user.locale : stored;

  useEffect(() => {
    if (isLocale(user?.locale) && user.locale !== stored) {
      rememberLocale(user.locale);
    }
  }, [user?.locale, stored]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return locale;
}

export type Translate = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

/**
 * Returns `t`, which looks a string up in the active language.
 * `t("Hi {name}", { name })` fills placeholders.
 */
export function useT(): Translate {
  const locale = useLocale();

  return useCallback(
    (key, vars) => {
      const text = dictionaries[locale]?.[key] ?? key;
      if (!vars) return text;
      return text.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      );
    },
    [locale],
  );
}
