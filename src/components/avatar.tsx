"use client";

import { useState } from "react";
import { AvatarArt } from "./dashboard-art";
import { useCurrentUser } from "@/hooks/use-current-user";

/**
 * The signed-in user's profile photo.
 *
 * Renders the uploaded image when there is one and falls back to the
 * generated art otherwise — including when the file 404s (e.g. the
 * uploads directory was cleared), so a missing photo never shows a
 * broken-image icon. `src` overrides the session, which the Settings
 * page uses to preview a pick before it is uploaded.
 */
export function Avatar({
  className = "",
  src,
  alt = "",
}: {
  className?: string;
  /** Explicit image to show instead of the session's photo. */
  src?: string | null;
  alt?: string;
}) {
  const { user } = useCurrentUser();
  const [failed, setFailed] = useState(false);
  const path = src !== undefined ? src : (user?.avatarPath ?? null);

  if (!path || failed) {
    return <AvatarArt className={className} />;
  }

  return (
    // Uploaded photos are served from our own /api/uploads route; next/image
    // would add a resizing hop for no gain at avatar sizes.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={path}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
