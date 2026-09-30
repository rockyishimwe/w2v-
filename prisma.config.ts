import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma ORM v7 config. The CLI (migrate / db push) reads the
 * datasource URL from here, while the runtime client uses driver adapters
 * (see src/server/lib/prisma.ts). No seed step — all data is real user data.
 *
 * Defaults to a local SQLite file when DATABASE_URL is not provided so the
 * project runs out of the box; PostgreSQL in production (set DATABASE_URL
 * and switch the schema provider to "postgresql" — see README).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
