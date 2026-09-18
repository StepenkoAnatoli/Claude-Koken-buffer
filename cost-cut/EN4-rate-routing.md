# EN4 — Rate routing (model / effort / batch)

**Claim:** after you stop sending waste, the remaining lever is the **price per token**. Same work, lower rate.

## Mechanism

1. **Model routing:** mechanical/boilerplate/rename/format/mechanical-test work on the cheapest capable
   model; the expensive model only for planning, architecture, and ambiguous debugging.
   Published rates (2026): Sonnet **$3/$15** per M in/out, Opus **$5/$25**, Haiku **$1/$5**
   ([source](https://www.morphllm.com/claude-code-api-cost)). One report claims up to **75% cost
   reduction** from deliberate routing
   ([source](https://www.firecrawl.dev/blog/claude-code-token-efficiency)) — treat as a ceiling, not a promise.
2. **Effort/thinking budget:** extended thinking tokens are **output** tokens, billed, even though the user
   only sees a summary. Mechanical tasks rarely need deep thinking; set effort low/medium
   (`CLAUDE_CODE_EFFORT_LEVEL`, verify enum) for them.
3. **Batch pricing (−50% input and output)** for anything that tolerates 24h turnaround: large refactors
   enumerated overnight, CI sweeps, doc generation, eval runs. Not for interactive sessions.

## The rule that keeps it from backfiring

Downgrade the model **only where an automated check decides success** (tests, lint, type check, diff
review). Where success is judgement-based, keep the strong model — a cheap wrong answer costs more than
the expensive right one, because you pay for the whole context again to redo it.

## Cost / risk / proof

| | |
|---|---|
| Effect size | Immediate multiplier on every remaining token; bounded by routing share × price gap (Opus→Sonnet ≈ 1.67× on the rates above; much larger if you were on Opus for mechanical work). |
| Quality risk | Medium-low **with the rule above**; high if applied by task-sounding-hard rather than by verifiability. |
| Effort | Low: config + a routing rule + a habit. |
| Enforceable by config | Mostly yes (per-project default model, effort env, batch scripts). |
| Time to proof | Same day for rate; 1 week for escalation rate. |
| Guardrail | Track **escalation rate** (tasks re-run on a stronger model). If it rises, the routing threshold is wrong. |
