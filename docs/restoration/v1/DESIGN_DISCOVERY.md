# ASpot Restoration — Design Discovery (Stage B, Designer Jules)

Source: independent Designer Jules report (design-only session; the designer implemented nothing). The campaign lead adopted 4 of 5 findings and overruled 2 deferrals with written rationale in `RESTORATION_PLAN.md`.

## 1. Current user journey (as found)

1. **Initial load (`/`)**: split screen — header on top, spot list left, map right. Client fetches via `fetchSpots`; map needs `VITE_GOOGLE_MAPS_API_KEY`.
2. **Browsing**: user views spots in `SpotList`.
3. **Map interaction**: clicking a marker sets the selected spot and pans the map.
4. **Authentication**: `Login / Register` in the header opens the auth modal; credentials submitted to login/register endpoints.
5. **Add Spot**: authenticated click on `Add Spot` toggles creating-mode; the list pane swaps to the creation form.
6. **Location selection**: map click places a temporary marker and sets the new-spot location.
7. **Submission**: form fields + `createSpot` + spot reload.

## 2. Top defects (ranked by the designer)

1. **Missing mobile view** — strict `w-1/3` / `w-2/3` split unusable on small screens. Critical.
2. **Missing bidirectional hover interactivity** — hovering a card does nothing to its marker. High.
3. **Missing auto-scroll on marker click** — map pans but the list does not scroll to the card. High.
4. **Missing masonry layout** — vertical stack instead of the specified masonry/waterfall. Medium.
5. **Missing marker clustering** — all markers rendered directly; DOM-per-spot perf risk. Medium.

## 3. Recommended milestone (designer proposal)

**Bi-directional map-list interactivity + mobile layout.** A map-centric app must feel seamless: responsive stacking plus linked list-hover/map-click interactions (bounce, pan, auto-scroll) deliver the core "magic" before any data or backend features.

## 4. In-scope vs out-of-scope (designer proposal)

In-scope: responsive stacked layout; hover-to-marker emphasis; auto-scroll to card on marker click; masonry conversion.
Out-of-scope (designer view): geocoding integration; marker clustering (defer); real image upload (URL strings stay); any DB schema changes or new backend routes.

Lead deltas (with rationale — see `RESTORATION_PLAN.md`): masonry ADOPTED; clustering-deferral OVERRULED (project spec requires it); Add-Spot-coherence-drop OVERRULED (language mix, guest dead-end, and preset-location defects are real demonstrability defects on the milestone journey).

## 5. Evidence notes

Live rendering was blocked by the same credential boundary as the baseline (no Maps key, no live DB): the designer verified structure from source and recorded explicit key-blocked notes rather than faking renders. The campaign kept that discipline throughout — no synthetic map screenshots were ever presented as live evidence.

## 6. What MUST NOT change (standing constraints)

- Stack stays: React (Vite), Tailwind, React Router, Axios, Google Maps JS API, Node + Express (TypeScript), PostgreSQL.
- `pnpm` only. No `package-lock.json`.
- Backend tests mock Prisma; never connect to a real Postgres during tests.
- No `.github/workflows/` modifications in this campaign.
- No unapproved technologies; no look-ahead features beyond the milestone.
