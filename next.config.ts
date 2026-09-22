import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compile-time validation of every <Link href> and router.push() against
  // the real route tree (generated into .next/types by `next typegen`).
  typedRoutes: true,

  // Prefer modern image formats for the future photo pipeline (listings,
  // scan captures) — smaller payloads on low-bandwidth connections.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
