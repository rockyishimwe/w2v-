/**
 * SVG stand-ins for the DIY guide imagery: five material tiles and the
 * similar-idea thumbnails. Swap for <Image> photos later without touching
 * layout code.
 */

type ArtProps = {
  className?: string;
};

export function MaterialJarArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M34 26h28v6c3 2 5 5 5 9v27a8 8 0 0 1-8 8H37a8 8 0 0 1-8-8V41c0-4 2-7 5-9v-6Z"
        stroke="#2f7a45"
        strokeWidth="2.5"
      />
      <rect
        x="32"
        y="20"
        width="32"
        height="7"
        rx="2.5"
        stroke="#2f7a45"
        strokeWidth="2.5"
      />
      <rect x="36" y="46" width="24" height="24" rx="4" fill="#e7f3ea" />
    </svg>
  );
}

export function MaterialSoilArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <path d="M22 64c0-14 12-24 26-24s26 10 26 24H22Z" fill="#6b4a2f" />
      <path
        d="M30 56c3-7 9-11 18-11"
        stroke="#8a6142"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="40" cy="60" r="2" fill="#8a6142" />
      <circle cx="56" cy="58" r="2" fill="#553a24" />
      <path
        d="M18 66h60"
        stroke="#4a3421"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MaterialStonesArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <ellipse cx="38" cy="58" rx="14" ry="10" fill="#b9b3a8" />
      <ellipse cx="60" cy="60" rx="12" ry="9" fill="#cfc9bd" />
      <ellipse cx="50" cy="44" rx="11" ry="8" fill="#a49d90" />
      <ellipse cx="34" cy="44" rx="8" ry="6" fill="#c4bdb0" />
      <ellipse cx="47" cy="54" rx="2.5" ry="1.6" fill="#8f887b" opacity="0.6" />
    </svg>
  );
}

export function MaterialPlantArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <path d="M38 54h20l-3 22H41l-3-22Z" fill="#c96f4a" />
      <rect x="35" y="50" width="26" height="6" rx="2" fill="#d97f58" />
      <path
        d="M48 50c0-9 0-15 0-20M48 36c-5-2-8-6-9-11 6 1 9 5 9 11Zm0-6c4-3 6-7 6-12-5 1-7 5-6 12Z"
        stroke="#3d7a38"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="39" cy="30" r="3" fill="#4c9a44" />
      <circle cx="55" cy="24" r="3" fill="#6bb45f" />
    </svg>
  );
}

export function MaterialTwineArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <circle cx="48" cy="48" r="18" fill="#c9a26e" />
      <circle cx="48" cy="48" r="11" fill="#b0854f" />
      <circle cx="48" cy="48" r="5" fill="#96683a" />
      <path
        d="M30 46c6-3 30-3 36 0M30 52c6 3 30 3 36 0"
        stroke="#a87f4c"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M64 52c6 2 10 6 11 11"
        stroke="#c9a26e"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function IdeaLanternArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#efe7d8" />
      <path
        d="M32 22h32v44a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6V22Z"
        fill="#d8c9a8"
      />
      <rect x="28" y="16" width="40" height="8" rx="3" fill="#b49a68" />
      <circle cx="48" cy="52" r="9" fill="#f2b64b" />
      <path
        d="M48 47v10M44 50l8 4"
        stroke="#fff3d6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M38 78h20"
        stroke="#8f7b52"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IdeaHangingLightsArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#20301f" />
      <path
        d="M0 20c20 8 76 8 96 0"
        stroke="#3d5a38"
        strokeWidth="3"
        fill="none"
      />
      <path d="M30 24v14M48 26v18M66 24v14" stroke="#3d5a38" strokeWidth="2" />
      <circle cx="30" cy="42" r="6" fill="#f2c94c" opacity="0.9" />
      <circle cx="48" cy="48" r="7" fill="#f2c94c" />
      <circle cx="66" cy="42" r="6" fill="#f2c94c" opacity="0.9" />
      <circle cx="30" cy="42" r="10" fill="#f2c94c" opacity="0.18" />
      <circle cx="48" cy="48" r="12" fill="#f2c94c" opacity="0.2" />
      <circle cx="66" cy="42" r="10" fill="#f2c94c" opacity="0.18" />
    </svg>
  );
}

export function IdeaHerbPlanterArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#e2ecdf" />
      <rect x="18" y="52" width="60" height="24" rx="5" fill="#b0713f" />
      <rect x="18" y="52" width="60" height="7" rx="3" fill="#8f5730" />
      {[30, 48, 66].map((x) => (
        <g key={x}>
          <path
            d={`M${x} 52c0-8 0-13 0-18M${x} 40c-4-2-6-5-7-9 4 0 7 3 7 9Zm0-4c3-3 5-6 5-10-4 1-6 4-5 10Z`}
            stroke="#3d7a38"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ))}
    </svg>
  );
}

export function IdeaStorageJarArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#e4ecea" />
      <rect x="20" y="34" width="24" height="42" rx="6" fill="#bcd8d2" />
      <rect x="20" y="28" width="24" height="8" rx="3" fill="#8fa6a0" />
      <rect x="50" y="40" width="24" height="36" rx="6" fill="#cfe4df" />
      <rect x="50" y="34" width="24" height="8" rx="3" fill="#9db3ad" />
      <rect
        x="26"
        y="48"
        width="12"
        height="18"
        rx="2"
        fill="#e8b64c"
        opacity="0.7"
      />
      <rect
        x="56"
        y="54"
        width="12"
        height="14"
        rx="2"
        fill="#c96f4a"
        opacity="0.6"
      />
    </svg>
  );
}
