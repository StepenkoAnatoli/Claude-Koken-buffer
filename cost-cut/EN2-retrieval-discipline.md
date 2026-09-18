# EN2 — Per-turn retrieval discipline (shrink the working set)

**Claim:** in a mature session the dominant context mass is the *conversation tail* (file dumps, logs,
search results), not the prefix. Keep the working set small and keep noisy exploration out of the main thread.

## Mechanism

Two sub-levers:
1. **Read less.** Point at exact files/line ranges instead of letting the agent sweep the repo; don't
   re-read unchanged files; never let raw build/test/web output enter context unfiltered.
2. **Isolate noise.** Push exploratory search into **subagents**: their context dies with them and the
   main thread receives only the conclusion.

## Why it delivers

- Filtering tool output is where the biggest single compressions live: **80–99%** on build/test logs
  ([source](https://www.firecrawl.dev/blog/claude-code-token-efficiency)).
- Skills/rules with progressive disclosure cost ~**30–100 tokens at startup** and load full text only on
  invoke; path-scoped `.claude/rules/` cut always-loaded rule overhead ~41%.
- Subagents are the standard answer for "search without polluting the parent thread"
  ([best-practices roundup](https://rosmur.github.io/claudecode-best-practices/)).
- Context degradation is the primary failure mode of long sessions, so this is a **quality** lever too —
  up to the point where under-context causes wrong edits.

## Implementation

- Task template that names scope: *"Start with these files; do not scan the repo; only read imports if
  needed; summarise findings before editing."*
- Read ranges (`offset`/`limit`) over whole files; ban re-reads of unchanged files in the session prompt.
- Filter before injection: test output → failures only; build logs → last N lines; `BASH_MAX_OUTPUT_LENGTH`
  / `MAX_MCP_OUTPUT_TOKENS` caps (see EN1, item 5).
- `.claudeignore` + `permissions.deny` for `node_modules/`, `dist/`, `logs/`, `coverage/`, `*.log`.
- Subagent/Task for "where is X defined / how does Y work" questions; main thread gets a summary only.
- Skills and path-scoped rules instead of giant always-on instruction files.

## Cost / risk / proof

| | |
|---|---|
| Effect size | Large on the tail; unbounded upside in long sessions (logs are the classic 10x-blowup). |
| Quality risk | **Medium — this is the real trap.** Too little context ⇒ wrong edit ⇒ extra turn; a saved input token that costs a turn is a *loss* (a turn re-bills the whole context). |
| Effort | Medium: templates + conventions + optional hook/skill. |
| Enforceable by config | Partly (ignore lists, output caps, subagent defaults); "read less" is otherwise human discipline. |
| Time to proof | Days (needs turn-count + rework-rate tracking, not just token counts). |
| Guardrail | Bind the change to **turns per task and rework rate**; if either rises, the saving is fake. |
