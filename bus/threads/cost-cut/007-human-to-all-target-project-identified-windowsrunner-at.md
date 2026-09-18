---
spec: koken-bus/1
id: cost-cut.007.human
thread: cost-cut
from: human
to: [claude, copilot]
cc: [arena]
date: 2026-09-18T17:38:32Z
intent: handoff
status: open
re: [cost-cut.006.human]
subject: Target project identified - WindowsRunner at frozen commit (G1-G2 answered)
evidence: none
labels: [G1, G2, phase-0]
---

## Context

Decision `cost-cut.006.human` froze phase 1 behind target-project identification (C2), and
`cost-cut-plan/re1/re1-facts-sweep.md` part 2 listed G1–G7 as the blocking gate. The operator has now
supplied those answers, so the blocker described in `cost-cut-plan/final/final-implementation-plan.md`
is resolved.

## Answers recorded

| # | Item | Answer |
|---|---|---|
| G1 | Target repository | `StepenkoAnatoli/WindowsRunner` |
| G2 | Replay branch + commit | `main` @ `406bc654a2e8aea02f1e4dfc36c9ba4ad8aa6fdd` |
| G4 | Project type | Windows-first, local-first coding agent |
| G5 | Phase | Research/bootstrap only — no product code changes |
| G6 | Checks available | 22 TypeScript tests; CI/test workflow requires no API key |
| G7 | Instructions in force | `AGENTS.md` is present and applies |

Still open: **G3** (execution client and provider account) and the telemetry storage location.

## What this unblocks

Phase 0 of `cost-cut-plan/final/final-implementation-plan.md` can now run against a named target instead of
design-only. In particular:

- F11 is answered in advance — quality gates can be **test-based** (22 TypeScript tests, no API key needed),
  not review-based. This removes the weakest link in the benchmark design.
- The replay commit is frozen, so T1–T3 can be defined against a fixed tree.
- `AGENTS.md` is the resident-prefix artifact that `I1`/EN1 acts on in that repo.

## What is still blocked

F1/F2 — billing mode and objective unit — remain unanswered, so decision C1 (ranking frozen) still stands.
`I1`-first remains a working hypothesis. **No savings are claimed.**

## Requested of the recipient

1. `claude` — confirm whether G3 can be read from your launch configuration, and whether `/context` and
   `/cost` are available in the client actually used against `WindowsRunner`.
2. `copilot` — review whether the 22-test suite is a sufficient quality gate for T1–T3 under the matched
   protocol in your `BENCHMARK.md`, or whether a review-based gate is still required for some task class.
3. Both — do not create phase-1 assets in `WindowsRunner` yet. G6 covers permission in principle; the
   operator has confirmed research/bootstrap phase only, so the next action is measurement, not change.
