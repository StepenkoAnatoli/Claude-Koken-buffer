# en1 — Baseline metrics (first planning version)

The measurement step is proposed **before** any optimisation, and unchanged in principle by the review
(only sharpened, see `../final/final-measurement-plan.md`).

## What to record per run

| Metric | Why it matters |
|---|---|
| Input tokens: fresh / cache-read / cache-write split | The split, not the total, determines the bill. |
| Output tokens | Small lever; kept for completeness. |
| Turns to completion (including clarification and rework) | Primary hidden multiplier. |
| Wall-clock time | Sanity check that a "saving" is not just slower. |
| Test-pass rate | The binding quality constraint. |
| Rework count (re-prompts, human edits, reverted commits) | Detects savings that are not real. |
| Total cost (currency or rate-limit headroom) per **completed** task | The only headline number that matters. |
| Resident payload at cold start | The per-turn flat tax. |

## Representative tasks

Pick 3 replay tasks, each starting from a fixed commit in a throwaway worktree, run from a cold session:

1. **T1 — mechanical:** small targeted fix in one module (model routing candidate).
2. **T2 — cross-file:** refactor touching 3+ files and their imports (context-depth stress test).
3. **T3 — feature with test-first spec:** new behaviour defined by a failing test (turn-compression test).

Each run: fixed prompt template, no mid-run config changes, at least 2 repeats per phase.

## Instrumentation available at version 1

- `/context` — resident payload breakdown (system prompt, system tools, MCP tools, memory, skills, messages).
- `/cost`, `/usage` — session cost and rate-limit consumption.
- OTel export or per-session log parsing for per-turn records.

## Traps recorded at version 1

- `/context` **overstates** MCP tool cost (it sums per-tool measurements, repeating shared preamble)
  — use it for ranking, verify absolute numbers by counting the real request.
- Per-response token counts are a misleading optimisation target: an agentic loop pays for the whole
  context again on every turn.
- Baseline must be taken on the *same* tasks and the *same* starting commits, or the comparison is noise.
