# final — Measurement plan (PROPOSED)

Rule 0: **the headline metric is cost per completed task.** Tokens per response are a diagnostic, never a KPI.

## Replay tasks (fixed, reused for every phase)

| ID | Task shape | What it stresses |
|---|---|---|
| T1 | Mechanical: small fix, one module, machine-checkable outcome | Rate routing (`L5`), trivial turns |
| T2 | Cross-file: refactor touching 3+ files and their imports | Context depth; catches under-context damage from `L3` |
| T3 | Feature with a failing test as the spec | Turn compression (`L2`) |

Protocol per run: throwaway worktree at a fixed commit; cold session; fixed prompt template; no mid-run
config changes; **2 repeats**; discard runs with infrastructure failures.

## Metrics per run

| Metric | Source | Use |
|---|---|---|
| Input tokens: fresh / cache-read / cache-write | per-turn logs, `/cost` | The split drives the bill |
| Output tokens | same | Completeness only |
| Turns to completion (incl. clarification + rework) | transcript | Hidden multiplier; primary guardrail |
| Re-reprompts / human edits / reverts | tally | Detects fake savings |
| Test-pass rate, regression count | test run | Binding quality constraint |
| Wall clock | timestamps | Sanity |
| Cold-start resident payload | counted request (`count_tokens`) | `L1` effect size; authoritative |
| Cost per **completed** task (currency or rate-limit %) | `/cost`, `/usage` | **Headline** |
| Cache hit rate (sessions >20 turns) | `/cost` | Health of the session policy |

## Cadence

| When | What |
|---|---|
| Day 0 | Baseline T1–T3, 2 repeats each; freeze starting commits |
| End of phase 1 | Re-run same script; report payload delta + tokens/turn delta + success delta |
| End of phase 2 | Same; add $/task and turns/task trend |
| End of phase 3 | Same; explicitly check turns/task did not rise |
| Weekly, ongoing | Roll up real (non-replay) usage: $/task, escalation rate, cache hit rate |

## Report format (one table per phase, no prose padding)

```
phase | task | payload tok | in fresh/read/write | out tok | turns | tests | rework | $/task | vs baseline
```

Keep reports in `cost-cut-plan/reports/` so the user can verify the plan rather than trust it.

## Falsification test (decides whether the model itself is right)

After phase 1, on a **captured request**:

```
expected: tokens/turn falls by ≈ (removed payload tokens)
```

If the measured fall is far below that, the cost model is wrong (or the payload was not actually removed
from the request). Then: stop, re-derive from `/cost` + per-turn logs, re-rank the levers, and rewrite
`final-decision.md`. Do not proceed to phase 2 on an unexplained result.

## Measurement caveats

- `/context` **overstates** MCP cost (per-tool summing repeats shared preamble: 45k reported vs ~15k real).
  Use it for ranking only; count the real request for absolute numbers.
- `/context` and `/cost` are per-session. Aggregate to per-completed-task before drawing conclusions.
- Community figures (93% cache share, 91% of spend in 80+ turn sessions, ~$0.60 restart warm-up) are
  **ranking hypotheses** for this repo, not our measurements. Confirm or discard them on T1–T3.
