# ASpot

Photo-spot sharing app: browse photography spots on a map, add new spots with photos and location tips.

## Stack

- **Frontend**: React + TypeScript (Vite), Tailwind CSS, `@vis.gl/react-google-maps` with marker clustering, Axios. Package manager: `pnpm`.
- **Backend**: Node.js + Express (TypeScript), PostgreSQL via Prisma, JWT auth, bcrypt password hashing. Package manager: `pnpm`.
- **CI**: `.github/workflows/main.yml` runs backend checks (install, Prisma generate, test, build) and frontend checks (install, lint, build) on pull requests to `main`.

## Repository layout

- `frontend/` — React SPA. Entry `src/main.tsx` → `src/App.tsx` → `src/pages/MapPage.tsx`.
- `backend/` — Express API. Entry `src/server.ts`, routes in `src/routes/`, Prisma schema in `backend/prisma/schema.prisma`.
- `docker-compose.yml` — local PostgreSQL (`postgres:15-alpine`).
- `docs/restoration/v1/` — restoration and Care Loop ledger history.

## API

Base URL defaults to `http://localhost:3000/api` (override with `VITE_API_BASE_URL`).

- `GET /health` — liveness check.
- `POST /api/auth/register`, `POST /api/auth/login` — JWT auth.
- `GET /api/spots`, `GET /api/spots/:id` — public spot listing/detail.
- `POST /api/spots`, `PUT /api/spots/:id`, `DELETE /api/spots/:id` — authenticated (Bearer JWT).

## Local development

Prerequisites: Node.js 20, `pnpm` 10, PostgreSQL (or Docker).

Backend:

```sh
cd backend
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, GOOGLE_MAPS_API_KEY
pnpm install
npx prisma generate
npx prisma migrate dev # or `npx prisma db push` for a quick start
pnpm dev
```

Frontend:

```sh
cd frontend
cp .env.example .env   # fill in VITE_GOOGLE_MAPS_API_KEY
pnpm install
pnpm dev
```

Or start Postgres via `docker-compose up -d` from the repo root.

## Checks

```sh
cd backend && pnpm test && pnpm run build
cd frontend && pnpm run lint && pnpm run build
```

## Notes

- No repository license has been chosen. `backend/package.json` contains a `"license": "ISC"` field, but there is no `LICENSE` file; treat licensing as undecided until the maintainer resolves it.
- `Agent.md` records contributor working rules (pnpm-only, branch and CI conventions).
