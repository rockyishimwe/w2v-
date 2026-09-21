/**
 * SVG stand-ins for the scanner result imagery.
 * GlassJarsPhotoArt fills the result photo frame; the leaf watermark is the
 * decorative motif inside the "More details" and "Great find!" panels.
 * Swap GlassJarsPhotoArt for the captured <Image> when real analysis lands.
 */

type ArtProps = {
  className?: string;
};

export function GlassJarsPhotoArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="400" fill="#3a3f45" />
      {/* dim background clutter */}
      <rect x="18" y="26" width="96" height="150" rx="8" fill="#23272c" />
      <rect x="120" y="10" width="70" height="60" rx="6" fill="#2c3137" />
      <rect x="316" y="40" width="70" height="120" rx="8" fill="#2c3137" />
      <rect x="0" y="238" width="400" height="162" fill="#a97845" />
      <path d="M0 238h400v10H0Z" fill="#8f6238" />
      <path
        d="M0 300c60 8 120 8 200 2s140-6 200 2v96H0Z"
        fill="#b98551"
        opacity="0.6"
      />

      {/* left jar — black lid */}
      <g>
        <rect x="74" y="118" width="140" height="26" rx="8" fill="#191b1e" />
        <rect x="74" y="118" width="140" height="9" rx="4.5" fill="#303338" />
        <path
          d="M80 144h128v158a26 26 0 0 1-26 26H106a26 26 0 0 1-26-26V144Z"
          fill="#cfd8d4"
          opacity="0.55"
        />
        <path d="M80 144h128v14H80Z" fill="#9fb0aa" opacity="0.6" />
        <rect
          x="94"
          y="170"
          width="10"
          height="120"
          rx="5"
          fill="#ffffff"
          opacity="0.5"
        />
        <rect
          x="172"
          y="180"
          width="6"
          height="86"
          rx="3"
          fill="#ffffff"
          opacity="0.3"
        />
      </g>

      {/* right jar — gold lid, slightly shorter and forward */}
      <g>
        <rect x="212" y="140" width="128" height="24" rx="8" fill="#b98d3e" />
        <rect x="212" y="140" width="128" height="8" rx="4" fill="#d8b055" />
        <path
          d="M216 148h120M216 156h120"
          stroke="#93702f"
          strokeWidth="2"
          opacity="0.7"
        />
        <path
          d="M218 164h116v140a24 24 0 0 1-24 24H242a24 24 0 0 1-24-24V164Z"
          fill="#d6ded9"
          opacity="0.6"
        />
        <path d="M218 164h116v12H218Z" fill="#aebdb6" opacity="0.6" />
        <rect
          x="232"
          y="188"
          width="9"
          height="104"
          rx="4.5"
          fill="#ffffff"
          opacity="0.5"
        />
        <rect
          x="300"
          y="196"
          width="6"
          height="72"
          rx="3"
          fill="#ffffff"
          opacity="0.3"
        />
      </g>
    </svg>
  );
}

export function LeafWatermarkArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M38 96c-6-30 10-56 44-64 8 34-8 58-38 62"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 104c10-22 26-38 46-48"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M78 32c10-8 22-10 34-6-4 12-12 19-24 21"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
