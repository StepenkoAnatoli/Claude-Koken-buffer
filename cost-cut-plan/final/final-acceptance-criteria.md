# final — Acceptance criteria (PROPOSED)

"Delivered" means all of A1–A6 hold on the phase's exit gate, on T1–T3, with 2 repeats.

| # | Criterion | Measurement | Threshold |
|---|---|---|---|
| **A1** | Resident payload reduced | counted request (cold start), not `/context`'s MCP row | **≥30%** reduction vs baseline |
| **A2** | Cost per completed task reduced | `/cost` ÷ completed tasks, same script both sides | **≥40%** median reduction; T2 (cross-file) must not regress |
| **A3** | Turn count not increased | turns to completion | **≤ baseline**, target −20% |
| **A4** | Quality flat or better | test-pass rate, rework count, regression count | tests ≥ baseline; rework not worse by more than 1 step on any task |
| **A5** | Session policy healthy | cache hit rate in sessions >20 turns | **≥90%**; no mid-session config mutation events |
| **A6** | Diagnostics never suppressed | inspection: failing tests, warnings, lint/security findings, error output | **mandatory, binary** — violation voids the phase |

## Program-level target

**≥40% lower cost (currency or rate-limit consumption) per completed task over two weeks, with test-pass
and rework rates flat or better.** Quality is the binding constraint; tokens are the objective.

## Kill criteria (per lever)

| Lever | Kill / revert if |
|---|---|
| `L1` | A removed memory rule causes a repeated mistake → restore that rule and re-measure |
| `L3` | turns/task rises, or T2 regresses → revert the phase in full |
| `L4` | $/task does not fall within 2 weeks → revert to "keep the session warm, compact deliberately" |
| `L5` | escalation rate rises (tasks re-run on a stronger model) → raise the downgrade threshold |
| Any | A6 violated, or the falsification test fails with no explanation → stop the program and re-derive |

## Definition of done for the whole plan

1. A1–A6 pass at the end of phases 1 and 2 (phase 3 optional).
2. `cost-cut-plan/reports/` contains a before/after table per phase, reproducible from the fixed script.
3. The final decision, amendment history, and any rejected levers are recorded in this folder.
4. The user has verified and signed off (conditions V1–V6 in `final-decision.md`).

## Explicit non-goals for acceptance

- Output-token reduction alone (cheapest term; not evidence of success).
- Shorter responses as a proxy for efficiency.
- Any saving achieved by suppressing tests, diagnostics, or warnings.
- Any saving achieved by moving cost into turns or rework.
