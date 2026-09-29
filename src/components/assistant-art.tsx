/**
 * SVG stand-ins for Waste Assistant idea-card imagery. Swap for <Image>
 * photos later without touching layout code (same pattern as
 * discover-art/diy-art).
 */

type ArtProps = {
  className?: string;
};

import { IdeaCandleJarsArt, IdeaDeskOrganizerArt } from "./discover-art";

/** Idea thumbnail: wall-mounted bottle herb garden. */
export function VerticalHerbGardenArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#d9c9b2" />
      <rect x="0" y="0" width="96" height="96" fill="#cbb69a" />
      <rect x="8" y="10" width="80" height="6" rx="2" fill="#a8895c" />
      {[26, 46, 66].map((y, row) => (
        <g key={y}>
          <rect
            x="14"
            y={y}
            width="30"
            height="14"
            rx="4"
            fill="#7fb8d4"
            opacity="0.9"
          />
          <rect
            x="52"
            y={y}
            width="30"
            height="14"
            rx="4"
            fill="#9ccbe0"
            opacity="0.9"
          />
          <ellipse
            cx="29"
            cy={y - 3}
            rx="9"
            ry="5"
            fill={row % 2 ? "#4f8a4a" : "#5da656"}
          />
          <ellipse
            cx="67"
            cy={y - 3}
            rx="9"
            ry="5"
            fill={row % 2 ? "#71b766" : "#4f8a4a"}
          />
        </g>
      ))}
      <circle cx="82" cy="16" r="6" fill="#e8b64f" opacity="0.4" />
    </svg>
  );
}

/** Idea thumbnail: bottle bird feeder hanging from a branch. */
export function BirdFeederArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e2ecd8" />
      <path
        d="M0 14c20 8 50 8 96-4v10C52 30 22 28 0 22Z"
        fill="#5d8f4f"
        opacity="0.7"
      />
      <rect x="46" y="20" width="3" height="14" fill="#8f7b52" />
      <rect x="34" y="34" width="28" height="40" rx="9" fill="#9ccbe0" />
      <rect x="34" y="46" width="28" height="5" fill="#7fb8d4" />
      <path
        d="M30 52h36"
        stroke="#8f6238"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="27" cy="50" r="5" fill="#d05a4e" />
      <circle cx="26" cy="48" r="1.6" fill="#2f2f2f" />
      <path d="M22 50l-4 1.5 4 1.5Z" fill="#e8b64f" />
      <ellipse cx="70" cy="80" rx="18" ry="8" fill="#a9cf9f" opacity="0.8" />
    </svg>
  );
}

/** Idea thumbnail: desk pen holder made from a decorated bottle. */
export function PenHolderArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#efe6d8" />
      <rect x="0" y="70" width="96" height="26" fill="#c9a06a" />
      <rect x="34" y="40" width="28" height="32" rx="6" fill="#7fb8d4" />
      <circle cx="42" cy="52" r="2" fill="#eaf5ea" />
      <circle cx="54" cy="60" r="2" fill="#eaf5ea" />
      <circle cx="48" cy="66" r="1.6" fill="#eaf5ea" />
      <path d="M38 40v-4h20v4" stroke="#5b8aa8" strokeWidth="2" fill="none" />
      <path
        d="M42 36V22M48 36V18M54 36V24"
        stroke="#5b6770"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="42" cy="20" r="2.5" fill="#d05a4e" />
      <circle cx="48" cy="16" r="2.5" fill="#e8b64f" />
      <circle cx="54" cy="22" r="2.5" fill="#4f8a4a" />
      <rect x="62" y="58" width="18" height="12" rx="2" fill="#e8e3d6" />
      <ellipse cx="26" cy="72" rx="8" ry="3" fill="#b98d55" />
    </svg>
  );
}

/* ── Fallbacks for the other material replies ─────────────────── */

/** Cardboard storage/pet-house style tile. */
export function CardboxBoxArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#efe9df" />
      <rect x="0" y="72" width="96" height="24" fill="#c9a06a" />
      <rect x="22" y="36" width="52" height="36" rx="4" fill="#c99e63" />
      <rect x="22" y="36" width="52" height="8" rx="3" fill="#b9894f" />
      <path d="M48 36v36" stroke="#a87a42" strokeWidth="2" />
      <circle cx="40" cy="56" r="2" fill="#8f6238" />
      <circle cx="56" cy="56" r="2" fill="#8f6238" />
    </svg>
  );
}

/** Compost/food-scraps tile. */
export function CompostBinArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e7efdc" />
      <rect x="0" y="74" width="96" height="22" fill="#8f6238" />
      <rect x="26" y="38" width="44" height="34" rx="6" fill="#6b4a2f" />
      <rect x="26" y="32" width="44" height="8" rx="3" fill="#5d3f26" />
      <path
        d="M36 32c0-8 5-12 12-12s12 4 12 12"
        stroke="#5d3f26"
        strokeWidth="3"
        fill="none"
      />
      <ellipse cx="48" cy="52" rx="14" ry="8" fill="#4c7a3d" />
      <ellipse cx="42" cy="50" rx="5" ry="3" fill="#71b766" />
      <ellipse cx="54" cy="54" rx="5" ry="3" fill="#a3c585" />
    </svg>
  );
}

/** Glass jar tile. */
export function JarPlanterArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#eaf2ea" />
      <rect x="0" y="74" width="96" height="22" fill="#c9a06a" />
      <rect x="30" y="44" width="36" height="32" rx="7" fill="#d9e6d4" />
      <rect x="28" y="40" width="40" height="7" rx="3" fill="#8fa6a0" />
      <path
        d="M48 44c0-12-4-18-10-22"
        stroke="#3f7a3c"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="38" cy="22" rx="8" ry="5" fill="#5da656" />
      <ellipse cx="58" cy="30" rx="7" ry="4.5" fill="#71b766" />
    </svg>
  );
}

/** Textile/tote-bag tile. */
export function ToteBagArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#efe6dc" />
      <rect x="0" y="74" width="96" height="22" fill="#d8cbae" />
      <path
        d="M34 30c0-8 6-14 14-14s14 6 14 14"
        stroke="#a8895c"
        strokeWidth="3"
        fill="none"
      />
      <rect x="26" y="30" width="44" height="44" rx="6" fill="#c9a06a" />
      <rect x="26" y="30" width="44" height="8" rx="4" fill="#b98d55" />
      <path
        d="M40 52h16M40 60h10"
        stroke="#8f6238"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Art for every assistant idea id. One map for all idea cards. */
export const ASSISTANT_IDEA_ART: Record<
  string,
  (props: ArtProps) => React.ReactNode
> = {
  "vertical-herb-garden": VerticalHerbGardenArt,
  "bird-feeder": BirdFeederArt,
  "pen-holder": PenHolderArt,
  "desk-organizer": IdeaDeskOrganizerArt,
  "storage-boxes": CardboxBoxArt,
  "cat-house": CardboxBoxArt,
  "compost-bin": CompostBinArt,
  "broth-stock": CompostBinArt,
  "planter-food": CompostBinArt,
  "jar-planter": JarPlanterArt,
  "candle-jars": IdeaCandleJarsArt,
  "pantry-storage": JarPlanterArt,
  "tote-bag": ToteBagArt,
  "cleaning-rags": ToteBagArt,
  "quilt-patches": ToteBagArt,
};

/** Renders the art for an assistant idea, with a neutral fallback. */
export function AssistantIdeaArt({
  artKey,
  className,
}: ArtProps & { artKey: string }) {
  const Art = ASSISTANT_IDEA_ART[artKey] ?? VerticalHerbGardenArt;
  return <Art className={className} />;
}
