/**
 * Stylized SVG stand-ins for the photos used in the dashboard design.
 * Each is a small flat illustration on a tinted tile so the layout reads
 * like the mock; swap for <Image> photos later without touching layout code.
 */

type ArtProps = {
  className?: string;
};

export function FoodScrapArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#e5eedd" />
      <path d="M24 50h48c0 15-10 24-24 24S24 65 24 50Z" fill="#4a5d3a" />
      <ellipse cx="48" cy="50" rx="24" ry="8" fill="#63804a" />
      <circle cx="38" cy="46" r="5" fill="#8fbf5f" />
      <circle cx="50" cy="43" r="6" fill="#c9dd8f" />
      <circle cx="61" cy="47" r="4.5" fill="#7ba84f" />
      <path d="M44 38c2-6 8-9 14-8-2 6-7 9-14 8Z" fill="#5d8f3f" />
      <path d="M42 40c-5-2-7-6-7-10 5 1 8 5 7 10Z" fill="#a3c585" />
    </svg>
  );
}

export function CardboardArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#ecdfc8" />
      <path d="M28 42 16 32l16-5 8 11Z" fill="#b98b52" />
      <path d="M68 42l12-10-16-5-8 11Z" fill="#d3a76e" />
      <path d="M28 42h40v28a4 4 0 0 1-4 4H32a4 4 0 0 1-4-4Z" fill="#c89b62" />
      <path d="M28 42h40v7H28Z" fill="#a87f4c" />
      <rect x="44" y="49" width="8" height="25" fill="#e8d5a8" />
    </svg>
  );
}

export function GlassJarsArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#e4ecea" />
      <rect x="14" y="68" width="68" height="5" rx="2.5" fill="#c9a26e" />
      <rect x="22" y="34" width="17" height="34" rx="4" fill="#bcd8d2" />
      <rect x="22" y="29" width="17" height="7" rx="2.5" fill="#8fa6a0" />
      <rect x="44" y="42" width="15" height="26" rx="4" fill="#cfe4df" />
      <rect x="44" y="37" width="15" height="7" rx="2.5" fill="#9db3ad" />
      <rect x="63" y="38" width="15" height="30" rx="4" fill="#b3d0ca" />
      <rect x="63" y="33" width="15" height="7" rx="2.5" fill="#8fa6a0" />
      <rect
        x="26"
        y="40"
        width="3"
        height="22"
        rx="1.5"
        fill="#ffffff"
        opacity="0.55"
      />
      <rect
        x="67"
        y="44"
        width="3"
        height="18"
        rx="1.5"
        fill="#ffffff"
        opacity="0.55"
      />
    </svg>
  );
}

export function SaladBowlArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#e7efdc" />
      <path d="M22 48h52c0 15-11 24-26 24S22 63 22 48Z" fill="#e8e3d6" />
      <circle cx="38" cy="45" r="8" fill="#7fb069" />
      <circle cx="54" cy="43" r="9" fill="#5d8f4f" />
      <circle cx="47" cy="38" r="6" fill="#a3c585" />
      <circle cx="63" cy="47" r="4.5" fill="#d05a4e" />
      <circle cx="34" cy="50" r="3.5" fill="#d05a4e" />
      <path d="M46 32c2-5 7-7 12-6-2 5-6 7-12 6Z" fill="#4c7a3d" />
    </svg>
  );
}

export function BottlesPlantersArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#e2ecdf" />
      <path
        d="M30 46c0-4 2-5 2-9h10c0 4 2 5 2 9v18a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4Z"
        fill="#9fc4b0"
      />
      <path d="M38 38c-3-8-1-15 4-20 2 7 1 14-4 20Z" fill="#4c7a3d" />
      <path d="M36 40c-5-1-8-5-9-10 6 0 9 4 9 10Z" fill="#6ba05a" />
      <path
        d="M54 42c0-4 2-5 2-9h10c0 4 2 5 2 9v22a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4Z"
        fill="#b7d6c4"
      />
      <path d="M62 34c3-7 2-14-2-19-3 6-3 14 2 19Z" fill="#3d6b33" />
      <path d="M64 36c5-2 7-6 7-11-6 1-8 5-7 11Z" fill="#7fb069" />
    </svg>
  );
}

export function StackedBoxesArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#e9e0cf" />
      <rect x="30" y="24" width="28" height="22" rx="2" fill="#c99e63" />
      <rect x="30" y="33" width="28" height="3" fill="#a87840" />
      <rect x="20" y="50" width="30" height="26" rx="2" fill="#b9894f" />
      <rect x="20" y="61" width="30" height="3" fill="#96683a" />
      <rect x="54" y="44" width="26" height="32" rx="2" fill="#d3a76e" />
      <rect x="54" y="57" width="26" height="3" fill="#a87840" />
    </svg>
  );
}

export function FlowerPotsArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#e6eede" />
      <path d="M26 54h18l-2.5 18h-13Z" fill="#c96f4a" />
      <rect x="24" y="50" width="22" height="6" rx="2" fill="#d97f58" />
      <path
        d="M35 50c-1-10 2-17 8-22M35 50c-5-4-7-9-7-15M35 50c4-6 9-8 14-8"
        stroke="#4c7a3d"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="43" cy="28" r="4" fill="#d05a4e" />
      <circle cx="28" cy="35" r="3.5" fill="#7fb069" />
      <circle cx="49" cy="42" r="3" fill="#c9dd8f" />
      <path d="M54 58h16l-2.5 16h-11Z" fill="#b85c3e" />
      <rect x="52" y="54" width="20" height="6" rx="2" fill="#c96f4a" />
      <path
        d="M62 54c0-8 3-13 8-16M62 54c-4-3-5-7-5-12"
        stroke="#5d8f3f"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="70" cy="38" r="3.5" fill="#d05a4e" />
      <circle cx="57" cy="42" r="3" fill="#a3c585" />
    </svg>
  );
}

export function QuoteHillsArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 320 128"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="128" fill="#d7e7cb" />
      <path
        d="M0 74c42-28 92-32 142-14 42 15 96 10 178-22v90H0Z"
        fill="#5d8f4f"
      />
      <ellipse
        cx="150"
        cy="62"
        rx="120"
        ry="10"
        fill="#ffffff"
        opacity="0.18"
      />
      <path
        d="M0 100c60-20 132-16 202 2 42 10 92 7 118-5v31H0Z"
        fill="#3d6b33"
      />
    </svg>
  );
}

export function AvatarArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="#e8ded2" />
      <path
        d="M27 50c-3-18 8-29 21-29s24 11 21 29l-3.5 14h-35Z"
        fill="#2e2620"
      />
      <circle cx="48" cy="47" r="13.5" fill="#c68863" />
      <path d="M42 61h12v8H42Z" fill="#b57a56" />
      <path d="M28 96c2-15 9-21 20-21s18 6 20 21Z" fill="#35414b" />
      <circle cx="43" cy="46" r="1.6" fill="#2e2620" />
      <circle cx="53" cy="46" r="1.6" fill="#2e2620" />
      <path
        d="M44 53c2.5 2 5.5 2 8 0"
        stroke="#8f5b3f"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
