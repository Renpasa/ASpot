# ASpot Restoration — Before → After Benchmark + Handoff (Stage: DELTA_REPORT)

Campaign: `Renpasa/ASpot#12` — Restoration Campaign v1
Lead: Muse Spark 1.3 (only Jules + lead acted; see routing below)

## 1. Endpoints

- Baseline SHA: `4965bb82f1d8e081896fd0daba5c81cdc9e16a07` (`main`, preserved — `main` untouched, all work on branches)
- Integration candidate: PR `Renpasa/ASpot#13` (branch `restoration/pkg-3-test-hygiene`; v1.1 cleanup + durable artifacts advance the head — exact final SHA recorded in the handoff)
- Milestone: "Make the browse → inspect → map interaction → Add Spot journey feel complete and demonstrable on desktop and mobile."
- Artifacts: this directory (`docs/restoration/v1/`) — baseline, design discovery, plan, review record, this report

## 2. Before → After delta

### Product experience

| Dimension | Before (frozen) | After (candidate, verified) |
|---|---|---|
| Card → map link | Pan only, markers identical | Pan + distinct selected/hover marker states + bounce |
| Map → card link | Silent state set, card hunt | Scroll-into-view + highlight; keyboard-focus path included |
| Hover sync | None | Card hover/focus emphasizes marker (scale + color) |
| Clustering | None (spec MUST violated) | `MarkerClusterer` via marker library wired; **not visually exercisable** (no key) — code + build evidence only |
| Masonry | Vertical stack | CSS-columns masonry (`columns-1 sm:2 xl:3`, `break-inside-avoid`) |
| Add Spot language | Non-English banner mid-English flow | English-only |
| Guest Add Spot | No affordance (button hidden) | Disabled gated button with login tooltip; opens login modal (browser-verified) |
| Default location | Hardcoded Taipei preset | Explicit pick-a-point empty state; save disabled until click |
| Photo URL | `type=url` only | Inline validation + error (v1.1: scheme check tightened to require `http://`/`https://`) |
| Success feedback | None | Success toast + list reload (v1.1: timer lifecycle cleaned up) |
| Mobile 390px | Fixed split squeezes | Stacked layout (map top, list bottom), header intact (screenshot-verified) |
| Desktop split-screen | `w-1/3 + w-2/3` | Preserved at `md:` breakpoint |
| Title / dead CSS | Generic `<title>`, 185-line dead `App.css` | Product title (tab-verified), dead CSS removed |
| Auth flow | Working | Untouched, no regression (modal path browser-verified) |
| Live-map proof | Blocked (no key) | Still blocked (no key, no spend) — comparable conditions + DOM evidence, never faked |

### Functional completeness

Before ≈ 3 Working / 6 Partial / 4 Missing → After ≈ 4 Working (auth, seed, health, default `pnpm test`) / 8 Partial-or-better (all six journey slices improved; map-visual paths key-blocked) / 2 still Missing (search/filter, edit-delete UI — both explicitly out of scope). Browse, inspect, guest-gate, and add-spot-form flows complete to the credential boundary; marker-bounce/cluster paths are code-complete but visually unconfirmed.

### Engineering quality

| Check | Before | After |
|---|---|---|
| Backend install/build | PASS (post-generate) | Unchanged PASS |
| Backend `pnpm test` (default) | 4/8 fail (stale `dist/` doubles) | **4/4 PASS** (1 suite; unconditional via `pretest` step) |
| Frontend lint | Clean | Clean |
| Frontend build | PASS (75 modules) | PASS (80 modules) |
| CI on PR head | n/a | Green both jobs |
| Coverage / backend lint / frontend tests | Missing | Still missing (out of scope, explicit) |

## 3. What improved / did NOT improve

Improved: marker states + bounce wiring, bidirectional card↔marker sync, clustering wiring, masonry, EN-only flow, guest affordance, no fake default, URL check, success toast, mobile stacking, title, dead-CSS removal, default `pnpm test` 4/4.
Did NOT improve: live-map visual confirmation (key-blocked both sides), search/filter, spot detail view, edit/delete UI, photo upload, auth UX, coverage, backend lint, frontend tests, CI scope (workflows intentionally untouched).

## 4. v1.1 hardening (acceptance-debt closure)

- PR #13 metadata rewritten to describe the full restoration (baseline, head, milestone, product changes, validation, limitations, reviewer status, safety status) instead of the original one-line jest-config text.
- Sanitized durable artifacts published under `docs/restoration/v1/` (this directory) after the public-repo sanitization gate.
- Bounded surgical cleanup by an implementation worker (toast timer lifecycle, marker-type casts, URL-scheme check, trailing newlines) — no redesign, no new features, no workflow edits.
- Runtime validation without spend: no Maps key provisioned (limitation retained honestly); synthetic local DB end-to-end SUCCEEDED — ephemeral Postgres 15 via existing `docker-compose` image, `prisma db push` from committed schema, candidate backend run locally, full register → login → create → list → delete cycle green over HTTP with synthetic-only data (see §7 item 2 for the step table).

## 5. Orchestration problems encountered (workflow experiment data)

1. **Workers Completed without opening PRs (×2 in v1).** Sessions reached `Completed` with retrievable diffs but no branch/PR; the lead integrated manually. Standing fix: worker completion requires base SHA + branch + commit SHA + pushed-branch proof + PR URL (see delivery contract in the handoff report to Renpasa).
2. **Reviewers lapsed without verdicts (×2 in v1).** No-comment Completed / idle is NOT review completion — auto-replace within budget (round 3 delivered the genuine PASS).
3. **Worker branched from the wrong base (v1 PKG-2).** Standing fix: worker echoes `git rev-parse HEAD` first; base mismatch = stop.
4. **Local-only artifacts invisible to Jules.** Standing fix: commit orchestration docs to the working branch or inline context in prompts.
5. **Opaque long Planning states.** Standing fix: require WIP pushes as heartbeat.
6. **`remote pull --apply` brittle on rebased trees.** Keep frontend-only patch extraction + `git apply --check` as fallback.

## 6. Routing compliance

Allowed: Muse Spark 1.3 + Jules only. Used: lead direct tool calls + Jules CLI sessions (designer, 2× v1 workers, v1 reviewers, v1.1 worker, v1.1 reviewer). Zero non-Jules subagents. Unauthorized routing attempts: none. Paid fallback calls: **0**. No Maps key provisioned; no paid resource created.

## 7. Runtime proof + remaining limitations

Synthetic DB end-to-end (ephemeral Postgres 15, existing repo tooling, zero spend, synthetic-only data, values never published): `/health` 200 → register 201 → login 200 (JWT) → `GET /api/spots` 200 (0 rows) → `POST /api/spots` 201 (synthetic spot persisted) → `GET` confirms 1 row with the synthetic title → `DELETE` 204 → final `GET` 0 rows. The persistence substrate behind Add Spot is proven live; the frontend click-path remains key-blocked (no Maps key).

Remaining limitations (explicit):
1. No live-map visual proof (no key, no spend) — marker bounce/cluster/masonry-at-scale visually unconfirmed; DOM/code/build evidence only.
2. v1 workers never opened PRs — v1 integration is lead-assembled (traceable via session roles + patch files, not worker branches). v1.1 enforces the worker delivery contract.
3. Coverage / backend lint / frontend tests / CI test scope still missing (pre-existing, out of scope).

Merge decision is Renpasa-only. The candidate is recommended for merge once the final handoff confirms: PR metadata accurate, durable artifacts published, cleanup complete (or remaining minors explicitly accepted), fresh independent review of the exact final HEAD with no unresolved blocker, CI green, routing clean, sanitization passed, and Maps/DB limitations stated without fake proof.
