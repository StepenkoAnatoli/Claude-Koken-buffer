# final — Decision (PROPOSED, pending user verification)

**Status: proposed final. Not approved, not applied.** No code, configuration, or workflow change is made
until the user verifies this file.

## Decision

The decision is a **conditional process**, not a ranking:

1. **Instrument first.** Change no behaviour until measurements can distinguish successful work, retries,
   correction turns, cache usage, and failures.
2. **Identify the constraint:** API dollars, subscription/rate-limit capacity, or both (facts F1–F2).
3. **Reproduce the measurements in this environment:** facts sweep F1–F13, then replay tasks T1–T3.
4. **Benchmark the candidates** — the recurring-prefix intervention (`I1`) and the others — under the matched
   protocol and the quality rubric.
5. **Rank from repository-specific evidence only.** Ordering follows what this project measures, not what
   external sources report.

Until step 5 completes, the intervention ordering below is a **working hypothesis, not a decision.**

## Working hypothesis (subject to step 5)

`I1` (prefix diet + cache freeze) first; `I4` (rate routing) next, provider-gated; `I3` (session shaping)
conditional on measured session-tail waste, with `I3a` (knobs, zero behaviour change) separable from `I3b`
(behavioural); `I2` (retrieval discipline) last, narrow, guarded by turns and rework.

### Why `I1` leads the hypothesis

1. **It multiplies.** The prefix is re-billed on every request, so a fixed reduction is not a one-off.
2. **It is enforced by configuration**, not by willpower — the failure mode of every advice-only lever.
3. **It does not require a quality inference** if the diet rule is "delete only what the model can infer".
4. **It is provable from a measurement, not a statistic:** a payload census before/after. That makes it the
   cheapest first experiment, which is exactly why it leads.

**Objective dependency (may strengthen or weaken it):** if the constraint turns out to be subscription
capacity rather than dollars, `I4`'s pricing/batch assumptions may not apply and `I1` becomes *more*
important, because it reduces capacity burn on every turn (see `re1/re1-evidence-boundary.md` §4).

## Evidence boundary (binding)

No external figure in this repository is a result, a forecast input, or an acceptance criterion. Every
number cited in `re1` is **motivation to run a test**, reproduced only after measurement in this environment
with date, method, and sample count. This repository currently has no telemetry, billing data, or task
history and therefore **claims no savings**. Full register: `../re1/re1-evidence-boundary.md`.

## What makes this decision fail (falsification test)

After `I1`, on a captured request: if per-turn usage does **not** fall by approximately the removed payload,
then the cost model behind this decision is wrong. Then: stop, re-derive the model from this environment's
own `/cost` and per-turn records, and re-rank. A plan that cannot fail its own test is a slogan, not a decision.

## Conditions to move from PROPOSED to APPROVED (user sign-off)

| # | Condition | Owner |
|---|---|---|
| V1 | This decision is accepted, or amended in writing | user |
| V2 | Measurement plan accepted, including the falsification test | user |
| V3 | Acceptance criteria accepted — with thresholds set from the phase-0 baseline, not from external figures | user |
| V4 | Disagreement with the working hypothesis (`I1` first) recorded before phase 1 starts | user + Copilot |
| V5 | Knob names and measurement commands confirmed against the installed client version | Copilot |
| V6 | Rejection path confirmed: reverting config restores the baseline payload | Copilot |
| V7 | **Primary objective chosen and documented** (dollars, capacity, or weighted) — required by the evidence boundary and by step 2 of the decision | user |

## Non-negotiable rules carried from version 1

- Never suppress tests, diagnostics, or security warnings.
- Full-file output permitted on file creation and heavy refactors.
- Validate after every patch.
- Preserve enough context for architectural and cross-file changes.
- Optimise **cost per completed, correct task**, never tokens per response.
