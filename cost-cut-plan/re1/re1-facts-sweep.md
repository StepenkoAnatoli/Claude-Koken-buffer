# re1 — Facts sweep (≤ 1 hour, answers both plans' gates)

Purpose: resolve the **F-class** assumptions (see `re1-review-of-copilot-v2.md` §4.1) by reading facts that
already exist, instead of waiting for a benchmark programme. Fill the "Answer" column and this file becomes
the environment section both plans are missing.

Rules: no source code, no secrets, no prompts leave the machine. Numbers only. If a line cannot be answered
in the stated time, write `unavailable` — that is a valid result and it triggers the lite fallback (§4.3).

| # | Fact to read | How | Time | Answer |
|---|---|---|---|---|
| F1 | **Billing mode** — API key/Console, or Pro/Max subscription | account settings / how Claude Code is launched | 1 min | |
| F2 | **Primary objective** (follows from F1) | API → $/completed task; subscription → usage-window units/task; if both → weighted | 1 min | |
| F3 | **Output-token share of a recent session** | last session's `/cost` or usage page: output vs input vs cache read vs cache write | 5 min | |
| F4 | **Cache behavior confirmed** | same page: are cache-read and cache-write lines present and non-zero? | 2 min | |
| F5 | **Cache TTL check** | mid-session, idle ~10 min, then observe whether a cache-write appears on the next turn | 12 min | |
| F6 | **Resident payload census** | `/context` on a fresh session in the target repo: system prompt / system tools / MCP tools / memory / skills / messages | 5 min | |
| F7 | **Authoritative payload count** | count tokens on the real request if available; else record F6's tool line as a labelled proxy | 10 min | |
| F8 | **MCP inventory** | list connected servers; mark each used / unused for this project | 5 min | |
| F9 | **Memory size** | `CLAUDE.md` (+ rules) line count and token count; note anything inferable from code | 5 min | |
| F10 | **Session distribution** | last ~30 days: median and p90 turns per session; count of sessions >80 turns; whether logs exist at all | 10 min | |
| F11 | **Test suite available** | target repo: test command, approximate test count, runtime | 2 min | |
| F12 | **Client surfaces in scope** | CLI only / + IDE / + API-SDK / CI; note whether `/context` and `/cost` exist in each | 2 min | |
| F13 | **Adoption scope** | one machine or several; solo or team; does anything need to be checked in? | 2 min | |

## What each answer unlocks

| Fact | Unlocks / unblocks |
|---|---|
| F1 + F2 | The objective gate in `final/` and v2's `FINAL.md`; decides whether batch/EN4 pricing applies at all |
| F3 | Confirms or kills the "output is a minor term" premise that demoted patch-only and concise-policy to hygiene |
| F4 + F5 | Validates the cache model and the compact-before-idle rule (EN3a) |
| F6 + F7 | The EN1/I1 first experiment and its success measure (payload delta) |
| F8 + F9 | Immediate, reversible EN1 deletions — the fastest real saving available |
| F10 | Whether EN3b (session shaping) is worth planning at all |
| F11 | Whether quality gates can be test-based or must be review-based |
| F12 | Whether the measurement commands in both plans even exist |
| F13 | Where config must live (user-level vs checked in) |

## Output

Append the completed table to `DECISION-LOG.md` as a dated entry, labelled **environment facts, measured on
<date>**, and state which assumptions it confirms or refutes. Both plans' rankings should then be re-read
against the facts — that is the point of the sweep.
