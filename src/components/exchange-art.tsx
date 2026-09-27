/**
 * SVG stand-ins for exchange listing photos (matches dashboard-art pattern).
 * Swap for <Image> photos later without touching layout code.
 */

type ArtProps = {
  className?: string;
};

export function JarsPhotoArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#caa06a" />
      <rect y="70" width="96" height="26" fill="#8f6238" />
      {[14, 34, 54, 72].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={30 - i * 2}
            width={16}
            height={40 + i * 2}
            rx={3}
            fill="#d8c9a8"
            opacity="0.9"
          />
          <rect
            x={x + 2}
            y={34 - i * 2}
            width={12}
            height={12}
            rx={1}
            fill="#b98d3e"
            opacity="0.7"
          />
          <rect
            x={x}
            y={26 - i * 2}
            width={16}
            height={5}
            rx={2}
            fill={i % 2 ? "#8fa6a0" : "#b0713f"}
          />
        </g>
      ))}
    </svg>
  );
}

export function CardboardStackArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#b9b3a8" />
      <rect y="78" width="96" height="18" fill="#8f887b" />
      {[16, 34, 52, 70].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={70 - i * 15}
          width={22}
          height={13}
          rx={1.5}
          fill={i % 2 ? "#c99e63" : "#b9894f"}
        />
      ))}
    </svg>
  );
}

export function PlasticContainersArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e4ecea" />
      <rect x="10" y="40" width="76" height="6" rx="2" fill="#b9b3a8" />
      {[14, 34, 54].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={48}
            width={16}
            height={18}
            rx={3}
            fill={["#d05a4e", "#4c9a44", "#4a7fb5"][i]}
            opacity="0.85"
          />
          <rect
            x={x}
            y={44}
            width={16}
            height={5}
            rx={2}
            fill="#2f3a44"
            opacity="0.7"
          />
        </g>
      ))}
      <rect x="30" y="20" width="36" height="16" rx="3" fill="#cfe4df" />
    </svg>
  );
}

export function WoodenChairArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e8ded2" />
      <rect x="30" y="18" width="8" height="40" rx="2" fill="#8f5730" />
      <rect x="30" y="50" width="40" height="7" rx="2" fill="#b0713f" />
      <rect x="66" y="18" width="7" height="39" rx="2" fill="#8f5730" />
      <rect x="34" y="57" width="6" height="22" rx="2" fill="#8f5730" />
      <rect x="60" y="57" width="6" height="22" rx="2" fill="#8f5730" />
      <rect x="24" y="12" width="30" height="6" rx="2" fill="#b0713f" />
    </svg>
  );
}

export function VegetablesArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#d7e7cb" />
      <path d="M8 62h80v10H8z" fill="#8f5730" />
      {[18, 34, 50, 66].map((x, i) => (
        <g key={x}>
          <path
            d={`M${x} 62c-2-8 2-14 8-16 2 8-2 14-8 16Z`}
            fill={i % 2 ? "#4c7a3d" : "#6ba05a"}
          />
          <path
            d={`M${x + 6} 62c6-2 10-6 12-12-7 0-11 5-12 12Z`}
            fill="#3d6b33"
          />
        </g>
      ))}
      <rect
        x="16"
        y="46"
        width="64"
        height="8"
        rx="3"
        fill="#c9a26e"
        opacity="0.6"
      />
    </svg>
  );
}

export function ClothesArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e2d8c9" />
      {[30, 42, 54, 66].map((y, i) => (
        <rect
          key={y}
          x="22"
          y={y}
          width="52"
          height="10"
          rx="3"
          fill={i % 2 ? "#4a7fb5" : "#3a5f8a"}
        />
      ))}
      <rect x="22" y="30" width="52" height="10" rx="3" fill="#6ba3d8" />
    </svg>
  );
}

export function SmartphonesArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#dcd4c8" />
      <rect x="20" y="52" width="56" height="8" rx="3" fill="#8f5730" />
      {[26, 42, 58].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={22 - i * 2}
            width={15}
            height={32}
            rx={3}
            fill="#2c3137"
          />
          <rect
            x={x + 1.5}
            y={24 - i * 2}
            width={12}
            height={28}
            rx={2}
            fill={["#3a3f45", "#454b52", "#3a3f45"][i]}
          />
        </g>
      ))}
    </svg>
  );
}

export function MetalPotsArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e4e0da" />
      <path
        d="M18 52h34v14a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V52Z"
        fill="#8a8f96"
      />
      <rect x="14" y="48" width="42" height="6" rx="2" fill="#6f747b" />
      <path
        d="M56 56h26v10a7 7 0 0 1-7 7H63a7 7 0 0 1-7-7V56Z"
        fill="#a5abb3"
      />
      <rect x="53" y="52" width="32" height="5" rx="2" fill="#83898f" />
      <path
        d="M78 58c6 0 9 3 9 7"
        stroke="#83898f"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}

/* ── Detail page artwork ───────────────────────────────────────── */

/** Main gallery photo tile — the hero glass-jars shot from the design. */
export function DetailHeroArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="400" fill="#6a5140" />
      {/* blurred background shelf */}
      <rect
        x="0"
        y="0"
        width="400"
        height="130"
        fill="#4d3d31"
        opacity="0.85"
      />
      <rect
        x="30"
        y="30"
        width="70"
        height="90"
        rx="6"
        fill="#7d6450"
        opacity="0.8"
      />
      <rect
        x="300"
        y="18"
        width="80"
        height="110"
        rx="6"
        fill="#8a6f58"
        opacity="0.7"
      />
      {/* wooden table */}
      <rect y="300" width="400" height="100" fill="#9a6f42" />
      <path d="M0 300h400v12H0Z" fill="#7d5630" />
      <path d="M0 340c80 6 180 6 400 0v60H0Z" fill="#8a6038" opacity="0.7" />
      {/* left jar — black lid */}
      <g>
        <rect x="70" y="128" width="148" height="28" rx="9" fill="#17191c" />
        <rect x="70" y="128" width="148" height="9" rx="4.5" fill="#33373d" />
        <path
          d="M78 156h132v150a26 26 0 0 1-26 26H104a26 26 0 0 1-26-26V156Z"
          fill="#cfd8d4"
          opacity="0.6"
        />
        <path d="M78 156h132v16H78Z" fill="#9fb0aa" opacity="0.55" />
        <rect
          x="94"
          y="184"
          width="12"
          height="110"
          rx="6"
          fill="#ffffff"
          opacity="0.45"
        />
        <rect
          x="182"
          y="196"
          width="7"
          height="76"
          rx="3.5"
          fill="#ffffff"
          opacity="0.3"
        />
      </g>
      {/* right jar — gold lid */}
      <g>
        <rect x="216" y="150" width="136" height="26" rx="9" fill="#b98d3e" />
        <rect x="216" y="150" width="136" height="9" rx="4.5" fill="#d8b055" />
        <path
          d="M222 176h124v136a24 24 0 0 1-24 24H246a24 24 0 0 1-24-24V176Z"
          fill="#d6ded9"
          opacity="0.6"
        />
        <path d="M222 176h124v14H222Z" fill="#aebdb6" opacity="0.55" />
        <rect
          x="238"
          y="200"
          width="10"
          height="98"
          rx="5"
          fill="#ffffff"
          opacity="0.45"
        />
        <rect
          x="316"
          y="208"
          width="6"
          height="68"
          rx="3"
          fill="#ffffff"
          opacity="0.3"
        />
      </g>
    </svg>
  );
}

/** Gallery thumbnail — jar lids on a shelf. */
export function DetailThumbsLidsArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#d8cfc0" />
      <rect y="64" width="96" height="32" fill="#b8ad9c" />
      {[16, 40, 64].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={40 - i * 4}
            width={20}
            height={7}
            rx="3"
            fill={["#6f747b", "#b98d3e", "#8fa6a0"][i]}
          />
          <rect
            x={x + 2}
            y={47 - i * 4}
            width={16}
            height={20 + i * 4}
            rx="3"
            fill="#e3dccd"
            opacity="0.85"
          />
        </g>
      ))}
    </svg>
  );
}

/** Gallery thumbnail — stacked empty jars. */
export function DetailThumbsStackArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e4ecea" />
      <rect y="72" width="96" height="24" fill="#c9a26e" />
      {[18, 40, 62].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y={34}
            width={18}
            height={40}
            rx="4"
            fill="#cfe4df"
            opacity="0.9"
          />
          <rect x={x} y={29} width={18} height={6} rx="2.5" fill="#8fa6a0" />
        </g>
      ))}
    </svg>
  );
}

/** Area-items tile — succulent planted in a tin can planter. */
export function PlanterCanArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#d8cdbd" />
      <rect y="70" width="96" height="26" fill="#8f6238" />
      <path d="M32 58h32l-4 22H36Z" fill="#a5abb3" />
      <rect x="30" y="54" width="36" height="7" rx="2" fill="#83898f" />
      <path d="M48 54c-1-14 4-24 14-30-1 13-6 23-14 30Z" fill="#4c7a3d" />
      <path d="M46 54c-8-5-11-13-10-22 9 3 12 12 10 22Z" fill="#6ba05a" />
      <path d="M50 54c4-8 10-12 18-13-3 9-9 13-18 13Z" fill="#7fb069" />
    </svg>
  );
}

/** Area-items tile — open cardboard box. */
export function OpenBoxArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#d9d3c8" />
      <rect y="78" width="96" height="18" fill="#a89f92" />
      <path d="M24 44l-10-10 14-5 7 9Z" fill="#a87840" />
      <path d="M72 44l10-10-14-5-7 9Z" fill="#c99e63" />
      <path d="M24 44h48v28a4 4 0 0 1-4 4H28a4 4 0 0 1-4-4Z" fill="#c89b62" />
      <path d="M24 44h48v8H24Z" fill="#a87f4c" />
    </svg>
  );
}

/** Area-items tile — hanging blue shirt. */
export function HangingShirtArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e7e3da" />
      <rect x="47" y="8" width="2.5" height="14" fill="#6f747b" />
      <path d="M38 24l10-6 10 6-4 6h-12Z" fill="#7d97ad" />
      <path
        d="M30 74l8-46 10 8 10-8 8 46-10 4-3-22-3 34H43l-3-34-3 22Z"
        fill="#a8c4dc"
      />
      <rect x="43" y="30" width="10" height="4" rx="2" fill="#6f8ba3" />
    </svg>
  );
}

/** Area-items tile — glass food container with lunch. */
export function FoodContainerArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#e0ddd3" />
      <rect y="74" width="96" height="22" fill="#b8ad9c" />
      <rect
        x="16"
        y="40"
        width="64"
        height="34"
        rx="6"
        fill="#dfe8e4"
        opacity="0.9"
      />
      <rect x="16" y="34" width="64" height="9" rx="4" fill="#8fa6a0" />
      <rect
        x="22"
        y="50"
        width="24"
        height="18"
        rx="4"
        fill="#d05a4e"
        opacity="0.8"
      />
      <rect
        x="50"
        y="50"
        width="24"
        height="18"
        rx="4"
        fill="#7fb069"
        opacity="0.8"
      />
      <circle cx="34" cy="59" r="6" fill="#f2b64b" />
    </svg>
  );
}

/** Stylized map with routes + pin for the pickup-location card. */
export function MapArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 400 176"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="176" fill="#eef4ee" />
      <path
        d="M-20 150c80-40 160-30 240-70s130-60 200-40"
        stroke="#d7e7cb"
        strokeWidth="26"
        fill="none"
      />
      <path
        d="M-20 150c80-40 160-30 240-70s130-60 200-40"
        stroke="#f2c94c"
        strokeWidth="7"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M-30 60c90 30 180 10 260 50s110 50 190 40"
        stroke="#bcd9b6"
        strokeWidth="20"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M120 200c10-60 40-90 100-120"
        stroke="#ffffff"
        strokeWidth="14"
        fill="none"
        opacity="0.9"
      />
      <ellipse cx="330" cy="130" rx="40" ry="18" fill="#d7e7cb" />
      <ellipse cx="60" cy="30" rx="34" ry="14" fill="#d7e7cb" opacity="0.8" />
    </svg>
  );
}

export function FeaturedJarsArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="96" height="96" fill="#3a3f45" />
      <rect y="66" width="96" height="30" fill="#6b4a2f" />
      {[22, 42, 62].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={34 + i * 3}
            width={14}
            height={30 - i * 3}
            rx={3}
            fill="#e8c97a"
            opacity="0.9"
          />
          <circle cx={x + 7} cy={48 + i * 3} r={4} fill="#f2b64b" />
          <rect
            x={x}
            y={30 + i * 3}
            width={14}
            height={5}
            rx={2}
            fill="#8fa6a0"
          />
        </g>
      ))}
      <circle cx="30" cy="40" r="16" fill="#f2c94c" opacity="0.12" />
    </svg>
  );
}

/**
 * Art for every exchange item id (plus the Glass Jar design's extra gallery
 * shots). One map shared by the grid, the detail gallery and area cards so
 * each item always shows its own picture.
 */
export const ITEM_ART: Record<string, (props: ArtProps) => React.ReactNode> = {
  "glass-jars": JarsPhotoArt,
  "cardboard-boxes": CardboardStackArt,
  "plastic-containers": PlasticContainersArt,
  "wooden-chair": WoodenChairArt,
  "organic-vegetables": VegetablesArt,
  "used-clothes": ClothesArt,
  "old-smartphones": SmartphonesArt,
  "metal-pots": MetalPotsArt,
  "diy-storage-jars": FeaturedJarsArt,
  "plastic-bottle-planter": PlanterCanArt,
  "cardboard-box": OpenBoxArt,
  "old-clothes-shirt": HangingShirtArt,
  "food-container": FoodContainerArt,
  "jar-hero": DetailHeroArt,
  "jar-lids": DetailThumbsLidsArt,
  "jar-stack": DetailThumbsStackArt,
};

/** Renders the art for an item/gallery key, with a neutral fallback. */
export function ItemArt({ artKey, className }: ArtProps & { artKey: string }) {
  const Art = ITEM_ART[artKey] ?? JarsPhotoArt;
  return <Art className={className} />;
}
