# re1 — Arena feedback on the version-1 plan

> **Evidence boundary (binding):** the figures in §2 are **external community measurements**, cited as
> motivation only — not repository results, forecast inputs, or acceptance criteria. See
> `re1-evidence-boundary.md`.

Reviewer: Arena AI. Target: `en1/` (four approaches P1–P4 + staged recommendation).
Purpose: state what holds, what is missing, and what must change before this becomes the `final` plan.
Standard applied: **"correct and it delivers"** — a lever counts only if it moves a measured metric on
total task cost without degrading quality. Technically true but immaterial ideas are rejected.

## 1. What version 1 got right (keep as-is)

1. **Plan-only discipline.** No implementation before measurement and verification. Correct and non-negotiable.
2. **Baseline before change**, on representative tasks. The proposed metrics (turns, test-pass, regression,
   total token use) are the right family; only the cache split and per-completed-task cost were missing —
   added in `re1-comparison-and-risks.md` and `../final/final-measurement-plan.md`.
3. **"Total task cost, not tokens per response."** This is the most important sentence in version 1 and it
   is exactly the right objective. Version 2 keeps it as the primary KPI.
4. **The guardrails**, especially: never suppress tests/diagnostics/security warnings; allow full-file output
   when patches are unreliable; validate after every patch; keep enough context for cross-file changes.
   All four are preserved verbatim in substance.
5. **P3 in its reclassified form.** Expressing the requirement as a failing test / acceptance criterion is
   the single best *turn-reduction* mechanism available, and version 1 identified it. Its value is that it
   removes clarification turns, not that it "compresses prose".

## 2. What version 1 is missing (the material gap)

Version 1 optimises **response length** and **lookup size**. Neither is where the money is.

| Term | Measured share of bill | Source |
|---|---|---|
| Cache reads + writes (input side) | **~93%** of a 41-day dataset | [LLMDevs analysis](https://www.reddit.com/r/LLMDevs/comments/1ti7xlj/claude_code_cost_analysis_cache_rewarming_write/) |
| Output tokens | **~7%** (41-day dataset); **$0.79 of $20.97** in a 170-turn session; entire session output $0.79 vs ~$20.18 input | [same](https://www.reddit.com/r/LLMDevs/comments/1ti7xlj/claude_code_cost_analysis_cache_rewarming_write/), [Claude Code pricing deep dive](https://www.claudecodecamp.com/p/claude-code-pricing) |
| 80+ turn sessions' share of total spend | **91%** | [Claude Code pricing deep dive](https://www.claudecodecamp.com/p/claude-code-pricing) |
| Restart warm-up cost | ~**$0.60** per restart; ~$0.50–$1.00 after a compact | [same](https://www.claudecodecamp.com/p/claude-code-pricing) |

Consequences for P1–P4:

- **P1 (patch-only) targets the ~4–7% term.** In an agentic loop, edits are tool calls; the model is not
  re-printing 500-line files into the conversation by default. Forcing patch round-trips can *add turns*,
  and a turn re-bills the whole context. Expected saving ≈ 0, turn-risk > 0.
  (Diff-shaped edits remain good for reviewability — a quality argument, not a cost argument.)
- **P4 (concise policy) also targets the ~4–7% term**, and its own stated risk ("excessive brevity hides
  assumptions") is real: some narration and summaries are recovery state. Low ceiling, mild risk.
- **P2 (symbol context)** is directionally right, but Claude Code already ships grep/glob and symbol-aware
  search; the marginal gain is smaller than advertised, and a custom LSP/index bridge is a *tooling project*
  whose tool definitions become a **new recurring flat tax on every request**. Correct idea, wrong first move.
- **P3 (tests as contract)** is right, and is the only one of the four that reduces **turns** — the real
  multiplier. It survives into version 2 as `L2`.

The three levers version 1 does not have at all:

- **The resident payload** (system prompt machinery, built-in tool defs, MCP tool defs, memory, skills
  catalogue) is re-sent on **every** request and rewritten at **1.25×** base on every cache miss after a
  >5 min gap, while reads cost only **0.1×**. Observed cold-start payload: **20k–30k tokens before the user
  types anything** ([Firecrawl](https://www.firecrawl.dev/blog/claude-code-token-efficiency),
  [/context guide](https://www.jdhodges.com/blog/claude-code-context-slash-command-token-usage/)).
  MCP servers commonly add **10k–20k tokens per server, per session**
  ([same](https://www.jdhodges.com/blog/claude-code-context-slash-command-token-usage/)).
  Diet benchmark: `CLAUDE.md` **3,847 → 312 tokens = 91.9% reduction with no quality regression**
  ([Firecrawl](https://www.firecrawl.dev/blog/claude-code-token-efficiency)).
- **Session economics:** compact vs clear, cache TTL and idle rewrites, mega-session growth.
- **Rate routing:** published rates Sonnet **$3/$15**, Opus **$5/$25**, Haiku **$1/$5**, batch **−50%**
  ([per-token math](https://www.morphllm.com/claude-code-api-cost)); extended thinking is billed output.

## 3. What must change in the plan

| # | Change | Reason |
|---|---|---|
| C1 | Add `L1` prefix diet + cache freeze; make it the **foundation** and the first implementation phase. | Re-billed every turn, config-enforced, same-day provable, no quality risk under a "delete only what the model can infer" rule. |
| C2 | Add `L5` rate routing (model tier, effort/thinking budget, batch). | Immediate multiplier on the remaining tokens; zero planning cost; bounded only by the escalation rate. |
| C3 | Keep `P3` but rename its justification: turn compression, not prose compression. | It is the only version-1 lever that moves turns. |
| C4 | Demote `P1` to a standing reviewability practice (`L6`) with an explicit "never force a patch round-trip when a direct edit is available" rule. | ~4% ceiling; turn/apply-failure risk. |
| C5 | Demote `P4` to hygiene (`L7`); drop it from the critical path. | ~4% ceiling; brevity can hide assumptions (its own stated risk). |
| C6 | Rewrite `P2` as `L3`: exact-file scoping, filtered tool output, subagents — build the LSP/index only if measured data proves the need. | Existing tools cover most of it; a new tool surface is a new per-request tax. |
| C7 | Add `L4` session shaping with **enforced** knobs (auto-compact threshold, compact-before-idle, handoff file), not advice. | 91% of spend lives in 80+ turn sessions; naive "shorter sessions" pays warm-up repeatedly. |
| C8 | Reorder rollout: baseline → L1 (+L5) → L2/L4 → L3 guarded → L6/L7 as standing practice. | Front-load config-enforced, quality-safe, same-day-provable moves; guard the one lever that can fake savings. |
| C9 | Retire the option naming `EN1–EN4`. | It collides with the user's version marks (`en1` = version 1). Options are now `L1–L7`. |
| C10 | Add a falsification test and per-lever kill criteria. | A recommendation that cannot fail its own test is a slogan. |

## 4. Where reviewers are likely to disagree with this feedback (stated up front)

- **"Nothing in the four approaches can be wrong."** True individually; the error is relative weight and
  ordering, not truth. The plan's *composition* is what is being corrected.
- **The evidence base is community measurement, not our own instrumentation.** Accepted and mitigated:
  the `final` plan treats second-hand numbers as *ranking hypotheses* that must be confirmed on T1–T3
  before any claim is made. The falsification test exists for exactly this reason.
- **"Prefix diet is just documentation hygiene."** Agreed it is unglamorous; that is why it gets done.
  It is the only lever that is simultaneously config-enforced, quality-safe, and provable in one session.
