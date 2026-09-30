import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compile-time validation of every <Link href> and router.push() against
  // the real route tree (generated into .next/types by `next typegen`).
  typedRoutes: true,

  // The Postgres driver adapter is optional (SQLite dev doesn't need it,
  // production installs it) — keep it out of the bundle so the build
  // doesn't warn about a module that isn't a dependency.
  serverExternalPackages: ["@prisma/adapter-pg"],

  // Prefer modern image formats for the photo pipeline (listings, scan
  // captures) — smaller payloads on low-bandwidth connections.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
