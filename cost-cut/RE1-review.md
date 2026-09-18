# RE1 — Review: scoring the four, and why the popular advice underdelivers

## Scoring matrix

Scored 1–5 (`5` = best). "Delivers" = effect × reliability, not elegance.

| Option | Effect size | Low quality risk | Config-enforced (not willpower) | Time to proof | **Verdict** |
|---|---|---|---|---|---|
| **EN1** Prefix diet + freeze | 4 | 5 | 5 | 5 (same day) | **Best single move** |
| EN2 Retrieval discipline | 4 | 2 | 2 | 3 | Real, but last — fake savings hide here |
| EN3 Session shaping | 5 | 3 | 3 | 3 | Biggest tail; phase 2, enforced form only |
| EN4 Rate routing | 3 | 4 | 4 | 5 | Cheapest add-on; pair with EN1 on day 1 |

Two structural facts drive the ranking:

1. **Output tokens are ~3–7% of the bill.** Measured sessions: output was **$0.79 of $20.97** (3.8%)
   in a 170-turn session, and **~7%** in a 41-day dataset, where cache reads+writes were **~93%**.
2. **Cost ≈ turns × context × cache-adjusted rate.** Anything that does not reduce turns, context mass,
   or the rate is rounding error — and anything that *increases* turns (even while cutting tokens per
   turn) is a net loss.

## Teardown of the inspiration text (used as example, deliberately not followed)

**1. "Diff/patch-only output." — Technically correct, does not deliver.**
It attacks output tokens, i.e. the ~4% term. In Claude Code, edits are tool calls, not chat transcripts —
the model already doesn't re-print 500-line files into the conversation. And forcing patch round-trips can
**add turns**, which are the real multiplier. (Diff-shaped *edits* are still good for reviewability; that is
a quality argument, not a cost argument.) Net: ~0% savings, non-zero turn risk.

**2. "LSP / symbol queries." — Right direction, wrong first move.**
Precise retrieval genuinely beats whole-file reads. But Claude Code already has grep/glob and symbol-aware
search, so the marginal gain is smaller than it looks — and a custom LSP bridge is a *tooling project*
whose tool definitions become a **new flat tax on every request**. This is EN2's idea, delivered by a
subagent or narrow read ranges, at ~1% of the effort.

**3. "Test-driven prompting." — The one that survives — but not for the stated reason.**
A failing test is not valuable because it "compresses prose into a code block"; it is valuable because it
**removes 3–4 clarification turns and prevents wrong turns**. It is a *turn-reduction* mechanism, i.e. a
component of EN3, not a separate lever.

**4. "No-fluff system instruction." — Correct ceiling: ~4%.**
Output is the cheapest term in the model. Worse, in an agentic loop some narration and summaries are
*recovery* affordances: strip them and you pay later to re-derive state. Low ceiling, mild risk.

### Conclusion of RE1

The example optimises the cheapest term (output) and relies on behaviour change. The expensive terms are
**turns × context × rate**, and the only durable way to move them is **config**, not advice: advice decays
after the first busy week.

## Traps to write down now (so we don't rediscover them in month 2)

- **Fake savings:** fewer input tokens but more turns, or more rework. Always bind to *turns per completed
  task* and *rework rate*, not to tokens.
- **`/context` overstates MCP cost** (per-tool summing repeats shared preamble: 45k reported vs ~15k real).
  Use it for ranking, not for absolute claims.
- **`/clear` is not free:** it guarantees a cold start. `/compact` is cheaper when the work continues.
- **Restart cost:** ~$0.60 per restart warm-up; "many small sessions" can cost more than one warm session
  done properly.
- **Every new capability (MCP tool, skill, agent definition) is a recurring tax** on every request; adding
  helpers to save tokens can cost tokens.
