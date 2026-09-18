# re1 — Comparison, scoring, and risks

> **Evidence boundary (binding):** every figure in this file is an **external community measurement**, cited
> as motivation only. None is a repository result, a forecast input, or an acceptance criterion. Thresholds
> are provisional until set from this repository's phase-0 baseline. See `re1-evidence-boundary.md`.

All candidate levers from version 1 (`P1–P4`) and from the review (`O1–O4`) are deduplicated here into
**L1–L7**. Scoring 1–5; "Delivers" = effect size × reliability, not elegance.

## Lever table

| ID | Lever | Origin | Mechanism (one line) | Cost/risk | Enforceable by config | Time to proof |
|---|---|---|---|---|---|---|
| **L1** | **Prefix diet + cache freeze** | new | Shrink and then stop mutating the resident payload (system/tool/MCP defs, memory, skills). | Low | **Yes** | Same day |
| L2 | Task contract via tests / acceptance criteria | P3 | Remove clarification turns; binary definition of done. | Low, but upfront test-authoring effort | Partly | Days |
| L3 | Retrieval discipline | P2 (+O2) | Exact files/ranges, filtered tool output, subagents for exploration; LSP only if data demands. | **Medium (quality risk)** | Partly | Days–weeks |
| L4 | Session shaping | O3 | Turn count and compact-instead-of-clear, thresholds, handoff files. | Medium | Partly | 1–2 weeks |
| L5 | Rate routing | O4 | Model tier, effort/thinking budget, batch pricing for overnight work. | Low (with verifiability rule) | Mostly | Same day |
| L6 | Patch/diff-shaped edits | P1 | Reviewability practice; never a forced patch round-trip. | Low | No (habit) | n/a as a cost lever |
| L7 | Concise interaction policy | P4 | No filler, no restatement, direct answers. | Low | Yes | Immediate |

## Scoring

| Lever | Effect size | Low quality risk | Config-enforced (not willpower) | Time to proof | **Score** | Verdict |
|---|---|---|---|---|---|---|
| **L1** | 4 | 5 | 5 | 5 | **19** | **Best single move — foundation** |
| L5 | 3 | 4 | 4 | 5 | 16 | Cheapest add-on; ship day one with L1 |
| L2 | 4 | 4 | 3 | 4 | 15 | The only version-1 lever that cuts turns — keep |
| L4 | 5 | 3 | 3 | 3 | 14 | Biggest tail; phase 2, enforced form only |
| L3 | 4 | 2 | 2 | 3 | 11 | Real, but last — fake savings hide here |
| L6 | 1 | 4 | 2 | n/a | 7 | Reviewability practice, not a cost lever |
| L7 | 1 | 4 | 5 | 5 | 15 | Free hygiene; ceiling ~4%; never the critical path |

## Why L1 outranks everything (the two structural facts)

1. **Output tokens are ~3–7% of the bill.** 170-turn session: output **$0.79 of $20.97**; 41-day dataset:
   **~93%** cache operations, **~7%** output.
2. **The resident payload is re-billed on every turn** and rewritten at **1.25×** base on every cold start
   (reads are **0.1×**, i.e. 12.5× cheaper than a rewrite after a >5 min gap). A 10k-token cut is therefore
   a permanent discount, not a one-off — and it also shrinks what compaction must carry.

## Traps (write these down; they are how plans of this kind fail)

- **Fake savings.** Fewer input tokens per turn but more turns or more rework. Bind every change to
  *turns per completed task* and *rework rate*, never to tokens alone. A saved input token that costs a
  turn is a **loss**: the turn re-bills the entire context.
- **`/context` overstates MCP cost** by summing per-tool measurements that each repeat shared preamble
  (measured: **45k reported vs ~15k real**). Rank with it; never quote absolute numbers from it.
- **`/clear` is not free.** It guarantees a cold start; `/compact` is cheaper when the work continues.
- **Restart cost.** ~$0.60 per restart; "many small sessions" can cost more than one warm session.
- **Every new capability is a recurring tax.** Each MCP server (10k–20k tok), skill, or agent definition is
  re-sent every request. Tools added to save tokens can cost tokens.
- **Cache killers:** editing `CLAUDE.md` mid-session, inconsistent file-load order, proactive restarts.
- **Second-hand data.** All figures above are community measurements over specific sessions. Treat them as
  hypotheses for T1–T3, not as our numbers.
- **`/context` and `/cost` are per-session, not per-task.** Without a per-completed-task KPI the plan can
  show a win while the monthly bill rises.

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| L3 under-context → wrong edit → extra turns | High if shipped first | High | Ship last; guard with turns/task + rework rate; revert on regression |
| L4 naive session splitting → warm-up tax | Medium | Medium | Enforced thresholds + handoff file; kill criterion after 2 weeks |
| L1 over-aggressive memory diet → repeated mistakes | Low | Medium | Delete-only-what-is-inferable rule; restore any rule whose absence causes a repeat |
| L5 wrong routing → cheap model on judgement tasks | Medium | High | Downgrade only where success is machine-checkable; track escalation rate |
| Measurement drift (baselines not comparable) | Medium | High | Fixed replay tasks, fixed starting commits, 2 repeats per phase, same template |
| Security/diagnostic suppression from aggressive brevity | Low | **Critical** | Hard rule: tests, diagnostics, warnings are never suppressed (acceptance criterion A6) |
