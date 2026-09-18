# Claude-Koken-buffer — token-cost reduction plan

**Status: PLAN ONLY.** No code, configuration, routing, or workflow change has been applied. Nothing in
`final/` takes effect until the user verifies it.

## Marker semantics

| Mark | Meaning | State |
|---|---|---|
| `en1` | First planning version (originally received) | Historical record; superseded |
| `en2` | Second planning version (Copilot, "Cost-cut plan v2") | Received; reviewed in `re1` |
| `re1` | Revised version after Arena AI review | **Current working proposal** — the discussion artifact |
| `final` | Final plan approved for implementation | Proposed, **pending user verification** |

## Structure

```
cost-cut-plan/
├── README.md                                   this file — index + naming + how to read
├── DECISION-LOG.md                             dated decisions, evidence, open blockers
├── en1/                                        first planning version (as received)
│   ├── en1-problem-definition.md
│   ├── en1-four-approaches.md
│   ├── en1-baseline-metrics.md
│   └── en1-initial-recommendation.md
├── en2/                                        second planning version (Copilot v2, as received)
│   └── en2-copilot-v2-received.md
├── re1/                                        revised after Arena AI review
│   ├── re1-arena-feedback.md                   review of en1
│   ├── re1-review-of-copilot-v2.md             review of en2  ← the current discussion document
│   ├── re1-comparison-and-risks.md             deduplicated levers, scoring, traps, risk register
│   ├── re1-assumption-register.md              assumptions, labels, consequences of error
│   ├── re1-facts-sweep.md                      ≤1h fact sweep that answers both plans' gates
│   └── re1-revised-recommendation.md
└── final/                                      proposed final, pending verification
    ├── final-decision.md
    ├── final-implementation-plan.md
    ├── final-measurement-plan.md
    └── final-acceptance-criteria.md
```

Governance material from `en2` (assumptions table, benchmark protocol, telemetry/privacy rules, rollout and
rollback) is folded into `final/` on approval; it is not duplicated here to avoid two sources of truth.

## Naming: versions vs interventions

Version marks (`en1`, `en2`, `re1`, `final`) are **not** intervention IDs. Canonical intervention IDs are
`I1`–`I4`:

| Canonical | Intervention | Copilot v2 alias | Earlier alias |
|---|---|---|---|
| **I1** | Prefix diet + cache freeze | EN1 | L1 |
| **I2** | Retrieval discipline (scoped context, filtered output, subagents) | EN2 | L3 |
| **I3** | Session shaping (compact-not-clear, thresholds, handoffs) | EN3 | L4 |
| **I4** | Rate routing (model tier, effort budget, batch) | EN4 | L5 |

Plus standing hygiene: **H1** diff-shaped edits (v2 EN "patch-only"), **H2** concise interaction policy.
Rename is trivial if any side prefers another scheme.

## How to read it in 3 minutes

1. `DECISION-LOG.md` — what was decided, when, and what is still blocked.
2. `en1/en1-four-approaches.md` — version 1's four approaches.
3. `re1/re1-review-of-copilot-v2.md` — where the two plans agree and the seven proposed amendments.
4. `final/final-decision.md` — the gated recommendation, its falsification test, sign-off conditions.

## The one-line thesis

Cost ≈ **turns × context-per-turn × cache-adjusted rate**, and output tokens are the cheapest term.
Both plans therefore converge on the same first move (`I1`), and on the same rule: **a token saving that
adds a turn, a defect, an unsafe omission, or unacceptable user effort is not a saving.**
