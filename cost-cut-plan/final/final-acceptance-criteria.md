# final — Acceptance criteria (PROPOSED)

> **Thresholds are provisional.** No external figure may serve as a criterion. Each numeric threshold below
> is set **from the phase-0 baseline measured in this repository**; the illustrative values used in earlier
> drafts came from community measurements and are not admissible as gates. See
> `../re1/re1-evidence-boundary.md`.

"Delivered" means all of A1–A6 hold at the phase's exit gate, on T1–T3, with at least 2 repeats.

| # | Criterion | Measurement | Threshold |
|---|---|---|---|
| **A1** | Resident payload reduced | counted request at cold start (not `/context`'s MCP row) | reduce vs this repo's baseline; **value set from phase 0** (earlier draft's "≥30%" was illustrative only) |
| **A2** | Cost per completed, correct task reduced | objective units ÷ completed tasks, same script both sides | median reduction; **value set from phase 0** (earlier draft's "≥40%" was illustrative only) |
| **A3** | Turn count not increased | turns to completion | **≤ this repo's baseline** (comparative, admissible without external figures); improvement target set from phase 0 |
| **A4** | Quality flat or better | test-pass rate, rework count, regression count | tests ≥ baseline; rework not worse beyond one step on any task |
| **A5** | Session policy healthy | cache hit rate in sessions >20 turns | **not below this repo's baseline** (earlier draft's "≥90%" was illustrative only) |
| **A6** | Diagnostics never suppressed | inspection: failing tests, warnings, lint/security findings, error output | **binary and mandatory — violation voids the phase** |

## Promotion rule for thresholds

A number becomes a criterion only when it is: (1) measured in this repository, (2) recorded with date,
method, and sample count in `DECISION-LOG.md`, and (3) expressed in the objective chosen in step 2 of the
decision. Until then it is labelled provisional.

## Program-level target

Reduce cost per completed, correct task over a two-week window **by an amount determined from the phase-0
baseline**, with test-pass and rework rates flat or better. No absolute percentage is adopted in advance.

## Kill criteria (per lever)

| Lever | Kill / revert if |
|---|---|
| `I1` | A removed memory rule causes a repeated mistake → restore that rule and re-measure |
| `I2` | turns/task rises, or the cross-file task class regresses → revert the phase in full |
| `I3` | cost per completed task does not fall within two weeks → revert to "keep sessions warm, compact deliberately" |
| `I4` | escalation rate rises (tasks re-run on a stronger route) → raise the downgrade threshold |
| Any | A6 violated, or the falsification test fails without explanation → stop the programme and re-derive from this repo's data |

## Definition of done

1. A1–A6 pass at the end of the implemented phases.
2. Measurement reports are reproducible from a fixed script and stored with the plan.
3. Thresholds are traceable to repository measurements, never to external figures.
4. The user has verified and signed off (conditions V1–V7 in `final-decision.md`).

## Explicit non-goals

- Output-token reduction as evidence of success (it is the smallest term; unconfirmed here).
- Shorter responses as a proxy for efficiency.
- Any saving obtained by suppressing tests, diagnostics, or warnings.
- Any saving obtained by moving cost into turns, rework, or user effort.
