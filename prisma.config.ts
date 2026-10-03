import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js reads .env.local; plain `dotenv/config` would only load .env, so
// the CLI would not see the connection string the app runs with. Earlier
// files win, matching Next's own precedence.
config({ path: [".env.local", ".env"] });

/**
 * Prisma ORM v7 config. The CLI (migrate / db push) reads the
 * datasource URL from here, while the runtime client uses driver adapters
 * (see src/server/lib/prisma.ts). No seed step — all data is real user data.
 *
 * PostgreSQL only — DATABASE_URL is required (see README "Database").
 * For migrations prefer a direct (non-pooled) URL: pgbouncer-style poolers
 * reject the session-level statements `prisma migrate` issues.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL ?? "",
  },
});
