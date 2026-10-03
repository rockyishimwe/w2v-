# Alpine keeps the image small. Node 20 is the floor for Next.js 16
# (`engines.node >= 20.9.0`), and the lockfile carries the linux-musl
# variants of the Next.js SWC binaries and sharp.

FROM node:24-alpine AS dependencies
WORKDIR /app

# libc6-compat covers prebuilt glibc binaries; openssl provides libssl for
# Prisma's linux-musl engine target. python3/make/g++ stay for any
# dependency without a musl prebuild.
RUN apk add --no-cache python3 make g++ libc6-compat openssl

# Keep the lockfile as the single source of dependency versions.
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . ./

# Prisma's generated client is deliberately gitignored, so it must be
# generated inside the build image before Next.js compiles the application.
RUN npx prisma generate && npm run build

FROM node:24-alpine AS runner
WORKDIR /app

# Shared libraries used by the compiled native modules and the Prisma
# migration engine at runtime (the build toolchain stays out of this stage).
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# The Prisma CLI is retained to apply checked-in migrations at startup
# (docker-entrypoint.sh), so node_modules is copied unpruned.
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/src/server/generated ./src/server/generated
COPY docker-entrypoint.sh /usr/local/bin/w2v-entrypoint

# Pre-create the writable paths so the named volumes inherit `node`
# ownership on first mount, and so Next.js can write its runtime image /
# fetch caches under .next/cache.
RUN chmod +x /usr/local/bin/w2v-entrypoint \
    && mkdir -p /app/uploads /app/.next/cache \
    && chown -R node:node /app/uploads /app/.next

USER node
EXPOSE 3000

ENTRYPOINT ["w2v-entrypoint"]
CMD ["npm", "start"]
