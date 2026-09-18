# FINAL — Recommendation

**Recommendation: EN1 (prefix diet + cache freeze) is the best of the four.** Adopt it first, paired with
EN4 as a same-day add-on. EN3 is admitted only in its *enforced* form (thresholds + handoff template).
EN2 comes last, because it is the option most likely to produce savings that are not real.

## Why EN1 wins — the "correct and it delivers" test

The user's bar is not "technically correct"; it is "correct and it actually delivers". EN1 passes all four
of those filters, and it is the only option that passes all four:

1. **It multiplies with everything else.** The prefix is re-sent on **every** turn and rewritten on every
   cold start at 1.25× base — a 10k-token cut is not a one-off, it is a permanent discount on the whole session.
2. **It is enforced by configuration, not by willpower.** MCP pruning, tool defs, output caps, memory diet,
   and the freeze rule live in files. Behavioural advice (EN2/EN3) decays; config does not.
3. **It cannot hurt quality if the diet rule is right** ("delete only what the model can infer"). The
   benchmark case — 3,847 → 312 tokens in `CLAUDE.md` with **no quality regression** — is exactly the
   shape we want: a large, measurable cut with zero downside.
4. **It is provable in one session.** `/context` before/after, plus tokens/turn on a fixed replay task.
   No two-week wait to learn whether it worked.

Selecting EN1 also *removes the trap the user is worried about*: no clever mechanism, no new tool surface
added to fight an old tool surface, no dependence on anyone behaving differently next month.

## Why the others are not the top pick (one line each)

- **EN2** — biggest measured compressions (80–99% on logs), but the failure mode is quality: too little
  context ⇒ wrong edit ⇒ an extra turn that re-bills everything. Ship it behind turn/rework guardrails.
- **EN3** — largest tail (91% of spend in 80+ turn sessions), but naive "shorter sessions" *increases*
  cost via ~$0.60 warm-ups; it must be paired with handoff + compact-instead-of-clear. Phase 2.
- **EN4** — great ROI, small ceiling alone (Opus→Sonnet ≈ 1.67× on published rates), and it gets dangerous
  the moment it is applied by "task sounds easy" instead of "success is machine-checkable".

## Rollout — PLAN ONLY, nothing applied yet

| Phase | What | Acceptance |
|---|---|---|
| **0. Instrument (day 0)** | `/context` snapshot; `/usage` or OTel export; pick 2–3 replay tasks; record tokens/turn, turns/task, cache-hit rate, $/task baseline. | Baseline exists and is reproducible. |
| **1. EN1 (days 1–3)** | Diet `CLAUDE.md` → ≤200 lines; prune/defer MCP + tool defs; cap outputs; freeze config mid-session. | Resident payload ↓ ≥30% (measured with `count_tokens`, **not** `/context`'s MCP number); replay-task success unchanged. |
| **2. EN4 (week 1)** | Default model per project; effort level low/medium for mechanical work; batch job for overnight sweeps. | Rate ↓ on mechanical class; escalation rate flat. |
| **3. EN3, enforced (week 2)** | Auto-compact threshold ~70%; compact-before-idle; task-scoped sessions + `HANDOFF.md`. | $/completed task ↓; no increase in rework rate. |
| **4. EN2, guarded (week 3, optional)** | Exact-file prompts, log filtering, subagents for exploration. | Turns/task must not rise; otherwise revert. |

**Program-level target:** ≥40% lower $ (or rate-limit consumption) per completed task over two weeks with
**test-pass and rework rates flat or better**. Quality is the binding constraint; tokens are the objective.

## Falsification test (do this before believing anything)

If, after Phase 1, per-turn tokens do **not** fall by roughly the size of the removed payload on the replay
tasks, then our cost model is wrong — stop, re-derive from `/cost` + OTel/`ccusage`, and re-rank the options.
A recommendation that cannot fail this test is not a recommendation, it is a slogan.

## Open questions for Copilot (the discussion agenda)

1. **Objective function:** are we minimising **API dollars**, or **subscription rate-limit headroom**
   (Pro/Max)? The levers overlap, but the metric and the dashboard differ. Pick one before Phase 0.
2. **Baseline:** do we accept a small replay harness as the measurement standard, and who owns it?
3. **Scope discipline:** do we accept EN1-first (safe, bounded) or go straight to EN1+EN3 (bigger tail,
   compliance risk)? My position: EN1 first — proof before behaviour change.
4. **Build vs adopt:** does this repo (`Claude-Koken-buffer`) become the home for a `settings.json` +
   `CLAUDE.md` template + statusline token-budget hook, or is measurement external?
5. **Quality gate ownership:** for EN4 downgrades, the user is the final verifier — do we allow any
   downgrade on tasks without a machine-checkable success criterion?
6. **Naming:** confirm `EN*` / `RE*` / `FINAL` marks mean what was intended; renaming is trivial.
