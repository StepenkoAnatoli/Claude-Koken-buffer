# EN3 — Session shaping (turns × context, and the mega-session tail)

**Claim:** cost = Σ over turns of (context × rate). The two multipliers you control are **how many turns
you take** and **how big the context is when you take them.** Restarting is *not* automatically cheaper —
it has a warm-up price.

## Mechanism & why it delivers

- Measured 170-turn Opus session: **$20.97 with caching vs $168.12 without**; **98.2% cache hit rate**;
  input-side traffic was **96%** of the bill and output **$0.79** of $20.97
  ([deep dive](https://www.claudecodecamp.com/p/claude-code-pricing)).
- **91% of total spend came from 80+ turn "mega-sessions"** (same source).
- Each session restart costs roughly **$0.60 of warm-up** — so "just open a new session" is a losing
  instinct unless the task actually changed.
- Cache TTL ~5 min: a pause longer than that rewrites the whole prefix at 1.25× base (12.5× the read
  price). Mitigation: `/compact` **before** the idle gap, and prefer `/compact` over `/clear` when work
  continues ([analysis](https://www.reddit.com/r/LLMDevs/comments/1ti7xlj/claude_code_cost_analysis_cache_rewarming_write/)).
- The most expensive moment in a session is **right after a compact** ($0.50–$1.00 restart overhead on
  API), because the new summary gets re-cached over the following turns.
- Failing-test-first specs collapse the usual 3–4 clarification turns into one — the one idea from the
  inspiration text that survives, but for the right reason: **it cuts turns**, not "token density".

## Implementation

- **Task-scoped sessions.** One coherent task per session; unrelated work → new session, but only after a
  handoff note exists.
- **Spec-first / test-first.** Write the task + a failing test + the acceptance check *before* the agent
  starts. This is the turn-compression mechanism.
- **Plan → build → verify** as explicit modes; don't let plan chatter accumulate into the build context.
- **Compact deliberately, not reactively:** `/compact` with instructions at ~60–70% of window (or set the
  auto-compact threshold lower, e.g. `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70`); never wait for a degraded
  auto-compact — you get the worst summary exactly when you need the best one.
- **Before any break > ~5 min:** compact so the next request doesn't pay a full-prefix rewrite.
- **Handoff file** (`HANDOFF.md`: done / next / open decisions / exact files) so the next session is cheap
  and deterministic instead of re-derived.
- **Cap the tail:** treat 80+ turn sessions as a smell; split at natural boundaries.

## Cost / risk / proof

| | |
|---|---|
| Effect size | Largest observed tail (91% of spend lived in mega-sessions). |
| Quality risk | Medium: naive "shorter sessions" pays warm-up repeatedly and loses context → more rework. Must be paired with handoff + compact-instead-of-clear. |
| Effort | Medium: workflow + template + 2 env knobs. |
| Enforceable by config | Partly (auto-compact threshold, statusline warnings). Session hygiene is otherwise human discipline → decays without instrumentation. |
| Time to proof | 1–2 weeks on real tasks (needs turns/task and $/task trend). |
| Kill criterion | If $/completed task does not fall after two weeks, revert to "keep the session warm" and stop splitting. |
