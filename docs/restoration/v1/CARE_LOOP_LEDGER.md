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
