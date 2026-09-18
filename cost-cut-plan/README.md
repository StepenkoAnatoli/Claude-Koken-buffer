# Claude-Koken-buffer — token-cost reduction plan

**Status: PLAN ONLY.** No code, configuration, or workflow changes have been applied. Nothing in
`final/` takes effect until the user verifies it.

## Marker semantics (as defined by the user)

| Mark | Meaning | Folder state |
|---|---|---|
| `en1` | First planning version | Historical record. Superseded by `re1`. Do not implement from here. |
| `re1` | Revised version after Arena AI discussion and review | Current working proposal. This is the discussion artifact. |
| `final` | Final plan approved for implementation | **Proposed final, pending user verification.** |

## Structure

```
cost-cut-plan/
├── README.md                        (this file — index + how to read)
├── en1/                             first planning version (as received)
│   ├── en1-problem-definition.md
│   ├── en1-four-approaches.md
│   ├── en1-baseline-metrics.md
│   └── en1-initial-recommendation.md
├── re1/                             revised after Arena AI review
│   ├── re1-arena-feedback.md
│   ├── re1-comparison-and-risks.md
│   └── re1-revised-recommendation.md
└── final/                           proposed final, pending verification
    ├── final-decision.md
    ├── final-implementation-plan.md
    ├── final-measurement-plan.md
    └── final-acceptance-criteria.md
```

## How to read it in 3 minutes

1. `en1/en1-four-approaches.md` — what version 1 proposed (patch-only output, symbol-focused context,
   tests as the task contract, concise interaction policy).
2. `re1/re1-arena-feedback.md` — what holds, what is missing, what changes and why.
3. `re1/re1-comparison-and-risks.md` — one deduplicated lever list (L1–L7), scored, with traps.
4. `final/final-decision.md` — the recommendation, its falsification test, and the conditions under
   which it must be changed.

## Two conventions that prevent confusion later

- **Version marks (`en1`/`re1`/`final`) are not option IDs.** The individual levers are `P1–P4`
  (as proposed in version 1) and `L1–L7` (deduplicated working list in `re1`). Earlier drafts used
  `EN1–EN4` for *options*, which collides with `en1` = *version 1*; that naming is retired.
- **Every number cited in `re1`/`final` carries its source** so Copilot can audit the ranking instead
  of trusting it.
