/**
 * SVG stand-ins for exchange listing photos (matches dashboard-art pattern).
 * Swap for <Image> photos later without touching layout code.
 */

type ArtProps = {
  className?: string;
};

export function JarsPhotoArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="96" height="96" fill="#caa06a" />
      <rect y="70" width="96" height="26" fill="#8f6238" />
      {[14, 34, 54, 72].map((x, i) => (
        <g key={x}>
          <rect x={x} y={30 - i * 2} width={16} height={40 + i * 2} rx={3} fill="#d8c9a8" opacity="0.9" />
          <rect x={x + 2} y={34 - i * 2} width={12} height={12} rx={1} fill="#b98d3e" opacity="0.7" />
          <rect x={x} y={26 - i * 2} width={16} height={5} rx={2} fill={i % 2 ? "#8fa6a0" : "#b0713f"} />
        </g>
      ))}
    </svg>
  );
}

export function CardboardStackArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="96" height="96" fill="#b9b3a8" />
      <rect y="78" width="96" height="18" fill="#8f887b" />
      {[16, 34, 52, 70].map((x, i) => (
        <rect key={x} x={x} y={70 - i * 15} width={22} height={13} rx={1.5} fill={i % 2 ? "#c99e63" : "#b9894f"} />
      ))}
    </svg>
  );
}

export function PlasticContainersArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="96" height="96" fill="#e4ecea" />
      <rect x="10" y="40" width="76" height="6" rx="2" fill="#b9b3a8" />
      {[14, 34, 54].map((x, i) => (
        <g key={x}>
          <rect x={x} y={48} width={16} height={18} rx={3} fill={["#d05a4e", "#4c9a44", "#4a7fb5"][i]} opacity="0.85" />
          <rect x={x} y={44} width={16} height={5} rx={2} fill="#2f3a44" opacity="0.7" />
        </g>
      ))}
      <rect x="30" y="20" width="36" height="16" rx="3" fill="#cfe4df" />
    </svg>
  );
}

export function WoodenChairArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
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
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="96" height="96" fill="#d7e7cb" />
      <path d="M8 62h80v10H8z" fill="#8f5730" />
      {[18, 34, 50, 66].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 62c-2-8 2-14 8-16 2 8-2 14-8 16Z`} fill={i % 2 ? "#4c7a3d" : "#6ba05a"} />
          <path d={`M${x + 6} 62c6-2 10-6 12-12-7 0-11 5-12 12Z`} fill="#3d6b33" />
        </g>
      ))}
      <rect x="16" y="46" width="64" height="8" rx="3" fill="#c9a26e" opacity="0.6" />
    </svg>
  );
}

export function ClothesArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="96" height="96" fill="#e2d8c9" />
      {[30, 42, 54, 66].map((y, i) => (
        <rect key={y} x="22" y={y} width="52" height="10" rx="3" fill={i % 2 ? "#4a7fb5" : "#3a5f8a"} />
      ))}
      <rect x="22" y="30" width="52" height="10" rx="3" fill="#6ba3d8" />
    </svg>
  );
}

export function SmartphonesArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="96" height="96" fill="#dcd4c8" />
      <rect x="20" y="52" width="56" height="8" rx="3" fill="#8f5730" />
      {[26, 42, 58].map((x, i) => (
        <g key={x}>
          <rect x={x} y={22 - i * 2} width={15} height={32} rx={3} fill="#2c3137" />
          <rect x={x + 1.5} y={24 - i * 2} width={12} height={28} rx={2} fill={["#3a3f45", "#454b52", "#3a3f45"][i]} />
        </g>
      ))}
    </svg>
  );
}

export function MetalPotsArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="96" height="96" fill="#e4e0da" />
      <path d="M18 52h34v14a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V52Z" fill="#8a8f96" />
      <rect x="14" y="48" width="42" height="6" rx="2" fill="#6f747b" />
      <path d="M56 56h26v10a7 7 0 0 1-7 7H63a7 7 0 0 1-7-7V56Z" fill="#a5abb3" />
      <rect x="53" y="52" width="32" height="5" rx="2" fill="#83898f" />
      <path d="M78 58c6 0 9 3 9 7" stroke="#83898f" strokeWidth="3" fill="none" />
    </svg>
  );
}

export function FeaturedJarsArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="96" height="96" fill="#3a3f45" />
      <rect y="66" width="96" height="30" fill="#6b4a2f" />
      {[22, 42, 62].map((x, i) => (
        <g key={x}>
          <rect x={x} y={34 + i * 3} width={14} height={30 - i * 3} rx={3} fill="#e8c97a" opacity="0.9" />
          <circle cx={x + 7} cy={48 + i * 3} r={4} fill="#f2b64b" />
          <rect x={x} y={30 + i * 3} width={14} height={5} rx={2} fill="#8fa6a0" />
        </g>
      ))}
      <circle cx="30" cy="40" r="16" fill="#f2c94c" opacity="0.12" />
    </svg>
  );
}
