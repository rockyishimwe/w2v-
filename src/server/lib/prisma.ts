/**
 * Singleton Prisma Client wired for Prisma ORM v7 driver adapters.
 *
 * - SQLite (better-sqlite3) when DATABASE_URL is unset — zero-config dev.
 * - PostgreSQL (pg) when DATABASE_URL starts with postgres://.
 *
 * Next.js hot-reloads modules in dev, so we stash the instance on
 * globalThis to avoid exhausting database connections.
 */
import { createRequire } from "node:module";
import { PrismaClient } from "@/server/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

type Cache = {
  __w2vPrisma?: PrismaClient;
};
const globalForPrisma = globalThis as unknown as Cache;

/**
 * Runtime require, so the bundler does not try to resolve optional
 * adapters at build time. @prisma/adapter-pg is only needed when
 * DATABASE_URL points at Postgres (npm i @prisma/adapter-pg pg).
 */
const runtimeRequire = createRequire(import.meta.url);

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const isPostgres =
    url.startsWith("postgres://") || url.startsWith("postgresql://");

  if (isPostgres) {
    let PrismaPg: new (config: { connectionString: string }) => unknown;
    try {
      // turbopackIgnore keeps the bundler from resolving this optional
      // adapter at build time (it's installed only for Postgres deploys).
      ({ PrismaPg } = runtimeRequire(
        /* turbopackIgnore: true */ "@prisma/adapter-pg",
      ));
    } catch {
      throw new Error(
        "DATABASE_URL points at PostgreSQL but @prisma/adapter-pg is not installed. Run: npm i @prisma/adapter-pg pg",
      );
    }
    return new PrismaClient({
      adapter: new PrismaPg({ connectionString: url }) as never,
    });
  }

  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url }),
  });
}

export const prisma: PrismaClient =
  globalForPrisma.__w2vPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__w2vPrisma = prisma;
}
