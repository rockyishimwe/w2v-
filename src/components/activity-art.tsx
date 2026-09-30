/**
 * SVG stand-ins for the My Activity feed photos (matches dashboard-art
 * and exchange-art patterns). Swap for <Image> photos later without
 * touching layout code.
 */

type ArtProps = {
  className?: string;
};

/** Green recycling crates at a drop-off point. */
export function BottleCratesArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#cfd8cc" />
      <rect y="72" width="96" height="24" fill="#9aa79b" />
      {[10, 36, 62].map((x) => (
        <g key={x}>
          <rect x={x} y={30} width={24} height={44} rx={3} fill="#1f7a33" />
          <rect x={x} y={26} width={24} height={7} rx={2} fill="#2f9443" />
          <rect
            x={x + 3}
            y={38}
            width={18}
            height={4}
            rx={1.5}
            fill="#145c36"
          />
          <rect
            x={x + 3}
            y={48}
            width={18}
            height={4}
            rx={1.5}
            fill="#145c36"
          />
          <rect
            x={x + 3}
            y={58}
            width={18}
            height={4}
            rx={1.5}
            fill="#145c36"
          />
        </g>
      ))}
      <rect
        x="14"
        y="18"
        width="12"
        height="30"
        rx="5"
        fill="#bfe3f2"
        opacity="0.9"
      />
      <rect
        x="40"
        y="14"
        width="12"
        height="34"
        rx="5"
        fill="#bfe3f2"
        opacity="0.85"
      />
      <rect
        x="66"
        y="20"
        width="12"
        height="28"
        rx="5"
        fill="#bfe3f2"
        opacity="0.9"
      />
    </svg>
  );
}

/** Glass storage jar on a wooden surface. */
export function GlassJarArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e3ded4" />
      <rect y="70" width="96" height="26" fill="#a8763e" />
      <path d="M0 70h96v6H0Z" fill="#8f5f30" />
      <rect x="30" y="20" width="36" height="8" rx="3" fill="#5d5347" />
      <path
        d="M32 28h32v38a7 7 0 0 1-7 7H39a7 7 0 0 1-7-7V28Z"
        fill="#cfd8d4"
        opacity="0.75"
      />
      <path d="M32 28h32v10H32Z" fill="#9fb0aa" opacity="0.6" />
      <rect
        x="38"
        y="42"
        width="5"
        height="24"
        rx="2.5"
        fill="#ffffff"
        opacity="0.5"
      />
      <rect
        x="56"
        y="46"
        width="3"
        height="16"
        rx="1.5"
        fill="#ffffff"
        opacity="0.35"
      />
    </svg>
  );
}

/** Green canvas backpack. */
export function BackpackArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e8e4da" />
      <rect y="76" width="96" height="20" fill="#c4bdb0" />
      <path
        d="M30 34c0-10 8-18 18-18s18 8 18 18v34a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8V34Z"
        fill="#5d7052"
      />
      <path d="M30 40h36v14H30Z" fill="#4a5d3f" />
      <path
        d="M40 34c0-5 3-9 8-9s8 4 8 9"
        stroke="#3d4f34"
        strokeWidth="3.5"
        fill="none"
      />
      <rect x="40" y="54" width="16" height="12" rx="3" fill="#7d8f6d" />
      <rect x="46" y="58" width="4" height="5" rx="1.5" fill="#2f3d27" />
      <rect x="26" y="44" width="6" height="22" rx="3" fill="#4a5d3f" />
      <rect x="64" y="44" width="6" height="22" rx="3" fill="#4a5d3f" />
    </svg>
  );
}

/** Cardboard boxes ready for scanning. */
export function CardboardBoxesArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e5dccd" />
      <rect y="74" width="96" height="22" fill="#b3a68f" />
      <rect x="18" y="26" width="34" height="26" rx="2" fill="#c99e63" />
      <rect x="18" y="38" width="34" height="4" fill="#a87840" />
      <rect x="46" y="38" width="34" height="38" rx="2" fill="#b9894f" />
      <rect x="46" y="52" width="34" height="4" fill="#96683a" />
      <path
        d="M14 56h34v24a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V56Z"
        fill="#d3a76e"
      />
      <path d="M14 56h34v7H14Z" fill="#b98b52" />
      <path d="M14 56l-8-8 12-4 7 8Z" fill="#c89b62" />
    </svg>
  );
}

/** Bowl of compostable food scraps. */
export function FoodScrapsBowlArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e9e4d6" />
      <rect y="72" width="96" height="24" fill="#b8ad9c" />
      <path d="M18 46h60c0 16-12 26-30 26S18 62 18 46Z" fill="#d9d2c2" />
      <ellipse cx="48" cy="46" rx="30" ry="9" fill="#efe9db" />
      <circle cx="34" cy="43" r="6" fill="#7fb069" />
      <circle cx="48" cy="40" r="7" fill="#5d8f4f" />
      <circle cx="62" cy="44" r="5" fill="#a3c585" />
      <path d="M40 36c2-6 8-9 14-8-2 6-7 9-14 8Z" fill="#4c7a3d" />
      <circle cx="56" cy="36" r="3.5" fill="#d9a13b" />
      <circle cx="30" cy="47" r="3" fill="#d05a4e" />
    </svg>
  );
}

/** Art for every activity feed artKey, with a neutral fallback. */
export const ACTIVITY_ART: Record<
  string,
  (props: ArtProps) => React.ReactNode
> = {
  "bottle-crates": BottleCratesArt,
  "glass-jar": GlassJarArt,
  backpack: BackpackArt,
  "cardboard-boxes": CardboardBoxesArt,
  "food-scraps-bowl": FoodScrapsBowlArt,
};

/** Renders the art for an activity artKey, with a neutral fallback. */
export function ActivityArt({
  artKey,
  className,
}: ArtProps & { artKey: string }) {
  const Art = ACTIVITY_ART[artKey] ?? CardboardBoxesArt;
  return <Art className={className} />;
}
