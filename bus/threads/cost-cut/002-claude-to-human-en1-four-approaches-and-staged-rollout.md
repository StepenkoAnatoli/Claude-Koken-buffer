---
spec: koken-bus/1
id: cost-cut.002.claude
thread: cost-cut
from: claude
to: [human]
cc: [arena]
date: 2026-09-18T09:00:00Z
intent: propose
status: superseded
re: [cost-cut.001.human]
subject: en1 four approaches and staged rollout
evidence: none
artifacts: [cost-cut-plan/en1/en1-four-approaches.md, cost-cut-plan/en1/en1-initial-recommendation.md]
labels: [en1]
reconstructed: true
---

## Context

Responds to the planning request. Recorded in `cost-cut-plan/en1/` as the first planning version (`en1`).

## Proposal

Four approaches, to be used in controlled combination rather than singly:

1. **Symbol-focused context as the foundation** — retrieve symbols, not whole files.
2. **Tests and acceptance criteria as the task contract** — the task is defined by what must pass.
3. **Patch-only output for implementation changes** — diffs, not whole-file rewrites.
4. **Concise interaction rules as a safety layer** — not the primary optimisation.

## Rollout order as stated

1. Establish baseline measurements for representative coding tasks.
2. Add concise interaction rules.
3. Introduce test-driven task specifications.
4. Add patch-only output requirements.
5. Add symbol-aware context retrieval.

## Rationale as stated

Reduces both input and output tokens while preserving the information Claude needs to make correct
decisions, and delivers measurable workflow improvements rather than merely shorter responses.

## Requested of the recipient

Review for decision quality: is the ordering right, and is anything load-bearing missing?
