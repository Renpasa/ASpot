# ASpot Restoration — Plan (Stages C/D)

Campaign: `Renpasa/ASpot#12` — Restoration Campaign v1
Baseline: `main @ 4965bb82f1d8e081896fd0daba5c81cdc9e16a07`

## 1. Milestone (one sentence)

> Make the browse → inspect → map interaction → Add Spot journey feel complete and demonstrable on desktop and mobile.

Why this slice: every step of exactly this journey exists but each handoff is weak — the card↔marker link is one-directional with identical markers, Add Spot mixes languages and hides from guests, and mobile squeezes a fixed split-screen. One coherent pass over this single journey removes the most visible prototype feel with the smallest blast radius.

## 2. User outcome

A first-time visitor on desktop or a phone can: see spots, click a card and watch the map respond unambiguously, click a marker and find its card, understand Add Spot requires login, add a spot in one language, and get confirmation it worked.

## 3. In-scope behavior

1. **Marker fidelity**: clean marker states replacing the fragile photo-inside-`Pin` glyph; selected marker visually distinct + bounce on select (spec requires pan + bounce; pan exists, bounce missing); marker click scrolls the card into view and highlights it.
2. **Marker clustering** (spec MUST; zero clustering at baseline): via the Maps JS `marker` library + `@googlemaps/markerclusterer` (`pnpm` only, no paid SKU). Hand-rolled grid grouping is REJECTED as fake clustering.
3. **Add Spot coherence**: English-only UI; guest affordance showing login unlocks Add Spot; no preset coordinates until the user picks (explicit empty state); photo-URL validity check; success confirmation after create.
4. **Responsive**: mobile stacked layout (list/map); desktop keeps split-screen; header intact at 390px.
5. **Prototype residue** (tiny, in files already touched): product `<title>`, dead Vite-template CSS removed. Nothing else renamed.
6. **Engineering glue (lead-owned)**: `backend/jest.config.js` ignores `dist/` so default `pnpm test` runs only `src/`.

## 4. Explicitly OUT of scope

Search / filter / sort; spot detail route/modal beyond scroll-to-card; edit/delete frontend UI (API stays); photo upload (URL-only stays); auth flow changes; backend bbox wiring; any DB migration; any dependency major bump or stack change; any `.github/workflows/` edit; any `package-lock.json` / npm usage.

## 5. Acceptance criteria (all must hold on the integration candidate)

- Select card → map pans AND selected marker bounces + restyles; marker click → card scrolls into view + highlights (desktop 1440×900).
- `SpotList` renders CSS-columns masonry (`break-inside-avoid` cards), desktop + mobile.
- Clustering code present and active (source evidence + multi-spot or synthetic-spot evidence).
- Full UI English in Add Spot flow; guest sees what login unlocks; no preset coords before click; invalid photo URL rejected inline; successful create shows confirmation and the new spot appears.
- 390×844: list and map both usable without horizontal squeeze; header intact.
- Desktop split-screen preserved; no auth regression (register → login → persist → logout).
- `pnpm build` PASS both packages; backend `pnpm exec jest src` 4/4; frontend `pnpm run lint` clean; `tsc` clean both.
- No `.github/workflows/` diff; no `package-lock.json`; no credentials; no migration.

## 6. Required validation

Engineering per PR + integration: `pnpm install --frozen-lockfile`, `pnpm run build` (both), backend jest 4/4, frontend lint, `tsc` via builds, clean `git status` for lockfiles/creds, diff confined to owned surfaces.
Browser: desktop browse / selected / Add Spot @1440×900 + mobile browse / Add Spot @390×844 with the 2-spot seed fixture. Live map shots blocked without a Maps key (no spend authorized) — best-available evidence (keyless note + static/DOM evidence), never faked renders.

## 7. Task decomposition (Stage D)

- **PKG-1 — Map interaction, marker fidelity & masonry** (Worker A): marker render + bounce + hover sync + clustering + scroll-to-card + masonry. Owns marker regions of `MapPage.tsx` and select/hover/scroll hooks of `SpotList.tsx`. Forbids creation-form/header/auth-modal/creating-mode code, `backend/`, `prisma/`, workflows, deps.
- **PKG-2 — Add Spot & responsive polish** (Worker B, serialized AFTER PKG-1 — shared `MapPage.tsx` overlap): EN-only flow, guest affordance, no fake default, URL check, success feedback, mobile stack, title/dead-CSS. Owns `CreateSpotForm.tsx`, `Header.tsx`, guest-affordance in `AuthModal.tsx`, creating-mode/banner + layout regions of `MapPage.tsx`, index title, `App.css` dead-code removal. Forbids marker render/interactivity code, `SpotList.tsx` selection logic, `backend/`, `prisma/`, workflows, deps.
- **PKG-3 — Engineering glue (lead-owned, no worker)**: one-line jest config; spawning a worker adds more complexity than value.

Review routing: each worker PR reviewed by an independent reviewer that did not author it (verdicts PASS / PASS_WITH_MINOR / REPAIR_REQUIRED / BLOCKED); max 2 repair rounds per blocker; integration acceptance by the lead.

## 8. Routing allowlist (standing)

Authorized routes ONLY: **Muse Spark 1.3** (campaign lead) + **Jules** (designer, implementation workers, independent reviewers). Default-deny everything else. No fallback without Renpasa authorization; a blocked path reports `BLOCKED_ROUTING`.
