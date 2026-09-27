/**
 * SVG stand-ins for Discover imagery: the hero photo, the idea-card
 * thumbnails and a corner leaf watermark. Swap for <Image> photos later
 * without touching layout code (same pattern as exchange-art/diy-art).
 */

type ArtProps = {
  className?: string;
};

/** Hero photo: glass-jar planter with a green plant on a windowsill. */
export function DiscoverHeroArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 560 360"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="560" height="360" fill="#eaf2ea" />
      {/* Window backdrop */}
      <rect x="250" y="0" width="310" height="360" fill="#f4f8f2" />
      <rect x="290" y="30" width="230" height="220" rx="6" fill="#dcead8" />
      <rect x="400" y="30" width="10" height="220" fill="#f4f8f2" />
      <rect x="290" y="135" width="230" height="10" fill="#f4f8f2" />
      {/* Foliage blobs in the window */}
      <circle cx="340" cy="90" r="46" fill="#a9cf9f" opacity="0.8" />
      <circle cx="470" cy="70" r="56" fill="#8fbe85" opacity="0.75" />
      <circle cx="440" cy="180" r="40" fill="#b7d8ad" opacity="0.7" />
      {/* Wooden sill */}
      <rect x="0" y="300" width="560" height="60" fill="#c9a06a" />
      <rect x="0" y="300" width="560" height="10" fill="#b98d55" />
      {/* Jar planter */}
      <rect x="185" y="150" width="190" height="160" rx="18" fill="#d9e6d4" />
      <rect x="185" y="150" width="190" height="34" rx="14" fill="#c8dcc2" />
      <rect x="185" y="236" width="190" height="52" fill="#c2a878" />
      <g stroke="#a8895c" strokeWidth="7">
        <path d="M185 248h190M185 262h190M185 276h190" />
      </g>
      <rect
        x="185"
        y="270"
        width="190"
        height="40"
        fill="#d8cfc0"
        opacity="0.9"
      />
      <circle cx="215" cy="285" r="9" fill="#b8ab96" />
      <circle cx="240" cy="295" r="7" fill="#cfc4b1" />
      <circle cx="335" cy="288" r="8" fill="#b8ab96" />
      {/* Plant stem + leaves */}
      <path
        d="M280 150c0-40 4-66 12-92"
        stroke="#3f7a3c"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M289 96c26-10 44-32 48-58-30 2-50 20-58 44Z" fill="#4f9a4a" />
      <path d="M286 116c-26-4-48-20-58-44 30-4 52 8 64 30Z" fill="#67ad5d" />
      <path d="M291 62c18-8 30-24 34-44-22 2-36 14-42 32Z" fill="#67ad5d" />
    </svg>
  );
}

/** Idea thumbnail: hanging planter made from plastic bottles. */
export function IdeaHangingPlanterArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#f0ede4" />
      <rect x="0" y="0" width="96" height="14" fill="#e3ddcf" />
      <path
        d="M34 14v10M62 14v10M34 24l14 10 14-10"
        stroke="#b8a67e"
        strokeWidth="2.5"
        fill="none"
      />
      <rect x="30" y="34" width="16" height="26" rx="5" fill="#7fb8d4" />
      <rect x="50" y="42" width="16" height="26" rx="5" fill="#9ccbe0" />
      <path
        d="M38 34c4-10 12-14 20-12"
        stroke="#4f8a4a"
        strokeWidth="2.5"
        fill="none"
      />
      <ellipse cx="36" cy="30" rx="8" ry="5" fill="#5da656" />
      <ellipse cx="58" cy="38" rx="9" ry="5" fill="#71b766" />
    </svg>
  );
}

/** Idea thumbnail: glass-jar candle with a flame. */
export function IdeaCandleJarsArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e8dfd2" />
      <rect x="0" y="74" width="96" height="22" fill="#b98d55" />
      <rect x="30" y="40" width="36" height="36" rx="6" fill="#e9e2d2" />
      <rect x="30" y="58" width="36" height="18" rx="4" fill="#e5cfa3" />
      <rect x="28" y="36" width="40" height="8" rx="3" fill="#c9bda4" />
      <path
        d="M48 26c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z"
        fill="#f0a93c"
      />
      <path
        d="M48 31c2 3 3 4.5 3 6.5a3 3 0 0 1-6 0c0-2 1-3.5 3-6.5Z"
        fill="#f6d26a"
      />
      <circle cx="74" cy="30" r="9" fill="#e8b64f" opacity="0.35" />
    </svg>
  );
}

/** Idea thumbnail: cardboard desk organizer with supplies. */
export function IdeaDeskOrganizerArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#efe9df" />
      <rect x="0" y="72" width="96" height="24" fill="#c9a06a" />
      <rect x="18" y="40" width="60" height="32" rx="4" fill="#c99e63" />
      <rect x="18" y="40" width="60" height="6" rx="3" fill="#b9894f" />
      <rect x="26" y="28" width="14" height="16" rx="2" fill="#b9894f" />
      <rect x="44" y="24" width="14" height="20" rx="2" fill="#a87a42" />
      <rect x="62" y="30" width="12" height="14" rx="2" fill="#b9894f" />
      <path
        d="M30 28v-8M33 28v-6M48 24v-8M51 24v-5"
        stroke="#5b6770"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M64 30h8M64 33h6"
        stroke="#e5e0d6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Idea thumbnail: jar string lights glowing at dusk. */
export function IdeaStringLightsArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#3d4a54" />
      <path
        d="M0 22c16 8 30 8 48 0s34-8 48 0"
        stroke="#2b353d"
        strokeWidth="3"
        fill="none"
      />
      <path d="M30 26v12M66 26v14" stroke="#2b353d" strokeWidth="2.5" />
      <rect x="22" y="38" width="16" height="18" rx="4" fill="#e9e2d2" />
      <rect x="58" y="40" width="16" height="18" rx="4" fill="#e9e2d2" />
      <circle cx="30" cy="47" r="4.5" fill="#f6d26a" />
      <circle cx="66" cy="49" r="4.5" fill="#f6d26a" />
      <circle cx="30" cy="47" r="9" fill="#f6d26a" opacity="0.25" />
      <circle cx="66" cy="49" r="9" fill="#f6d26a" opacity="0.25" />
      <circle cx="14" cy="12" r="1.6" fill="#f6d26a" opacity="0.7" />
      <circle cx="84" cy="10" r="1.6" fill="#f6d26a" opacity="0.7" />
      <circle cx="50" cy="8" r="1.3" fill="#f6d26a" opacity="0.5" />
    </svg>
  );
}

/** Idea thumbnail: kitchen herbs growing in reused cans. */
export function IdeaHerbGardenArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#eef2ea" />
      <rect x="0" y="72" width="96" height="24" fill="#d8cbae" />
      <rect x="18" y="48" width="22" height="24" rx="3" fill="#a9b6ac" />
      <rect x="46" y="48" width="22" height="24" rx="3" fill="#93a298" />
      <rect x="18" y="44" width="22" height="6" rx="2" fill="#8fa08f" />
      <rect x="46" y="44" width="22" height="6" rx="2" fill="#8fa08f" />
      <path
        d="M29 44c0-12-6-18-12-20M29 44c0-10 6-16 12-18M57 44c0-12-6-18-12-20M57 44c0-10 6-16 12-18"
        stroke="#4f8a4a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="17" cy="24" rx="6" ry="4" fill="#5da656" />
      <ellipse cx="42" cy="26" rx="6" ry="4" fill="#71b766" />
      <ellipse cx="45" cy="24" rx="6" ry="4" fill="#5da656" />
      <ellipse cx="70" cy="26" rx="6" ry="4" fill="#71b766" />
    </svg>
  );
}

/** Corner leaf watermark used on soft green rail cards. */
export function DiscoverLeafWatermarkArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M20 78C24 50 44 26 78 18c4 34-16 58-44 62"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse
        cx="66"
        cy="52"
        rx="10"
        ry="6"
        transform="rotate(-30 66 52)"
        fill="currentColor"
      />
      <ellipse
        cx="44"
        cy="66"
        rx="9"
        ry="5.5"
        transform="rotate(-20 44 66)"
        fill="currentColor"
      />
    </svg>
  );
}

/** Art for every idea id (plus shared keys). One map for all idea cards. */
export const IDEA_ART: Record<string, (props: ArtProps) => React.ReactNode> = {
  "hanging-planter": IdeaHangingPlanterArt,
  "candle-jars": IdeaCandleJarsArt,
  "desk-organizer": IdeaDeskOrganizerArt,
  "string-lights": IdeaStringLightsArt,
  "herb-garden": IdeaHerbGardenArt,
};

/** Renders the art for an idea id, with a neutral fallback. */
export function IdeaArt({ artKey, className }: ArtProps & { artKey: string }) {
  const Art = IDEA_ART[artKey] ?? IdeaCandleJarsArt;
  return <Art className={className} />;
}
