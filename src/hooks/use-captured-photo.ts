"use client";

import { useEffect, useState } from "react";
import { loadPhoto } from "@/lib/photo";

/**
 * Reads the session capture after mount (sessionStorage is not available
 * during SSR). Centralizes the requestAnimationFrame-based hydration
 * pattern previously duplicated in the capture review and result cards.
 */
export function useCapturedPhoto(): string | null {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPhoto(loadPhoto());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return photo;
}
