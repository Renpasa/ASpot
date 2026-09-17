# ASpot Repo Care Loop — Proving Closeout (durable, sanitized)

- Final authoritative main: `936ec45` (post-merge baseline `80975d9` = PR #37 merge by Renpasa + docs-only ledger record). Product code frozen at `80975d9`.
- Full history: `docs/restoration/v1/CARE_LOOP_LEDGER.md` (append-only, authoritative). Detail evidence: `.hermes/tmp/agent-evidence/cycle4/`, `cycle5/` (local-only, untracked).

## Cycles 1–5 completion history

| Cycle | Approved → Issues → Canonical PR (merged Human-only) | Outcome |
|---|---|---|
| 1 (post-restoration) | B/D/A/C → #14–17 → #22 | IMPLEMENTED (backend trust, auth resilience, photo-URL rule, markers) |
| 2 | Q1/N1 → #23–24 → #27 | IMPLEMENTED (input integrity, AuthModal dismiss) |
| 3 | R1/R2 → #28–29 → #32 | IMPLEMENTED (creation-state correctness, validation parity) |
| 4 | S1'/S2' (narrowed) → #33–34 → #37 | IMPLEMENTED (selection coherence, iterative decode + control-char reject) |
| 5 (maturity) | read-only Night Watch, C5-001 → WATCH, nothing promoted | NO_HIGH_VALUE_NEW_WORK (permitted success) |

Regression at every post-merge baseline: PASS (suite grew 6 → 12 → 14 → 15; tsc/lint/build clean; zero auth-fallback recurrence).

## Maturity verdict

**`MATURE_WITH_PROCESS_DEBT`** — reusable as an operating pattern subject to the contracts + debt below.

## Confirmed reusable Care Loop contracts

1. `Completed != durable delivery` — PR URL / pulled diff required; lead transports, never counts intent.
2. Exact-head independent review is mandatory (verdict names the exact HEAD).
3. Post-review material changes require re-check (docs-only deltas confirmed, code deltas re-reviewed).
4. One canonical integration candidate per cycle (supersedes per-fix PRs).
5. Human-only merge (agent never merges).
6. Night Watch is advisory-only before HUMAN_TRIAGE (zero code/PRs/issues pre-triage).
7. WATCH / PRODUCT_DECISION / REJECT persist across cycles (append-only memory; dedup; no re-nomination without new evidence).
8. Detailed evidence stays outside Parent context (`.hermes/tmp/agent-evidence/`; Parent gets verdicts + pointers).
9. Degraded routing/reviewer coverage disclosed, never hidden.
10. `NO_HIGH_VALUE_NEW_WORK` is a valid successful Night Watch result (diminishing returns recognized, work never invented).

## Persistent process debt (orchestration, NOT product defects)

- Workers repeatedly Complete without durable push/PR delivery; lead transport required all proving cycles.
- Reviewer silence recurrent; degraded blind-review fallback used twice — needs a formal governed contract or a better reviewer route before wider rollout.

## Carried state (frozen at close)

- WATCH: N5 (+M-C3-004 bbox), N7, N8, W1–W5, P-C3-003, Q-C3-004, M-C3-001, P-C4-004, Q-C4-001, Q-C4-004, C5-001, C5-002/003/004.
- PRODUCT_DECISION: N6 split (coverage vs UI intent), P-C3-004 preview, unicode-strip extension. Never frame as defects.
- REJECT (upheld): geocoding/long-click, PR-STATE-MISMATCH artifact, M-C3-002 standalone.
- ASpot status: MAINTENANCE_MODE. No Cycle 6. Future work needs a new Human-authorized campaign.

## Operating facts

- Routing: Muse Spark 1.3 + task-scoped subagents. Paid fallback count: 0 (all cycles).
- Sanitization: public-repo hygiene held every cycle (no keys/secrets/PII in PRs, handoffs, or evidence pointers).
- Expansion boundary: this closeout authorizes NO work in any other repository. Each new repo needs its own baseline + product authority.
