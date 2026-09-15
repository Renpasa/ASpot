# ASpot Restoration — Baseline Freeze (Stage A)

Campaign: `Renpasa/ASpot#12` — Restoration Campaign v1
Status: complete. No application files were modified in this stage.
Date (UTC): 2026-09-15

## 1. Identity

- Repository: `Renpasa/ASpot`
- Branch: `main`
- Baseline SHA: `4965bb82f1d8e081896fd0daba5c81cdc9e16a07`
- Head commit at freeze: Merge PR #8 — Add Spot feature with map interaction
- Runtime: Node 24 (local verify); CI pins Node 20
- Package manager: `pnpm` only. No `package-lock.json` present.
- Stack: React 19 + Vite 8 + Tailwind 3 + `@vis.gl/react-google-maps` / Node + Express 4 + TypeScript + Prisma 5 + PostgreSQL 15 (`docker-compose` service `db`)
- Env required (key names only — values never committed): `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_MAPS_API_KEY` (backend); `VITE_GOOGLE_MAPS_API_KEY`, `VITE_API_BASE_URL` (frontend). Only `.env.example` files are committed.

## 2. Engineering baseline (physically verified)

| Check | Command | Result |
|---|---|---|
| Install backend | `pnpm install --frozen-lockfile` (in `backend/`) | PASS |
| Install frontend | `pnpm install --frozen-lockfile` (in `frontend/`) | PASS |
| Build backend | `pnpm run build` (`tsc`) | PASS only after `prisma generate` with a dummy `DATABASE_URL`; FAILs before generate (missing Prisma client). Fresh clone without the generate step is broken. |
| Build frontend | `pnpm run build` (`tsc -b && vite build`) | PASS (75 modules) |
| Backend tests (source only) | `pnpm exec jest src` | PASS 4/4 |
| Backend tests (default `pnpm test`) | `pnpm test` | 4 passed / 4 failed (8 total): stale compiled `dist/__tests__/*.js` runs alongside `src/`, so every suite executes twice and the `dist` copies fail. `dist/` is untracked `tsc` output, not source. No `testPathIgnorePatterns` for `dist/`. Fixed in v1 (PKG-3). |
| Frontend tests | — | MISSING: no test runner, no `*.test.*` files |
| Coverage | — | MISSING on both sides |
| Backend lint | — | MISSING: no `lint` script |
| Frontend lint | `pnpm run lint` (`eslint .`) | PASS, clean |
| Type-check | via builds (`tsc`, `tsc -b`) | PASS (with prisma-generate precondition) |
| CI (`.github/workflows/main.yml`) | backend install + generate (dummy DB) + build; frontend install + lint + build | Last runs green at freeze. CI does **not** run backend tests, coverage, or any e2e. |

No fake PASSes: MISSING stays MISSING above.

## 3. Product baseline (code-read; no live credentials in this environment)

| Feature | Status | Evidence |
|---|---|---|
| Browse spots (list + `GET /api/spots`) | Partial | Cards render; client ignores the backend bbox params; no loading skeleton, retry, or empty-state CTA |
| Card → map link | Partial | Map pans + zooms on select; all markers visually identical, no highlight/bounce/scroll |
| Marker rendering | Partial | Photo `<img>` stuffed inside `Pin` glyph (fragile); **no clustering** despite the project spec requiring it |
| Map → card link | Partial | Selection state set, but no scroll-to-card and no marker emphasis — user must hunt |
| Add Spot flow (auth-gated) | Partial | Non-English banner mid-English flow; hardcoded Taipei default before user clicks; URL-only photo with no client-side validation; no success toast; guests see no affordance |
| Auth (register/login/logout, JWT, persist) | Working | Complete incl. auto-login after register and token interceptor |
| Spot detail view | Missing | Tips dumped inline in every card; no route/modal/deep link |
| Edit/Delete spot | Partial | Backend `PUT`/`DELETE` with owner check exist; **zero frontend surface** |
| Responsive/mobile | Partial | Fixed `w-1/3 + w-2/3` split-screen; no stacked/BottomSheet layout; mobile squeezes |
| Search/filter | Missing | No text search or filters; backend bbox params unused |
| Seed/demo data | Working | Seed script upserts a test user + 2 Taipei spots |
| Health endpoint | Working | `GET /health → {status:'ok'}` |

Critical flows: browse → inspect pans mechanically but the card/marker relationship is weak; marker click gives no scroll-to-card; Add Spot requires discovering login, hits a language switch, and a misleading default location; auth register → login → logout → persist is complete; edit/delete is API-only; mobile layout squeezes map and list side-by-side.

## 4. Visual baseline contract (Before evidence)

Live Before screenshots were **blocked on credentials**: no Maps API key and no provisioned Postgres in the sandbox; a keyless map canvas renders an error tile that would poison the comparison. No screenshots are committed. The After comparison reuses these exact conditions and relies on code + build + DOM evidence, never faked renders:

| Screen | Route | Viewport | State / fixture |
|---|---|---|---|
| Desktop browse | `/` | 1440×900 | 2 seed spots, logged-out, no selection |
| Desktop selected | `/` | 1440×900 | same seed, spot #1 selected |
| Desktop Add Spot | `/` | 1440×900 | logged-in, creating-mode, empty form |
| Mobile browse | `/` | 390×844 | same seed, logged-out |
| Mobile Add Spot | `/` | 390×844 | logged-in, creating-mode |
