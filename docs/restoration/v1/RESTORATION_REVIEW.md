# ASpot Restoration — Independent Review Record (Stage: INDEPENDENT_REVIEW)

Target: PR `Renpasa/ASpot#13` (integration candidate).

## Round 1 — PKG-3 config @ `e7c2efd`

- Reviewer: Independent Reviewer (Jules session; did not author the change).
- Outcome: reviewer process failure — session reached Completed with **zero posted comments**, so no usable verdict exists.
- Lead action: transparent substitute verification posted on-PR and labeled as such (`PASS_WITH_MINOR`, one cosmetic note: missing trailing newline). Substitution labeled; not presented as an independent verdict.

## Round 2 — Full restoration @ `84e50d5`

- Reviewer: Independent Reviewer (fresh Jules session; did not author the change).
- Outcome: reviewer process failure — session went idle with **no comment posted**.
- Lead action: transparent substitute verification posted on-PR and labeled as such (`PASS_WITH_MINOR` with 4 recorded minors: toast timer without cleanup, `any`-casts + eslint-disable in marker code, vacuous URL-extension check, key-blocked visual confirmation gap). Retained as advisory.

## Round 3 — Full restoration @ `84e50d5` (genuine verdict)

- Reviewer: Independent Reviewer (fresh Jules session; did not author any PR #13 code).
- Method: physical-read of base SHA, head SHA, changed files, full diff, and relevant code; build/test/lint/type-check where applicable; static/DOM flow reasoning (no live Maps key in sandbox); TODO/placeholder scan; secrets scan.
- Outcome: **PASS** — all 9 verification items confirmed with file:line citations:
  1. exact identity (base + head SHAs, 10-file target list);
  2. acceptance criteria (marker bounce/restyle, hover/focus sync, scroll-to-card, masonry, clusterer wiring, EN-only banner, guest-gated Add Spot, no preset coords + empty state, URL check, toast, mobile stack, title, dead-CSS removal, jest dist-ignore);
  3. scope compliance (workflows untouched, pnpm only, no credentials/migrations, no stray log files);
  4. engineering (reviewer ran backend install + generate + build + test and frontend install + lint + build in its sandbox);
  5. browser/user flow (static/DOM reasoning; no live key — no faked renders);
  6. regression risk (auth + modal wiring retained, empty states safe);
  7. design intent (matches project spec);
  8. false-completion scan (clean);
  9. security/secrets scan (clean).
- Transport: the reviewer session emitted its verdict as a file artifact; the lead transported it verbatim onto the PR (one precision note appended: the reviewer's sandbox log showed stale-`dist` failures because its checkout predated the jest dist-ignore landing — on the true candidate HEAD with the ignore in place, default `pnpm test` is 4/4 PASS, lead-verified).
- Precision note: a stray sandbox log file the reviewer session emitted was deleted locally and never committed; it is not part of the candidate.

## Standing rule derived (permanent habit)

A reviewer session is not complete until a usable verdict exists. Silence, timeout, idle state, or `Completed` with no verdict is NOT review completion — auto-replace the reviewer within the repair budget. The final reviewer must evaluate the exact final HEAD (see v1.1: fresh review required after cleanup + artifact commits).
