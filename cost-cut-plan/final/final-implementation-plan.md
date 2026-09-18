# final — Implementation plan (PROPOSED, nothing applied)

> This file describes what **will** be created/changed if approved. No file listed here exists yet.
> Every knob name must be verified against the installed CLI version before use (condition V5).

## Prerequisite (blocking, per decision C2)

Phase-1 assets are **not created in this repository** (plan container only). They are created in the
**measured target project**, which is not yet identified. Required first:

```
G1 repo owner/name          G5 representative task set
G2 replay branch + commit   G6 permission to add phase-1 assets there
G3 client + provider        G7 where telemetry/reports are stored
G4 model + configuration
```

Until G1–G7 are recorded, phase 0 proceeds as **design work only**: protocol, templates, report structure,
facts sweep. Nothing below is created anywhere.

## Assets that would be created on approval

| Path (to create) | Lives in | Purpose | Phase |
|---|---|---|---|
| **Kit commit** — `.claude/` template (**`CLAUDE.md`**, `settings.json`, `.mcp.json`/`--mcp-config`, `.claudeignore`), `HANDOFF.md` template, `docs/plan-template.md`, `tasks/t1..t3/*.md` | **here** (container: versioned, reviewable, portable) | The reviewable artifacts + the protocol | 0–2 |
| **Applied copies** of the same files, adapted | **target project** (G1), with G6 permission | The actual diet, caps, thresholds, replay runs | 1–3 |
| `reports/` — per-phase before/after tables | **here** | Measurement record the user can verify | 0–3 |

Copying the kit into the target project is the only write action outside this repo, and it is reversible
(config files, no product code). Replay tasks are executed in the target project at commit G2.

## Phase 0 — Instrument (day 0, no config change)

0. **Record G1–G7** (target project, replay commit, client/provider, model config, task set, permission,
   telemetry location). Until these exist, steps 1–2 are *design* work performed here and steps 3–4 cannot
   be executed anywhere.
1. Capture cold-start `/context` snapshot and one **counted** request (authoritative payload number).
2. Create replay tasks T1–T3 with fixed starting commits (definitions reviewed here; executed in the target
   project at G2).
3. Record baseline: tokens (fresh/read/write), output tokens, turns, test-pass, rework, cost per completed
   task in the unit chosen by C1. Baseline is invalid unless reproducible on a second run.

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
