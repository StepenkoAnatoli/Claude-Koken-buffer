# final — Implementation plan (PROPOSED, nothing applied)

> This file describes what **will** be created/changed if approved. No file listed here exists yet.
> Every knob name must be verified against the installed CLI version before use (condition V5).

## Assets that would be created on approval

| Path (to create) | Purpose | Phase |
|---|---|---|
| `CLAUDE.md` | Dieted project memory: ≤200 lines / ≤2k tokens, only facts the model cannot infer. | 1 |
| `.claude/settings.json` | Output caps (`MAX_MCP_OUTPUT_TOKENS`, `BASH_MAX_OUTPUT_LENGTH`), auto-compact threshold, effort level, `permissions.deny` with **bare tool names** for unused tools. | 1 |
| `.mcp.json` (or per-task `--mcp-config`) | Only the MCP servers this project actually uses. | 1 |
| `.claudeignore` | `node_modules/`, `dist/`, `build/`, `coverage/`, `logs/`, `*.log`, secrets. | 1 |
| `tasks/t1..t3/*.md` | Replay-task prompts + acceptance checks for measurement. | 0 |
| `HANDOFF.md` (template) | done / next / open decisions / exact files, for session boundaries. | 2 |
| `docs/plan-template.md` | Task template: acceptance criteria first, scope ("start with these files; do not scan the repo"), verification step. | 2 |
| `cost-cut-plan/reports/` | Per-phase measurement reports (before/after per lever). | 0–3 |

## Phase 0 — Instrument (day 0, no config change)

1. Capture cold-start `/context` snapshot and one **counted** request (authoritative payload number).
2. Create replay tasks T1–T3 with fixed starting commits.
3. Record baseline: tokens (fresh/read/write), output tokens, turns, test-pass, rework, $/task.
   Baseline is invalid unless reproducible on a second run.

## Phase 1 — Payload + rate (`L1`, `L5`)

`L1`:
1. Diet `CLAUDE.md` to ≤200 lines; delete anything inferable from the code; move the rest to on-demand docs.
2. Prune MCP servers to the used set; enable tool-search deferral if the version supports it.
3. `permissions.deny` with **bare names** (removes the definition from the payload; scoped rules do not).
4. Cap tool output sizes; keep caps high enough to preserve diagnostics (see A6).
5. **Freeze rule:** no mid-session edits to `CLAUDE.md`, rules, or settings. Config changes at session
   boundaries only; keep file-load order deterministic.

`L5`:
6. Set the project default model; use the cheap tier only where success is machine-checkable.
7. Effort/thinking budget low–medium for mechanical work; keep high where ambiguity is the task.
8. Batch script (24h turnaround, −50%) for overnight sweeps and bulk refactors.

**Exit gate:** payload reduced vs this repo's baseline on the counted request (threshold set from phase 0 —
the "≥30%" figure in earlier drafts was illustrative and external in origin); T1–T3 success unchanged;
escalation rate flat.

## Phase 2 — Contract + sessions (`L2`, `L4`)

9. Adopt the task template: acceptance criteria / failing test first, explicit scope, verification step.
10. Auto-compact threshold ~70%; compact with instructions before long idle gaps; never a blank compact.
11. Task-scoped sessions; on boundary, write `HANDOFF.md` and prefer `/compact` over `/clear` when the work
    continues.

**Exit gate:** $/task ↓; turns/task not up; rework not up.

## Phase 3 — Retrieval, guarded (`L3`)

12. Exact-file/range prompts; ban repo-wide scans unless justified; filter logs before injection
    (failures only, last N lines).
13. Subagents for exploration; main thread receives conclusions only; add path-scoped rules / skills with
    progressive disclosure instead of always-on instruction files.
14. LSP/index: **only** if phase 1–2 data still shows retrieval as the bottleneck, and only with the
    per-request cost of the new tool surface measured first.

**Guardrail:** if turns/task rises, revert this phase in full.

## Standing practice (`L6`, `L7`)

- Prefer natural diff-shaped edits; never force a patch round-trip when a direct edit is available;
  full-file output allowed on creation/major refactor.
- No filler, no restating the plan, direct answers; progress reports last line first.
- Never suppress tests, diagnostics, warnings, or security output to save tokens.

## Rollback

- Phases are separate commits/diffs; reverting a phase restores the previous payload and behaviour.
- Any phase that fails its exit gate is reverted before the next phase starts. No stacking unverified changes.
