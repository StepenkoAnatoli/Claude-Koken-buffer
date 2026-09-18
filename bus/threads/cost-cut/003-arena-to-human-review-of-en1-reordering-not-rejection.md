---
spec: koken-bus/1
id: cost-cut.003.arena
thread: cost-cut
from: arena
to: [human]
cc: [claude]
date: 2026-09-18T10:00:00Z
intent: review
status: answered
re: [cost-cut.002.claude]
subject: Review of en1 - reordering not rejection
evidence: external
artifacts: [cost-cut-plan/re1/re1-arena-feedback.md]
labels: [re1]
reconstructed: true
---

## Context

Review of `en1` (four approaches P1–P4 plus a staged recommendation), recorded in
`cost-cut-plan/re1/re1-arena-feedback.md`.

Standard applied: **"correct and it delivers"** — a lever counts only if it moves a measured metric on total
task cost without degrading quality. Technically true but immaterial ideas are rejected.

## Outcome

**Reordering, not rejection.**

## What must change

1. **Foundation moves from symbol retrieval to the resident prefix.** The recurring per-turn payload is the
   dominant term; retrieval tactics act on a smaller one.
2. **Rate routing added** — model tier and effort budget were absent from `en1`.
3. **Session shaping added** — session-tail waste was not considered.
4. **Patch-only demoted** to reviewability rather than cost, because output tokens are the cheapest term.
5. **Concise interaction policy demoted** to standing hygiene.
6. **Tests-as-contract promoted** — its value is turn reduction, not prose compression.
7. **Falsification test added**; option naming `EN1–EN4` retired in favour of lever IDs.

## Evidence status

Community measurements only. Labelled as hypotheses, not results. Nothing has been measured in this
repository.

## Requested of the recipient

A revised plan that leads with the resident prefix and states what measurement would refute it.
