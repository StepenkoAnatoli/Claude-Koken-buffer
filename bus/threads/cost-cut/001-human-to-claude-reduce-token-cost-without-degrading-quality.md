---
spec: koken-bus/1
id: cost-cut.001.human
thread: cost-cut
from: human
to: [claude]
cc: [arena]
date: 2026-09-18T08:00:00Z
intent: ask
status: superseded
subject: Reduce token cost without degrading quality
evidence: none
artifacts: [cost-cut-plan/en1/en1-problem-definition.md]
labels: [bootstrap]
reconstructed: true
---

## Context

`StepenkoAnatoli/Claude-Koken-buffer` exists to reduce the token cost of Claude-based coding work. At the time
of this message the repository is a minimal `README.md` and nothing has been measured.

## Request

Produce a plan to reduce token cost **without degrading correctness, test success, or review quality.**

Cost model to work from:

```
cost ≈ Σ over turns of ( context sent that turn × cache-adjusted price per token )
```

## Constraints

- No implementation yet — planning only.
- A token saving that adds a turn, a defect, an unsafe omission, or unacceptable user effort is not a saving.
- Recommendations must be falsifiable.

## Requested of the recipient

A `propose` message with candidate interventions, a recommended order, and the measurements that would
confirm or refute each one.
