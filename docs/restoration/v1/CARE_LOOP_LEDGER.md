# Care Loop Ledger — Cycle 1 (post-restoration)

Authoritative main at cycle start: `3de915b2392da964f316db75d87a8e38a0a68f6a` (re-verified 2026-09-16, no drift).
Inputs: Night Watch harvest + late Scout C2 addendum (authoritative, not re-run).
Human triage decision (2026-09-16): **Bundle B APPROVE · Bundle D APPROVE · Bundle A APPROVE · Bundle C APPROVE**. Order accepted: B → D → A → C.

## Candidate states

| ID | Title | Kind | NW rec | Human | Current | Bundle | Evidence (re-validated at cycle SHA) |
|----|-------|------|--------|-------|---------|--------|--------------------------------------|
| P1 | Photo-URL rule rejects own seed images; backend enforces nothing | DEFECT+RISK | PROMOTE | APPROVE | PROMOTED (Issue A) | A standalone | `CreateSpotForm.tsx:38` ext-regex; seed Unsplash + picsum URLs fail it (executed); `spot.controller.ts:77-78` checks `!photo_url` only |
| P2 | Markers vanish in Add Spot mode | DEFECT | PROMOTE | APPROVE | PROMOTED (Issue C) | C standalone | `MapPage.tsx:161` unmounts markers; `MarkersWithClustering.tsx:88-91` creation-click guard exists → safe to keep mounted |
| P3 | Auth transitions strand users (intent loss + register trap + token desync + logout edge) | DEFECT | PROMOTE | APPROVE | PROMOTED (Issue D) | D standalone | `api/client.ts` 0 response interceptors; `AuthModal.tsx:38-50` chained register→login; intent discarded; logout leaves creating-mode |
| P4 | CI never runs tests; frontend zero tests | RISK | PROMOTE | APPROVE | PROMOTED (Issue B) | B with P5+P6 | `main.yml` 0 test steps (grep); frontend scripts lack test runner |
| P5 | JWT falls back to published 'fallback_secret' | RISK | PROMOTE | APPROVE | PROMOTED (Issue B) | B with P4+P6 | `auth.controller.ts:6` + `auth.middleware.ts:4` both `\|\| 'fallback_secret'` |
| P6 | Fresh-clone `pnpm test` needs generate; report omits precondition | DEFECT (docs) | PROMOTE | APPROVE | PROMOTED (Issue B) | B with P4+P5 | `backend/package.json` `"test":"jest"` no pretest; test imports PrismaClient type; report table no footnote |
| W1 | Unbounded /spots + per-hover marker DOM churn | RISK | WATCH | (keep) | WATCH carried fwd | — | `spot.controller.ts` `whereClause={}`; rebuild loop per hover |
| W2 | Marker→list hover missing | OPPORTUNITY | WATCH | (keep) | WATCH carried fwd | — | markers click-only |
| W3 | Empty state has no CTA | IDEA | WATCH | (keep) | WATCH carried fwd | — | `SpotList.tsx:24` bare text |
| W4 | Stale PR11 on phantom base; process contracts undocumented | RISK (process) | WATCH | (keep) | WATCH carried fwd | close/rebase PR11 alongside Issue B | PR11 open, non-main base |
| W5 | Keyless Maps visual-validation story | OPPORTUNITY | WATCH | (keep) | WATCH carried fwd | — | key-blocked disclosed; mock-server proposal unevaluated |

## Prior adjudications (upheld, not reintroduced)

- **R1** ("long-click reverse-geocode is missing core requirement"): REJECT — zero basis in `Agent.md`; geocoding explicitly out-of-scope in designer record.
- **C2-5 framing** ("Round-3 reviewer masked failure via dirty sandbox"): REJECT as framed — generate step disclosed in `RESTORATION_REVIEW.md:25`, matches CI. Residual action = P6 footnote only.

## Promotion rationale

- Issue B (P4+P5+P6): same backend-trust surface, same validation (CI green + fresh-clone test). Trust first.
- Issue D (P3): testable user journey without Maps key.
- Issue A (P1): form + API mirror rule, one outcome.
- Issue C (P2): map-surface fix, key-blocked visual validation → last.
- W-candidates stay unfiled. No WATCH/REJECT/unapproved candidate in any promoted scope.

## Issue numbers (filled at promotion)

- Issue A (P1): #16
- Issue B (P4+P5+P6): #14
- Issue C (P2): #17
- Issue D (P3): #15

## Execution log

- 2026-09-16: ledger created, evidence re-validated, promotion queued B → D → A → C.
- 2026-09-16: issues created: B=#14, D=#15, A=#16, C=#17. Workers dispatched (B=2126810452645194642, D=5639755111037489047, A=9600567646348918887, C=15573954101716678106). Diffs transported by lead (D minus scratch file; B pin-revert).
- 2026-09-16: PRs opened: #18 (B @32e8004), #19 (D @9633442), #20 (A @4e3acda), #21 (C @e8c8ea4). CI: #19/#20/#21 green; #18 failed once on worker-incidental prisma pin (ERR_PNPM_OUTDATED_LOCKFILE) → lead fix d55e11d (caret restore) → CI green.
- 2026-09-16: first-round reviewers (18204222877308629857, 4139048637399719971, 13078925275102144476, 12272474830464733233) went silent (no PR verdicts; pulls show work-artifacts only) → replaced per standing rule. Replacements: B2=290052180312065388, D2=5311018638449427784, A2=1009275715880529514, C2=7810119644038351947 — B2/D2/A2 silent; C2 delivered verdict-issue-17.md PASS (head e8c8ea4).
- 2026-09-16: integration preview branch care-loop/integration-BD built (ffedce8+67b81dc+20e2001+1275a97 merges + 1cf6378 harmonization: JWT test signing, no fallback remains). Zero merge conflicts across all four slices. Integration reviewer 2273917116698240511 delivered verdict-integration.md PASS at exact HEAD 1cf6378 (18 files, 6/6 tests, tsc/lint/build, JWT-refusal, sanitization).
- Per-PR verdicts outstanding (B/D/A silent rounds); integration verdict covers the composed final state. Merge order recommendation: sequential #18 → #19 → #20 → #21 (rebase each onto new main), or single squash of integration-BD — Renpasa decides.
- 2026-09-16: issues created: B=#14, D=#15, A=#16, C=#17.
- 2026-09-17: canonical integration PR #22 opened from `care-loop/integration-BD` (base `main`) at `8b71bac08b9abbb32005dbb7d8e4227fa6efdee7` (= `1cf6378` code + docs-only ledger, verified `git diff 1cf6378..8b71bac --stat` = 1 file +51). PR body records baseline `3de915b`, issues #14-#17, source PRs #18-#21, validation, Maps limitation, routing/paid-fallback, sanitization, worker + reviewer debt. CI on #22: backend-checks + frontend-checks SUCCESS at `8b71bac`, mergeable CLEAN.
- 2026-09-17: PR #18 body repaired — validation HEAD corrected `32e8004`→`d55e11d` (pre-fix superseded note; validation re-run on `d55e11d`, Actions green) + Review-status debt section (0 reviews/0 comments; no per-PR verdict; acceptance lives in #22, not in worker/lead validation text).
- 2026-09-17: final-head re-check (Jules `2132994969651568427`) delivered `verdict-final-head.md` **PASS** at exact HEAD `8b71bac`: docs-only delta `1cf6378..8b71bac` confirmed (1 file), ledger accuracy confirmed, NO code changed, no secrets in `origin/main...HEAD`, prior engineering PASS at `1cf6378` (6/6 tests, tsc, lint, build, JWT-refusal) remains applicable (markdown-only delta). First final-head session `12086418212513070409` silent (no verdict file; `pull` = no diff).
- Reviewer-silence totals: per-PR rounds 7 silent (first-round `18204222877308629857,4139048637399719971,13078925275102144476,12272474830464733233` + replacements B2 `290052180312065388`/D2 `5311018638449427784`/A2 `1009275715880529514`); delivered per-PR verdicts: 1 (C2 `7810119644038351947` PASS for #21). Integration: 1 PASS (`2273917116698240511` at `1cf6378`). Final-head: 1 silent + 1 PASS. Reviewer sessions total 10; verdicts delivered 3.
- Worker-delivery debt (unchanged): all 4 worker diffs transported by lead onto PR branches (B `2126810452645194642` pin-revert + lead CI fix `d55e11d`; D `5639755111037489047` scratch `test_interceptor.cjs` excluded; A `9600567646348918887` verbatim; C `15573954101716678106` verbatim). No `Completed`-only delivery counted without a real diff.
- Chosen merge strategy: **SINGLE canonical merge of PR #22** (supersedes earlier sequential #18→#19→#20→#21 option). Do NOT merge — Renpasa-only. After merge: `POST_MERGE_BASELINE -> NIGHT_WATCH`.

## POST_MERGE_BASELINE (Cycle 1 -> Cycle 2)

- Previous cycle baseline: `3de915b2392da964f316db75d87a8e38a0a68f6a`.
- Merged canonical PR: #22 (`care-loop/integration-BD` -> `main`), head `a4eba097427ff831354046b3ed5e1953fbe18f97` (= reviewed code `1cf6378` + ledger-only +57).
- Merge commit: `d28503e13cd0378d79cc268d2e84afbbb502fe78` (merged 2026-09-16T18:26:23Z by Renpasa). Merge diff `a4eba09..d28503e` empty (merge equals branch HEAD).
- New authoritative main SHA (frozen): `d28503e13cd0378d79cc268d2e84afbbb502fe78` (local `main` == `origin/main`; tracked tree clean after health checks).
- Closed by merge: issues #14 (B), #15 (D), #16 (A), #17 (C); source PRs #18-#21 remain merged-via-integration (supserseded by #22, not individually merged).
- P1-P6 status at new baseline (completed/implemented, do NOT re-promote without regression evidence):
  - P1 (photo-URL rule + backend 400): IMPLEMENTED (`frontend/src/utils/validation.util.ts` + `backend/src/utils/validation.util.ts` mirrored; controller 400s; 6 tests).
  - P2 (markers visible while creating): IMPLEMENTED (`MapPage.tsx:182` mounted unconditionally + stopPropagation guard).
  - P3 (auth resilience): IMPLEMENTED (`pendingAction` intent, register-trap copy, 401/403 interceptor + `auth:unauthorized`, logout-exit effect).
  - P4 (CI runs tests): IMPLEMENTED (`main.yml` `Test` step; CI green on #22 at `a4eba09`).
  - P5 (JWT fail-fast, no fallback): IMPLEMENTED (FATAL guards; zero `fallback_secret` in src).
  - P6 (pretest + report footnote): IMPLEMENTED (`pretest: prisma generate`; report footnote present).
- W1-W5 carried forward UNCHANGED (merge did not materially affect their evidence; re-verified at `d28503e`):
  - W1 unbounded `/spots` + per-hover marker churn: still `whereClause={}` default; no pagination/virtualization added.
  - W2 marker->list hover missing: still click-only.
  - W3 empty state no CTA: still bare `No photo spots available yet.` text.
  - W4 stale PR11 on phantom base: still OPEN (`test-backend-spots-...` -> `test-backend-spots-...`, non-main base).
  - W5 keyless Maps visual-validation story: still key-blocked; mock-server proposal unevaluated.
- Prior adjudication memory (upheld): R1 REJECT (no long-click reverse-geocode requirement in `Agent.md`); C2-5 framing REJECT as framed (generate step was disclosed; residual P6 footnote done).
- Cycle 1 process debt as learning (NOT active product defects): worker diffs transported by lead (4/4; B pin-revert + lead CI fix `d55e11d`; D scratch excluded); reviewer silence 8 sessions silent / 3 verdict files delivered (C2 per-PR PASS, integration PASS, 2 final-head/ledger PASSes); per-PR #18/#19/#20 verdicts outstanding by design (integration PASS covered composition); PR18 stale-SHA repaired (`32e8004`->`d55e11d` + debt section); single-canonical-merge strategy chosen over sequential rebases.
- Post-merge health at `d28503e` (lead-run, bounded): backend `pnpm test` 6/6 (prisma cache cleared, no `JWT_SECRET`); `tsc` clean; boot-without-secret `BOOT-REFUSED: FATAL: JWT_SECRET...`; frontend `lint` + `build` clean; CI YAML parses; working tree tracked-clean after artifact removal.
- Baseline frozen: new Night Watch Cycle 2 runs against `d28503e`. Do NOT rediscover/re-promote P1-P6 without new regression evidence. Night Watch advisory-only.

## NIGHT_WATCH Cycle 2 — Harvest (baseline `90a262c`)

- Scouts (Jules, advisory-only, file-output via `pull`): A Product/UX `10205573458787866393` DELIVERED (`scout-cycle2-product.md`); B QA/Adversarial `6881220033557325180` DELIVERED (`scout-cycle2-qa.md`); C Engineering `10296022288999752404` DELIVERED (`scout-cycle2-engineering.md`); D Process QA `11391464838284788387` DELIVERED (`scout-cycle2-process.md`, plus scratch `check_*.sh`/`fetch_*.sh` work-files in its VM — not merged).
- Regression verdict (all scouts + lead spot-check): **NO P1-P6 REGRESSION** at `90a262c`. Cycle 1 fixes intact (URL rule, markers, auth, CI test step, JWT fail-fast, pretest).
- W-status re-confirmed: W1/W2/W3/W5 STILL HOLD (A + C agree with fresh file:line); W4 STILL OPEN (PR11 phantom base, lead-verified via API).
- Nomination table (deduped by lead; C1 rejected per adjudication memory; process items triaged separately):
  - N1 (from A-C2, OPPORTUNITY/a11y): AuthModal no backdrop/Escape dismiss — `AuthModal.tsx:78-83` bare overlay + X-only close. Small, keyless-testable.
  - N2 (from A-C4 + B-C2-001, DEFECT): coordinate validation gaps — no range checks (A-C4, `spot.controller.ts:60-63` region) + `parseFloat` NaN → Prisma 500 on `POST/PUT /api/spots` (B-C2-001). One outcome: 400 on bad coords.
  - N3 (from B-C2-002, DEFECT): `isValidImageUrl` bypass — no-extension path `return true` accepts `malicious.php/`, `?query`, fragments (`validation.util.ts`, both copies). Tighten rule without rejecting seed/Unsplash shapes (needs care).
  - N4 (from B-C2-003, RISK): whitespace-only title passes `!title` check — trim validation frontend + backend.
  - N5 (from A-C3 + W1-evolution, RISK/perf): frontend never sends map bounds to `/spots` (`client.ts:37`, `MapPage.tsx:42`) though backend supports bbox — wire viewport fetch or scope explicitly.
  - N6 (from C-P9 + B-coverage, DEFECT/coverage): `updateSpot`/`deleteSpot`/`getSpot` routes exist (`spot.routes.ts`) but frontend `client.ts` has no update/delete fns and tests cover none of the three (suite = 6 tests, grep 0 for update/delete/getSpot). Wire or scope + tests.
  - N7 (from C-P7, RISK): frontend completely testless — no `test` script, no CI step. Process decision carried (deferred in Cycle 1 by design); re-nominate only if Human wants it now.
  - N8 (from C-P8, RISK): Prisma `^5.22.0` drift (8.x RC available) + pnpm warnings — keep WATCH unless Human wants upgrade risk now.
  - REJECTED: A-C1 long-click/geocoding DEFECT claim — repeats R1 (REJECT, upheld): zero basis in `Agent.md`; `DESIGN_DISCOVERY.md:30` explicitly out-of-scope (geocoding). Not a regression, not new evidence. Do NOT re-nominate without Human overturning R1.
  - PROCESS (from D, lead-adjudicated): PR-STATE-MISMATCH claim is GitHub-UI artifact, NOT a real defect — proven single merge: first-parent `main` = `90a262c -> d28503e(#22) -> 3de915b`; `ffedce8/67b81dc/20e2001/1275a97` are intra-branch integration merges on `care-loop/integration-BD` (parents `3de915b+d55e11d`, etc.), NOT merges into `main`. GitHub auto-marks same-head PRs merged (all 5 closed by one push; #22 merged 18:26:23Z, #18-21 auto-closed 18:26:25Z). Ledger wording stands with this clarification appended. STALE-BRANCHES: 5 `care-loop/*` remote branches remain (lead-counted) — Human/lead may delete post-triage; harmless. PR11-PHANTOM-BASE = W4 (unchanged).
- Lead verification (new-claim grounding at `90a262c`): NaN path confirmed (`parseFloat(lat)` unchecked, `spot.controller.ts` create + update paths); URL bypass confirmed (`match /\.([a-z0-9]+)$/` + `return true` no-ext fallthrough, both copies); whitespace-title confirmed (`!title` only); AuthModal overlay confirmed (no backdrop/Escape handler); bounds-wiring confirmed (`fetchSpots()` argless, routes support bbox); update/delete-client gap confirmed (routes map PUT/DELETE, client exports only fetch/create); frontend-testless confirmed (no `test` script); PR11 open phantom-base confirmed; branch count 5.
- Proposed triage for Human (advisory; NO promotion yet): PROMOTE bundle Q1 = N2+N3+N4 (input-integrity hardening, one outcome, backend+rule tests) first; D bundle Q2 = N1+N5+N6 (UX + viewport + client parity) second; WATCH N7/N8 + W1-W5; REJECT A-C1 (R1 stands) + PR-STATE-MISMATCH (artifact, clarified).
- Routing: Muse Spark 1.3 + Jules scouts only. Paid fallback 0. No keys/secrets involved. Scout reports pulled via `jules remote pull` (durable file-output); B session additionally emitted a stray `backend/package-lock.json` work-file in its VM (npm artifact, NOT merged, ignored).

## Cycle 2 — Human triage (2026-09-17, authoritative)

- Human decision: **Q1 (N2+N3+N4) APPROVE as one coherent input-integrity hardening issue. N1 APPROVE as its own small UX/accessibility issue. N5 WATCH. N6 PRODUCT_DECISION/REFRAME before promotion (split engineering coverage risk vs product capability parity; missing frontend update/delete is NOT a defect unless product intent requires those flows). N7 WATCH. N8 WATCH. W1-W5 continue WATCH unless materially new evidence appears. Existing rejected/adjudicated items remain rejected.**
- Stale `care-loop/*` branches: bounded routine cleanup allowed only after physically verifying fully merged/superseded with no unique unmerged work.
- PR11 stays under W4; do NOT mix into approved product issues unless disposition becomes necessary for execution.
- Autonomy grant: update ledger → promote approved only → execute queue → Jules workers with durable delivery evidence → independent exact-head review → bounded repair → preserve Muse Spark 1.3 + Jules-only routing, zero implicit paid fallback, public-repo sanitization → stop only at EXTERNAL_ACCEPTANCE_READY. No merge (Renpasa-only). Return only at genuine Human authority blocker or EXTERNAL_ACCEPTANCE_READY.

## Cycle 2 Promotion (approved only)

- Issue Q1 (N2+N3+N4): input-integrity hardening — coordinate range + NaN → 400 on POST/PUT, `isValidImageUrl` no-extension bypass tightening without rejecting seed/Unsplash shapes, whitespace-only title trim rejection frontend + backend. Numbers to be filled at creation. → **#23** (created 2026-09-17, base `12d3e34`).
- Issue N1: AuthModal dismiss UX — backdrop click + Escape to close, focus-safe, keyless-testable. Number to be filled at creation. → **#24** (created 2026-09-17, base `12d3e34`).
- Explicitly NOT promoted: N5 (WATCH), N6 (PRODUCT_DECISION/REFRAME pending — coverage vs capability split recorded, no issue), N7 (WATCH), N8 (WATCH), W1-W5 (WATCH), R1/A-C1 + PR-STATE-MISMATCH (REJECT, upheld).
- N6 reframe note (binding): (1) engineering coverage risk for existing get/update/delete backend routes is a test-scope question; (2) product capability parity / whether edit-delete UI is intended now is a product-intent question. Worker prompts MUST NOT frame missing frontend update/delete as a defect.

## Cycle 2 Execution log (append-only)

- 2026-09-17: ledger updated with Human triage above. Baseline for execution: `12d3e34a5510e792c24fb686da321de31703b070` (main, verified; Cycle 2 harvest docs committed).
- 2026-09-17: issues created: Q1=#23, N1=#24 (both base `12d3e34`, HUMAN-APPROVED only; N5/N7/N8/W1-W5 = WATCH, N6 = PRODUCT_DECISION pending, no issue).
- 2026-09-17: workers dispatched (Jules, parallel, non-overlapping surfaces): Q1=`17841990999953742107` (branch `care-loop/issue-23-input-integrity`), N1=`10849194862403129889` (branch `care-loop/issue-24-authmodal-dismiss`). Both instructed: rev-parse HEAD check, WIP heartbeat push, commit in-session, push branch + open PR, PR URL as completion proof. Lead polls session status + `gh pr list` + `git ls-remote` (Completed without PR URL = FAILED delivery, lead transports).
- 2026-09-17: both workers Completed WITHOUT pushing branches or opening PRs (repeat of Cycle 1 debt pattern; `git ls-remote` confirms no `issue-23`/`issue-24` remote branches from workers). Diffs transported by lead via `jules remote pull` (durable file-output: Q1 5 files/329 lines, N1 1 file/46 lines), applied with `git apply --check`, validated, committed, pushed, PRs opened by lead: #25 (Q1 @`b9f3981`, 5 files) + #26 (N1 @`7858491`, 1 file). No worker diff counted without a real pulled diff.
- 2026-09-17: integration branch `care-loop/integration-Q1N1` built from `12d3e34`: merge Q1 (`a45ad55`) + merge N1 (`41ec137`), zero conflicts (non-overlapping surfaces). Lead validation at integration HEAD: backend `pnpm test` 12/12, `tsc` clean, frontend `build` + `lint` clean. Forbidden-surface check clean (no workflows, no package-lock, no secrets, no migrations, mock Prisma only, pnpm only).
- Worker-delivery debt (Cycle 2): 2/2 diffs transported by lead (Q1 verbatim incl. verbose comments + trailing-whitespace warnings; N1 verbatim incl. 2 trailing-whitespace warnings). No `Completed`-only delivery counted without a pulled diff.
- 2026-09-17: independent exact-head review of canonical #27 @`f4948ae` by Jules `7434339470569884410` → **PASS** (all 8 lanes, file:line citations, engineering transcripts: backend 12/12 + tsc, frontend build + lint). Verdict transported verbatim to PR #27 by lead. CI on #27 head green (backend-checks + frontend-checks), MERGEABLE. Repair rounds: 0. Cycle 2 reached EXTERNAL_ACCEPTANCE_READY (no merge by agent).

## POST_MERGE_BASELINE (2026-09-17, after Renpasa merges #27)

- New authoritative `main`: **`71d9d47f1874ae1d057bc5f29b0bf2e341643697`** (merge commit: `Merge pull request #27 from Renpasa/care-loop/integration-Q1N1`, parents `12d3e34` + `f4948ae`, merger Renpasa, 2026-09-17T08:56:47Z). Physically read: `git rev-parse HEAD` = `71d9d47`, first-parent chain intact, 7 files / 268 ins / 17 del in merge.
- PR #27 recorded: base `12d3e34`, head `f4948ae`, fixes #23 + fixes #24, CI green, independent PASS, MERGED (no agent merge; Renpasa-only).
- Q1 (N2+N3+N4) + N1: **IMPLEMENTED** at `71d9d47` (backend suite now 12 tests; AuthModal dismiss live).
- Carried WATCH (merge changes none of their evidence): N5 (bounds wiring), N7 (frontend testless, deferred by design), N8 (Prisma drift), W1-W5.
- N6 split preserved (PRODUCT_DECISION, NOT a defect): (a) engineering coverage risk for get/update/delete backend routes = test-scope question; (b) edit-delete UI intent = product-intent question. Neither silently convertible to DEFECT.
- REJECT memory preserved: R1/A-C1 (geocoding, zero basis) + PR-STATE-MISMATCH (GitHub-UI artifact, proven single merge) stay rejected.
- Worker-delivery debt (Cycles 1+2: Completed-without-push/PR, lead-transported diffs) preserved as PROCESS LEARNING, not an active product defect. Cycle 2 reviewer lane improved (verdict file delivered first try).
- Cycle 2 CLOSED. Do NOT reopen. Next: NIGHT_WATCH Cycle 3 (advisory-only).

## Night Watch Cycle 3 — dispatch (2026-09-17, advisory-only)

- Baseline: `71d9d47`. Scouts: Product/UX, QA/Adversarial, Maintainer/Engineering (Jules, read-only; NO product-code modification, NO implementation PRs, NO promotion before Human Triage). Process QA lane on standby (use only if scouting needs it).
- Rules: deduplicate against this ledger; precision over volume; small number of physically evidenced candidates (file:line) with kind (DEFECT/RISK/OPPORTUNITY/IDEA), confidence/impact/effort/risk, PROMOTE/WATCH/PRODUCT_DECISION/REJECT recommendation, scout provenance. Routing: Muse Spark 1.3 + Jules only, zero paid fallback, sanitized.

## Night Watch Cycle 3 — harvest + lead verification (2026-09-17, advisory-only, NOTHING promoted)

- Lead regression at `cac75e9` (product code = `71d9d47`): backend `pnpm test` **12/12 PASS** + `tsc` clean; frontend `build` + `lint` clean. Scout QA independently reproduced 12/12 PASS. **Regression verdict: PASS** — Q1/N1 live, no regressions.
- Scouts (Jules, read-only; harvest files pulled durably via `jules remote pull`):
  - Product/UX `5704129415944771628` → Completed, `harvest-product-ux.md`: P-C3-001..004.
  - Maintainer/Eng `18292797227389972271` → harvest `harvest-maintainer-eng.md` pulled (session status blank, file delivered): M-C3-001..004.
  - QA/Adversarial first session `14778220756726253826` → idle 30m+, no harvest (delivery debt pattern again); replacement `16949928640458347565` → Completed, `harvest-qa-adversarial.md`: regression PASS + Q-C3-001..004.
- Lead physical verification (all confirmed): P-C3-001 (`MapPage.tsx:40-45,92-96,207-210` — `onClose` never clears `pendingAction`, later login forces creation mode; N1×P3 interaction); P-C3-002 (`MapPage.tsx:165-169` banner stays after pick); P-C3-003 (`AuthModal.tsx:95-107` no trap/autofocus); Q-C3-001 (node proof: `.php%2f`→true, `.php.`→true, legit shapes pass); Q-C3-002 (`spot.controller.ts:79-85,107` array title passes guards → Prisma 500); Q-C3-004 (AuthModal dismiss during `loading` unguarded); M-C3-004 (`spot.controller.ts:12-23` GET bbox unchecked; unreachable via app today — frontend never sends bounds, N5-related); P-C3-004 (no preview, `CreateSpotForm.tsx:96-107`).
- Dedup: all 11 new IDs absent from ledger; M-C3-003 is N6-coverage quantification (stays under N6 PRODUCT_DECISION, no new ID); M-C3-002 folds into next touching diff (no standalone issue); P-C3-003 complements (not repeats) N1.
- Advisory bundles for Human: R1 = P-C3-001+P-C3-002+P-C3-003 (frontend UX completion, PROMOTE); R2 = Q-C3-001+Q-C3-002+M-C3-004 (backend validation parity, PROMOTE); PRODUCT_DECISION: P-C3-004 (preview), Q-C3-004 (dismiss-during-loading); WATCH: Q-C3-003, M-C3-001, M-C3-002.
- No product code modified, no PRs, no promotion. Routing: Muse Spark 1.3 + Jules scouts only (4 sessions: 3 harvests + 1 idle-no-delivery). Paid fallback 0. Sanitized. Cycle 3 at HUMAN_TRIAGE.

## Cycle 3 — Human triage (2026-09-17, authoritative)

- Human decision: **R1 APPROVE (P-C3-001 + P-C3-002) as one creation-flow state-correctness issue, conditional: promote together only if implementation evidence confirms they share the same creation-state lifecycle/outcome. R2 APPROVE reframed (Q-C3-001 + Q-C3-002 + Q-C3-003) as one coherent validation outcome: malformed or effectively-empty user input must fail predictably at the API boundary instead of bypassing validation or reaching Prisma. M-C3-004 explicitly EXCLUDED from R2.**
- SEPARATE/WATCH (do NOT implement): P-C3-003 AuthModal focus trap = WATCH as accessibility opportunity (standalone bounded issue only if truly tiny and isolated); M-C3-004 GET bbox = WATCH with N5 (frontend does not use bbox path; do not promote a dormant API concern to enlarge the bundle); Q-C3-004 dismiss-during-inflight-auth = WATCH unless concrete evidence of user-visible incorrect state, duplicate action, or credential/auth corruption; M-C3-001 rule-mirroring = WATCH as architectural/process risk (no refactor for hypothetical drift).
- P-C3-004 image preview = PRODUCT_DECISION/WATCH — do NOT implement without product approval.
- M-C3-002 verbose worker comments = REJECT as standalone implementation work; process/style learning only.
- Keep: N5/N7/N8/W1–W5 = WATCH; N6 = PRODUCT_DECISION split (unchanged); all previous REJECT/adjudication memory unchanged (R1/A-C1, PR-STATE-MISMATCH, M-C3-003-under-N6).
- Autonomy grant: ledger → promote approved only → execute → Jules workers with durable delivery evidence → independent exact-head review → bounded repair → single canonical candidate → EXTERNAL_ACCEPTANCE_READY. No merge (Renpasa-only). Routine execution decisions autonomous; return only at genuine Human authority blocker or EXTERNAL_ACCEPTANCE_READY. Routing: Muse Spark 1.3 + Jules only. Paid fallback 0. Public-repo sanitization + exact-head review preserved.

## Cycle 3 Promotion (approved only)

- Issue R1 (P-C3-001 + P-C3-002): creation-flow state correctness — clear stale `pendingAction` on AuthModal dismiss (no forced creation mode on later login) + hide selection banner once a point is picked; one shared creation-state lifecycle/outcome. Number to be filled at creation.
- Issue R2 (Q-C3-001 + Q-C3-002 + Q-C3-003): input-validation hardening — encoded/trailing-dot URL bypass rejected, non-string title → predictable 400 (never Prisma 500), zero-width/invisible-only title treated as empty; malformed or effectively-empty input fails predictably at the API boundary. Numbers to be filled at creation.
- Explicitly NOT promoted: P-C3-003 (WATCH), M-C3-004 (WATCH with N5), P-C3-004 (PRODUCT_DECISION/WATCH), Q-C3-004 (WATCH), M-C3-001 (WATCH), M-C3-002 (REJECT standalone), N5/N7/N8/W1–W5 (WATCH), N6 (PRODUCT_DECISION split), all prior REJECTs.
