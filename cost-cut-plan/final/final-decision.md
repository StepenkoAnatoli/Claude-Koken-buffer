# final — Decision (PROPOSED, pending user verification)

**Status: proposed final. Not approved, not applied.** No code, configuration, or workflow change is made
until the user verifies this file.

## Decision

Adopt the staged plan in `final-implementation-plan.md`:

1. **`L1` Prefix diet + cache freeze — foundation, phase 1.** Diet the resident payload; stop mutating it
   mid-session.
2. **`L5` Rate routing — phase 1, paired.** Model tier by verifiability, effort/thinking budget, batch for
   overnight work.
3. **`L2` Tests / acceptance criteria as the task contract — phase 2.** The turn-reduction mechanism.
4. **`L4` Session shaping — phase 2, enforced only** (thresholds + handoff, compact ≠ clear).
5. **`L3` Retrieval discipline — phase 3, guarded**, LSP/index only if measurement demands it.
6. **`L6` diff-shaped edits and `L7` concise policy — standing hygiene**, off the critical path.

## Why this one (the "correct and it delivers" argument)

L1 passes all four filters that the other levers fail at least once:

1. **It multiplies.** The payload is re-sent on every request and rewritten at 1.25× base on every cold
   start (reads 0.1×). A 10k-token cut is a permanent discount on the whole session, and reduces what
   compaction must carry.
2. **It is enforced by files, not willpower.** MCP pruning, tool defs, output caps, memory diet, freeze rule
   live in configuration. Behavioural advice decays in week two; config does not.
3. **It cannot hurt quality under the right rule** ("delete only what the model can infer"). Benchmark
   precedent: `CLAUDE.md` 3,847 → 312 tokens, **no quality regression**.
4. **It is provable in one session** (`/context` + counted request before/after), so the plan either shows
   progress immediately or is corrected immediately.

## Why the alternatives are not the top pick

- **Patch-only output (`L6`)**: targets the ~4–7% term (output), and forcing patch round-trips can add
  turns, where each turn re-bills the whole context. Kept for reviewability.
- **Symbol/LSP context (`L3`)**: correct idea, but existing grep/glob/subagents cover most of it, and a new
  tool surface is a new per-request tax. Shipped last, behind guardrails.
- **Concise policy (`L7`)**: free, correct, ceiling ~4%. Hygiene, not strategy.
- **Naive session splitting (`L4` misuse)**: pays ~$0.60 warm-up per restart; must be paired with handoff
  and compact-instead-of-clear, and only in enforced form.

## What makes this decision fail (falsification test)

If, after phase 1, per-turn tokens on T1–T3 have **not** fallen by roughly the size of the removed payload
(measured on a captured request, not from `/context`'s MCP row), then the cost model behind this decision is
wrong: **stop, re-derive the model from `/cost` + per-turn logs, and re-rank the levers.** A plan that cannot
fail its own test is a slogan, not a decision.

## Conditions to move from PROPOSED to APPROVED (user sign-off)

| # | Condition | Owner |
|---|---|---|
| V1 | This decision is accepted, or amended in writing | user |
| V2 | Measurement plan accepted, including the falsification test | user |
| V3 | Acceptance criteria A1–A6 accepted as the definition of "delivered" | user |
| V4 | Disagreement with the ordering (L1/L5 before L2/L4 before L3) recorded before phase 1 starts | user + Copilot |
| V5 | Knob names (`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`, `MAX_MCP_OUTPUT_TOKENS`, `BASH_MAX_OUTPUT_LENGTH`, effort level, tool-search deferral) confirmed against the **installed** CLI version | Copilot |
| V6 | Rejection path confirmed: reverting config commits restores the baseline payload | Copilot |

## Non-negotiable rules carried from version 1

- Never suppress tests, diagnostics, or security warnings.
- Full-file output permitted on file creation and heavy refactors.
- Validate after every patch.
- Preserve enough context for architectural and cross-file changes.
- Optimise **cost per completed task**, never tokens per response.
