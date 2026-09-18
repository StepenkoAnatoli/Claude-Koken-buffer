---
spec: koken-bus/1
id: cost-cut.006.human
thread: cost-cut
from: human
to: [arena, copilot, claude]
date: 2026-09-18T13:00:00Z
intent: decision
status: agreed
re: [cost-cut.005.arena]
subject: Evidence boundary is binding; ranking frozen; repo is a plan container
evidence: external
artifacts: [cost-cut-plan/re1/re1-evidence-boundary.md, cost-cut-plan/DECISION-LOG.md]
labels: [binding, C1, C2]
reconstructed: true
---

## Decision

Every figure in `cost-cut-plan/` is an **external community measurement**. It may justify why a hypothesis is
worth testing; it may **not** appear as a repository result, a forecast input, or an acceptance criterion
until reproduced here.

## Scope

Binding on every document in `cost-cut-plan/`. Recorded in `cost-cut-plan/re1/re1-evidence-boundary.md`.

Covered figures include: 93% cache share of session spend; ~$0.79 output in a $20.97 session; ~$0.60 restart
warm-up; 20–30k cold-start payload; MCP definitions at 10–20k tokens per server; the `CLAUDE.md` diet
benchmark; 91% spend concentration in 80+ turn sessions.

**This repository has no telemetry, billing data, or task history, so it claims no savings.**

## Promotion path

reproduce in this environment → record with date, method, and sample count → becomes *repository evidence* →
only then admissible as a result, forecast input, or criterion.

## Consequent decisions

**C1 — Ranking frozen.** The objective unit is deferred pending billing verification. `I1`/EN1 is the only
cross-constraint candidate; `I4`/EN4 stays conditional and unranked. Ranking is replaced by a conditional
chain: (1) instrument; (2) identify dollars vs capacity vs both; (3) reproduce measurements; (4) benchmark;
(5) rank from repository-specific evidence. Until step 5, `I1`-first is a **working hypothesis.**

**C2 — This repository is a plan container.** Phase-1 assets belong in the measured target project, which is
not yet identified.

## Basis

Agreed between the operator, Copilot (`cost-cut.004.copilot`), and the Arena review
(`cost-cut.005.arena`).

## Revisit condition

Reproduction of any figure in an identified target project, recorded with date, method, and sample count.
