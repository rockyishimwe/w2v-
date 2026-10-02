# Waste2Value — Waste-to-Resource Platform (Kigali, Rwanda)

AI-powered household waste-to-resource platform (MVP).
Mobile-first Next.js web client **with a full backend in the same project** —
Route Handlers under `src/app/api/**` + Prisma + Groq AI (free-tier models).

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript strict
- [Prisma ORM v7](https://www.prisma.io) — SQLite for zero-config dev, PostgreSQL for production (driver adapters)
- Auth: short-lived JWTs ([jose](https://github.com/panva/jose)) + rotating refresh tokens (bcrypt password hashing)
- Validation: [zod](https://zod.dev) on every input
- AI: [Groq SDK](https://groq.com) with JSON-mode structured outputs
- Tailwind CSS v4, ESLint, Prettier, Vitest

## Quick Start

```bash
npm install
npx prisma migrate dev       # creates prisma/dev.db (SQLite) + applies migrations
npm run dev
```

Open http://localhost:3000 and create your account — all data in the app
is real user data. There is **no seeding**: the marketplace starts empty
and fills as you post listings; Discover ideas grow from assistant chats
and AI generation.

**AI**: add `GROQ_API_KEY` to `.env.local` for live AI (vision scanning,
assistant, DIY guides, idea generation). Some scan/assistant fallbacks
still exist for offline resilience.

## Docker

The included Compose setup runs the production build, applies checked-in
Prisma migrations on startup, and keeps the SQLite database and uploaded
images in named Docker volumes.

```bash
docker compose up --build
```

The `.env` file is **optional**: Compose starts without it, and you can add
secrets later:

```bash
cp .env.docker.example .env
# Set JWT_SECRET to a unique value (at least 16 characters) before use;
# GROQ_API_KEY and the Google OAuth values enable those integrations.
docker compose up --build
```

Without `JWT_SECRET`, the app boots and serves pages, but sign-up/sign-in
returns an error until the secret is set (`APP_URL` defaults to
`http://localhost:3000`).

Open http://localhost:3000. Stop the app with `docker compose down`; its data
remains in the `sqlite-data` and `uploads-data` volumes. To remove the app and
all local Docker data deliberately, run `docker compose down --volumes`.

For a public deployment, set `APP_URL` to the external HTTPS URL and use that
same URL in the Google OAuth redirect configuration. The Compose configuration
uses SQLite; use a managed PostgreSQL database for multi-replica production
deployments as described below.

## Environment Variables

Copy `.env.example` → `.env.local`. Only `NEXT_PUBLIC_*` vars reach the
browser, and none of them are secrets.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | no | PostgreSQL URL. Unset → local SQLite `prisma/dev.db`. |
| `JWT_SECRET` | yes (auth) | HMAC secret for access JWTs (≥16 chars). |
| `JWT_REFRESH_SECRET` | reserved | Extra secret slot for refresh-token pepper. |
| `GROQ_API_KEY` | recommended | Enables live AI features. |
| `GROQ_TEXT_MODEL` | no | Default `openai/gpt-oss-20b` (fast small model). |
| `GROQ_REASONING_MODEL` | no | Default `openai/gpt-oss-120b` (larger reasoning model). |
| `GROQ_VISION_MODEL` | no | Default `qwen/qwen3.8-27b` (photo identification). |
| `ALLOWED_ORIGINS` | no | Comma-separated CORS origins (empty = same-origin). |
| `NEXT_PUBLIC_API_BASE_URL` | no | Empty = same-origin `/api` (the default topology). |

> Free-tier model IDs verified Sep 2026 at console.groq.com/docs/models.
> `llama-3.1-8b-instant` / `llama-3.3-70b-versatile` are Enterprise-only now;
> `meta-llama/llama-4-scout` left the free tier — `qwen/qwen3.8-27b` is the
> free vision model. Re-verify before launch.

## Database

Prisma 7 uses `prisma.config.ts` + driver adapters:

```bash
npx prisma migrate dev      # apply migrations locally (SQLite)
npx prisma studio           # browse data
```

Uploaded listing photos are stored under `uploads/` (gitignored) and
served via `GET /api/uploads/[name]`. For production, swap
`src/server/lib/uploads.ts` for blob storage (S3/R2) behind the same
routes.

**PostgreSQL**: set `DATABASE_URL`, switch `provider = "postgresql"` in
`prisma/schema.prisma`, run `npx prisma migrate dev`, and add
`@prisma/adapter-pg` (`npm i @prisma/adapter-pg pg`) — `src/server/lib/prisma.ts`
already auto-selects the Postgres adapter when `DATABASE_URL` is a
`postgres://` URL.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run test` | Vitest unit + integration tests |
| `npm run typecheck` | `next typegen && tsc --noEmit` |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |
| `npm run check` | typecheck + lint + format + tests |

## Project Structure

```
src/
├── app/
│   ├── api/            # ← backend Route Handlers
│   │   ├── auth/       #   register, login, refresh, logout, me
│   │   ├── ai/         #   scan (vision), assistant (chat), tips
│   │   ├── activity/   #   feed GET/POST (ETag, idempotency)
│   │   ├── exchange/   #   listings list/detail/interest
│   │   ├── ideas/      #   discover ideas + DIY guide
│   │   └── health/
│   ├── ...             # frontend pages (unchanged UI)
├── components/  hooks/  lib/  services/  types/  constants/
└── server/             # backend layers (routes stay thin)
    ├── lib/            # auth, errors, http, logger, groq, prisma, rate-limit, tokens, idempotency
    ├── schemas/        # zod request validation
    ├── repositories/   # Prisma data access
    ├── services/       # business logic (auth, ai, fallbacks)
    └── generated/      # Prisma client (gitignored)
prisma/
├── schema.prisma  migrations/
uploads/                # user-uploaded images (gitignored)
```

## API Reference

All responses are JSON. Errors always use
`{ "error": { "code", "message", "details?" } }`.
Protected endpoints require `Authorization: Bearer <accessToken>`.
POSTs accept an `Idempotency-Key` header for safe offline retries.
Locale: `Accept-Language: rw | en | fr` (or a `locale` body field).

### Auth

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Vanessa","lastName":"Uwase","email":"v@ex.rw","password":"Password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.rw","password":"YourPassword123"}'

# Refresh (rotates the refresh token)
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" -d '{"refreshToken":"<refreshToken>"}'

# Me
curl http://localhost:3000/api/auth/me -H "Authorization: Bearer <accessToken>"
# → { user: { id, email, firstName, lastName, locale, hasPassword } }

# Update the profile (Settings page: name + preferred language)
curl -X POST http://localhost:3000/api/auth/me   -H "Authorization: Bearer <accessToken>"   -H "Content-Type: application/json"   -d '{"firstName":"Vanessa","lastName":"Uwase","locale":"rw"}'

# Change the password (revokes every refresh token — log in again)
curl -X POST http://localhost:3000/api/auth/password   -H "Authorization: Bearer <accessToken>"   -H "Content-Type: application/json"   -d '{"currentPassword":"Password123","newPassword":"NewPassword123"}'

# Log out (revokes one refresh token)
curl -X POST http://localhost:3000/api/auth/logout   -H "Content-Type: application/json" -d '{"refreshToken":"<refreshToken>"}'

# Log out on all devices
curl -X POST http://localhost:3000/api/auth/logout-all   -H "Authorization: Bearer <accessToken>"
```

Session shape: `{ user, accessToken, refreshToken, expiresIn }`.
`user.hasPassword` is `false` for Google accounts, which is how the
Settings page knows to hide the password form.

Every signed-in page is wrapped in `AuthGuard`, which needs a stored token to
render and verifies it against `GET /api/auth/me`; a missing token sends the
visitor to `/?redirected=1`, a rejected one to `/?expired=1`.

### AI (Groq)

```bash
# Scan a waste photo (vision model; persists a Scan + activity entry)
curl -X POST http://localhost:3000/api/ai/scan \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: queued-scan-42" \
  -d '{"image":"data:image/jpeg;base64,…","locale":"en"}'
# → ScanResult: { id, title, material, category, confidence, detectedSummary,
#                 condition, estimatedSize, tip, recommendations[] }

# Chat assistant
curl -X POST http://localhost:3000/api/ai/assistant \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"message":"I have plastic bottles. What can I do with them?","locale":"en"}'
# → { text, ideas: [{ title, difficulty, time, description }] }

# Recycling tips for a material
curl -X POST http://localhost:3000/api/ai/tips \
  -H "Content-Type: application/json" -d '{"material":"Plastic","locale":"rw"}'
```

AI prompt-injection defense: user text is wrapped as untrusted data, never
treated as instructions; outputs are zod-validated with one retry.

### Activity

```bash
curl "http://localhost:3000/api/activity?filter=Reuse&days=30" \
  -H "Authorization: Bearer <accessToken>"
# → { data[], page, pageSize, total, stats, impact } (ETag + 304 support)

curl -X POST http://localhost:3000/api/activity \
  -H "Authorization: Bearer <accessToken>" -H "Idempotency-Key: act-1" \
  -H "Content-Type: application/json" \
  -d '{"type":"Reuse","title":"Reused glass jar","description":"Storage for spices"}'
```

### Exchange marketplace

```bash
curl "http://localhost:3000/api/exchange/listings?material=Glass&sort=distance"
curl "http://localhost:3000/api/exchange/listings/glass-jars"        # detail
curl -X POST "http://localhost:3000/api/exchange/listings/glass-jars" \
  -H "Authorization: Bearer <accessToken>" -H "Content-Type: application/json" \
  -d '{"message":"Hi, is it still available?"}'                      # interest
```

### Ideas / health

```bash
curl "http://localhost:3000/api/ideas?category=Glass"
curl "http://localhost:3000/api/ideas/candle-jars/guide"
curl http://localhost:3000/api/health   # { status, db, ai, time }
```

## Security

- All input validated with zod; consistent error envelope
- Rate limiting: 10/min auth, 20/min AI, 120/min elsewhere (per IP/user)
- Security headers on every API response (`nosniff`, `DENY`, referrer policy)
- CORS allow-list via `ALLOWED_ORIGINS` (default: same-origin only)
- Refresh tokens stored as SHA-256 hashes; rotation with replay detection
  (reuse revokes the whole token family)
- Structured logs never contain passwords, tokens or API keys (redacted)
- Secrets only in env vars — never in client bundles

## SRS Notes

- Mobile-first responsive web; offline queuing supported via idempotent POSTs
- Localization: Kinyarwanda / English / French (Accept-Language or `locale`)
- Low-bandwidth: small JSON payloads, ETag/304 on list endpoints,
  downscaled JPEG scan uploads, AI fallbacks when connectivity drops
