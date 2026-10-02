#!/bin/sh
set -eu

# Migrations are idempotent. Running them here lets a freshly created volume
# and later image upgrades use the same `docker compose up` command.
npx prisma migrate deploy

exec "$@"
