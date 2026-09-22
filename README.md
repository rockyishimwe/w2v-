# Waste2Value — Frontend

AI-powered household waste-to-resource platform (MVP) — Kigali, Rwanda.
Mobile-first responsive web client built per the Waste2Value SRS v1.0.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, file-based routing) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (design tokens TBD from design assets)
- ESLint (eslint-config-next, core-web-vitals) + Prettier

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start dev server (Turbopack)      |
| `npm run build`      | Production build                  |
| `npm run start`      | Run production build              |
| `npm run lint`       | Lint the project                  |
| `npm run lint:fix`   | Lint and auto-fix                 |
| `npm run format`     | Format all files with Prettier    |
| `npm run format:check` | Check formatting                |
| `npm run typecheck`  | Type-check without emitting       |
| `npm run test`       | Run unit tests (Vitest)           |
| `npm run check`      | Typecheck + lint + format + tests |

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. All `NEXT_PUBLIC_*`
variables are exposed to the browser — never put secrets there.

## Project Structure

```
src/
├── app/            # Next.js App Router pages/layouts (file-based routing)
├── components/     # Reusable UI components (empty — awaiting designs)
├── hooks/          # Custom React hooks
├── lib/            # Utilities, API client, config helpers
├── services/       # Backend API service layer
├── types/          # Shared TypeScript types
└── constants/      # App-wide constants
```

## SRS Notes (frontend-relevant)

- Mobile-first responsive web; native mobile app deferred to post-MVP.
- Low-bandwidth + intermittent connectivity must be tolerated (offline queuing).
- Localization: Kinyarwanda / English / French (scope to be confirmed).
- Basic accessibility: contrast, font sizes, alt text.
- Auth: token-based (JWT/OAuth2) against the backend API over HTTPS/REST.
