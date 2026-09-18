# re1 — Revised recommendation

**Status: current working proposal.** This replaces the version-1 recommendation in
`../en1/en1-initial-recommendation.md`. Nothing here is applied until `../final/` is verified.

## The recommendation in one paragraph

Keep version 1's staged, guarded structure and its objective ("total task cost per completed task"),
and **re-base the foundation**: the first moves must cut the **resident payload** (`L1`, config-enforced,
same-day provable) and the **rate** (`L5`), because those are re-billed on every turn; then keep `L2`
(tests/acceptance criteria) because it is the only version-1 lever that cuts **turns**; then adopt `L4`
only in enforced form; ship `L3` (retrieval discipline) last, behind turn/rework guardrails, and build the
LSP/index only if measured data demands it; keep `L6` (diff-shaped edits) as a reviewability practice and
`L7` (concise policy) as free hygiene, never as the critical path.

## Staged plan

| Phase | Levers | What actually changes | Gate to exit the phase |
|---|---|---|---|
| **0 — Instrument** | — | Baseline on replay tasks T1–T3 (see `../final/final-measurement-plan.md`). No config change. | Baseline reproducible; per-completed-task cost recorded. |
| **1 — Payload + rate** | `L1` + `L5` | Diet `CLAUDE.md` to ≤200 lines / ≤2k tokens; prune/defer MCP and unused tool defs; cap tool output; freeze config mid-session; default model per project; effort level for mechanical work; batch script for overnight sweeps. | Resident payload ↓ ≥30% **with task success unchanged**; rate ↓ on the mechanical class with escalation rate flat. |
| **2 — Contract + sessions** | `L2` + `L4` | Task template that leads with acceptance criteria / a failing test; auto-compact threshold ~70%; compact before idle; task-scoped sessions + `HANDOFF.md`. | $ per completed task ↓; turns per task not up; rework not up. |
| **3 — Retrieval (guarded)** | `L3` | Exact-file prompts, range reads, log filtering, subagents for exploration. | **Turns/task must not rise**, else revert immediately. |
| **Standing practice** | `L6`, `L7` | Diff-shaped edits where natural; no filler; never force patch round-trips; never suppress diagnostics. | n/a — hygiene only, and reversible. |

## Mapping to version 1 (what Copilot should check first)

| Version 1 | Now | Change |
|---|---|---|
| P1 patch-only as approach #1/#4 step | `L6` | Demoted to reviewability; ~4% ceiling; turn risk |
| P2 symbol context as "foundation" | `L3`, phase 3 | Demoted from foundation; LSP build only on measured need |
| P3 tests/acceptance criteria | `L2`, phase 2 | Promoted; justification corrected to *turn reduction* |
| P4 concise policy | `L7` | Kept but taken off the critical path |
| Guardrails | kept | Preserved in substance; added acceptance criterion A6 |
| — | `L1`, `L5` | **New, and now first.** The gap that decided the ranking |
| — | `L4` | New; 91% of observed spend sat in 80+ turn sessions |

## Explicit non-goals

- Do not build an LSP/indexer before phase 1 and 2 data show retrieval is the remaining bottleneck.
- Do not optimise output length as a KPI; it is the cheapest term.
- Do not adopt advice-only changes without the enforced counterpart (thresholds, caps, config).
- Do not trade a turn for a token.

## Verification conditions for the user (final verifier)

`final/` moves from **proposed** to **approved** only when:

1. The decision in `../final/final-decision.md` is accepted (or amended in writing).
2. The measurement plan is accepted, including the falsification test.
3. Acceptance criteria A1–A6 in `../final/final-acceptance-criteria.md` are accepted as the definition of
   "delivered".
4. Any disagreement with the reordering (L1/L5 before L2/L4 before L3) is recorded, so phase 1 can be
   re-scoped before anything is applied.

## Open questions for the Copilot discussion

1. **Objective function:** API dollars, or subscription rate-limit headroom? Levers overlap; the dashboard differs.
2. **Which approach survives contact with the codebase?** Does this repo become the home for a
   `settings.json` + `CLAUDE.md` template + statusline token-budget hook, or is measurement kept external?
3. **Phase 1 only (`L1`+`L5`), or phase 1 straight into phase 2 (`L2`+`L4`)?** (My position: payload and rate
   first — proof before behaviour change.)
4. **Where is the quality gate for `L5` downgrades** — is a machine-checkable success criterion mandatory
   for every downgraded task, with the user as final verifier?
5. **Is the 5-minute cache TTL assumption still current** in the installed CLI version? If not, the
   compact-before-idle rule changes.
6. **Confirm marker semantics and naming** (`en1`/`re1`/`final` = versions; `L1–L7` = levers).
