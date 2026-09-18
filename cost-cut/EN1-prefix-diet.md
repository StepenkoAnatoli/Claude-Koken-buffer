# EN1 — Prefix diet + cache freeze

**Claim:** the cheapest token you ever pay for is the one you never send. Shrink the *always-resident*
payload (system prompt machinery, tool definitions, MCP tools, memory files, skills catalogue) and then
**stop mutating it mid-session**.

## Mechanism

Every request in Claude Code re-sends a stable prefix: system prompt, built-in tool defs, MCP tool defs,
`CLAUDE.md`/memory, skills catalogue, then the growing conversation. That prefix is a **flat tax on every
turn and on every cache write**. It is also the part compaction must carry and re-summarise.

Observed baselines: 20k–30k tokens load *before you type anything* in a normal project
([Firecrawl](https://www.firecrawl.dev/blog/claude-code-token-efficiency),
[/context writeup](https://www.jdhodges.com/blog/claude-code-context-slash-command-token-usage/)).
One team reported ~20k baseline in a monorepo (10% of a 200k window).

## Why it delivers (numbers, not vibes)

- Payload diet benchmark: `CLAUDE.md` **3,847 → 312 tokens** = **91.9% context reduction, no quality
  regression** ([source](https://www.firecrawl.dev/blog/claude-code-token-efficiency)).
- MCP tool definitions: commonly **10k–20k tokens per server per session**, injected on *every* request,
  even when the server is idle ([source](https://www.jdhodges.com/blog/claude-code-context-slash-command-token-usage/)).
  Caveat: `/context` **overstates** MCP cost because it counts the shared tool-use preamble once per tool
  ([measured: 45k reported vs ~15k real](https://www.async-let.com/posts/claude-code-mcp-token-reporting/)).
  Verify the delta with `count_tokens` on the real request, not by trusting the summed number.
- Cache economics: read = **0.1×** base input, write = **1.25×**; TTL is short (~5 min), so an idle gap
  forces a rewrite of the *whole prefix* at 12.5× the read rate
  ([cache-write analysis](https://www.reddit.com/r/LLMDevs/comments/1ti7xlj/claude_code_cost_analysis_cache_rewarming_write/)).
- Cache killers explicitly include **editing `CLAUDE.md` mid-session** and inconsistent file-load order
  ([summary](https://www.mindstudio.ai/blog/prompt-caching-claude-code-save-tokens)).

Because the prefix is re-sent on every turn, a 10k-token saving is paid back on **every** turn and every
cold start of every session — unlike a one-off output-token trick.

## Implementation (all config — no behaviour change required of the human)

> VERIFY each knob against the installed CLI version before adopting; names/enums move between releases.

1. **Baseline first:** run `/context`, record `System prompt`, `System tools`, `MCP tools`, `Memory`,
   `Skills`. Screenshot/paste into the repo as the "before".
2. **CLAUDE.md diet:** target ≤200 lines / ≤2k tokens (Anthropic guidance). Rule: *if the model can infer
   it from the code, or a senior dev figures it out in 20 minutes, delete it.* Keep only facts that
   prevent repeated mistakes. Move the rest to on-demand docs referenced only when relevant.
   (HTML comments are stripped before injection → free for human-facing notes.)
3. **Prune MCP:** disconnect servers not used by this job (`/mcp`). Prefer per-task MCP config
   (`--mcp-config`) over "everything connected always".
4. **Defer/remove tool defs:** enable tool search deferral (e.g. `ENABLE_TOOL_SEARCH=auto:5` on newer
   CLIs) and use **bare-name** `permissions.deny` entries (`"NotebookEdit"`) which remove the definition
   from the payload — scoped rules (`"Bash(rm *)"`) only block calls and still cost tokens
   ([source](https://www.aihero.dev/how-to-kill-the-bloat-in-claude-codes-system-prompt)).
5. **Cap output that becomes context:** `MAX_MCP_OUTPUT_TOKENS=8000`, `BASH_MAX_OUTPUT_LENGTH=20000`.
6. **Optional:** the "simple system prompt" mode drops long tool descriptions — evaluate, don't assume;
   it can remove guidance you actually want.
7. **Freeze rule:** no mid-session edits to `CLAUDE.md`/rules/settings; batch config changes to session
   boundaries. Keep file-load order deterministic.

## Cost / risk / proof

| | |
|---|---|
| Effect size | Bounded by baseline bloat: ~10k–25k tokens removed from **every** request. |
| Quality risk | **Low.** Diet rule is "delete what the model can infer"; keep error-preventing rules. |
| Effort | Hours. Config + one audit. No code. |
| Enforceable by config | **Yes** — this is the point. It does not depend on willpower. |
| Time to proof | Same day: `/context` before/after + tokens/turn on a fixed replay task. |
| Kill criterion | If a trimmed payload does not keep replay-task success ≥ baseline, restore the rule that mattered and re-measure. |
