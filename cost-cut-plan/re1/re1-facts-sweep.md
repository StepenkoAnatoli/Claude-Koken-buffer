# re1 — Facts sweep (≤ 1 hour, answers both plans' gates)

Purpose: resolve the **F-class** assumptions (see `re1-review-of-copilot-v2.md` §4.1) by reading facts that
already exist, instead of waiting for a benchmark programme. Fill the "Answer" column and this file becomes
the environment section both plans are missing.

Rules: no source code, no secrets, no prompts leave the machine. Numbers only. If a line cannot be answered
in the stated time, write `unavailable` — that is a valid result and it triggers the lite fallback (§4.3).

## Sweep execution record — 2026-09-18 (Arena agent, this sandbox)

**Scope of what was actually possible here.** Executed from the sandbox for
`StepenkoAnatoli/Claude-Koken-buffer`. Three provenance classes are used below and are not interchangeable:

| Class | Meaning | Admissible as |
|---|---|---|
| **READ** | Read from a file or GitHub API response in this sandbox on 2026-09-18. Reproducible command given. | A repository-readable fact. **Not** a measurement of runtime behaviour. |
| **UNAVAIL** | Not answerable from this sandbox (no billing access, no session logs, no user machine). | An open item. Triggers the lite fallback. |
| **USER** | Only the user can answer (a choice, or data on their machine/account). | An open item. Blocks the step that needs it. |

Reproduce the READ rows with:
`gh repo list StepenkoAnatoli` and
`gh api repos/StepenkoAnatoli/WindowsRunner/git/trees/HEAD?recursive=1`,
`gh api repos/StepenkoAnatoli/WindowsRunner/contents/<path>`.
Nothing was executed in the target project; no dependency was installed there; no test was run there.

### Correction to a prior claim (A17)

The assumption register (A17) and the `DECISION-LOG.md` "Open" list both stated that this agent's sandbox has
**no access to the user's billing, session logs, or other repositories**, and concluded from that that the
target project could not be identified from here. **The "other repositories" half of that claim is false and
is hereby withdrawn.** `gh` in this sandbox is authenticated as `arena-ai-coding-agent[bot]` (installation
token) and can read the owner's public repositories: `gh repo list StepenkoAnatoli` returned three, and file
contents were readable via `gh api .../contents/<path>`. G1, G2, F9, F11 and parts of F4/F6/F7/F8/F16 are
therefore answered below from real reads rather than left blank.
The other half **stands**: `gh api user` returned `403 Resource not accessible by integration`, and there is
no billing data, usage page, session transcript, or Claude client in this sandbox. F1, F2, F3, F5, F10, F12,
F13, F14 remain genuinely unavailable here.

### Part 1 — environment facts (F1–F13)

| # | Fact to read | Answer | Class |
|---|---|---|---|
| F1 | **Billing mode** — API key/Console, or Pro/Max subscription | `unavailable` for the user's own coding client. One adjacent READ fact: the candidate target is BYO-key by design — `AGENTS.md` states "Users bring their own API keys; nothing phones home", and `providers/pricing.ts` prices per-MTok. Runs *inside that app* are therefore API-metered by construction; that says nothing about how the user pays for their coding client. | UNAVAIL (+1 READ) |
| F2 | **Primary objective** (follows from F1) | `unavailable` — this is choice C1, already deferred pending the bill. Not derivable from any file. | USER |
| F3 | **Output-token share of a recent session** | `unavailable` — no `/cost` output or session transcript in this sandbox. READ note that lowers the cost of getting it: the target already parses the provider usage block into `inputTokens` / `outputTokens` / `cacheReadTokens` / `cacheWriteTokens` (`providers/anthropic.ts` lines 131–140), so F3 needs **no new instrumentation**, only a logged run. | UNAVAIL (+1 READ) |
| F4 | **Cache behavior confirmed** | Confirmed **in code, not observed at runtime**. `providers/anthropic.ts` lines 89–90 send the whole system prompt as a **single** block with `cache_control: { type: 'ephemeral' }`; lines 139–140 read back `cache_read_input_tokens` and `cache_creation_input_tokens`. So caching is on for the Anthropic path and the read/write split is already captured. No runtime observation was made. | READ |
| F5 | **Cache TTL check** | `unavailable` — requires ~10 min idle then a live turn. No TTL is set in code, so the provider default applies; the "~5 min" figure in the external register stays **motivation only**. | UNAVAIL |
| F6 | **Resident payload census** | `/context` unavailable (no Claude client installed — see F12). The target computes the equivalent itself: `agent/context-budget.ts` `estimateRequest()` (lines 187–206) returns `systemTokens + toolsTokens + messagesTokens + outputReserve = total`. That is the in-repo census, and it is a **proxy** (see F7). | UNAVAIL (+1 READ) |
| F7 | **Authoritative payload count** | **No authoritative counter exists in the target.** `estimateTokens()` is `Math.ceil(text.length / 3.5)` (`context-budget.ts` line 28, 127–129) and `estimateToolsTokens()` adds a flat `TOKENS_PER_TOOL_BASE` per tool. Per the evidence-boundary rule this must be labelled a **heuristic proxy**, never an absolute. The only authoritative numbers available are the provider's own `usage` figures (F3/F4). Any payload delta reported from `estimateRequest()` must carry the proxy label. | READ |
| F8 | **MCP inventory** | Actual configured servers: `unavailable` (user machine). READ facts: the target **has** an MCP client (`test/mcp.test.ts`, `test/mcp-trust-baseline.test.ts`, `test/fixtures/fake-mcp-server.mjs`), so MCP is a real prunable surface there. Built-in tool surface: 10 tool modules under `packages/server/src/agent/tools/` (`apply-patch`, `error-report`, `fs`, `git`, `project-context`, `session-memory`, `skill`, `terminal`, `web`, `web-search`; `index.ts` and `types.ts` are not tools). | UNAVAIL (+2 READ) |
| F9 | **Memory size** | **Measured by read.** `WindowsRunner/AGENTS.md` = **59 lines, 385 words, 2,831 characters / 2,853 UTF-8 bytes → 809 tokens** by the app's own estimator (`ceil(chars / 3.5)`; characters, not bytes — the 22-byte gap is its em-dashes and typographic quotes). **No `CLAUDE.md` exists in that repo.** Load order is deterministic and hard-coded: `['AGENTS.md', 'CLAUDE.md', '.windows-runner/instructions.md', '.windows-runner.md']` then `~/.windows-runner/AGENTS.md` (`agent/prompt.ts` lines 5–10, 24–26). Caps: `MAX_KNOWLEDGE_CHARS` 12,000; `MAX_PROJECT_CONTEXT_CHARS` 16,000; `MAX_SESSION_MEMORY_CHARS` 8,000; `MAX_TOTAL_CONTEXT_CHARS` 28,000. Whether the user also has a `~/.windows-runner/AGENTS.md` is UNAVAIL. | READ |
| F10 | **Session distribution** | `unavailable` — no session logs in this sandbox. | UNAVAIL |
| F11 | **Test suite available** | **Measured by read — this is the strongest asset found.** 22 `*.test.ts` files (21 in `packages/server/test/`, 1 in `packages/web/test/`). Commands: `npm test` (→ per-workspace `packages/server`, `packages/web`) and `npm run typecheck`. CI `.github/workflows/ci.yml` runs typecheck + test on Node 20.x and 22.x (ubuntu) plus windows, packed-tarball and docker jobs, and its own header states **"No job needs an API key: the suite uses fake SSE providers and the mock provider only."** That means quality gates can be **test-based, deterministically, with no API spend** — which removes the main obstacle to a matched replay protocol. Runtime not measured (nothing was executed). | READ |
| F12 | **Client surfaces in scope** | In this sandbox: `claude` is **not on PATH**; `~/.claude`, `~/.claude.json`, `~/.config/claude*` do **not** exist. So `/context` and `/cost` cannot be run here at all. The candidate target ships its own surfaces instead: `wr` / `windows-runner` bin, Express + SSE server, React UI, optional Electron shell. | READ |
| F13 | **Adoption scope** | `unavailable` — number of machines / solo vs team / what must be checked in. | USER |

### Part 2 — target-project identification (required by C2 before phase 1)

Read from `gh repo list StepenkoAnatoli`, which returned exactly three public repositories:
`Claude-Koken-buffer` (this container, excluded by C2), `WindowsRunner` (TypeScript, 1,030 KB, pushed
2026-09-17T17:25:36Z), `Agent` (Python, 114 KB, pushed 2026-09-11T11:13:30Z).

| # | Item | Answer | Class |
|---|---|---|---|
| G1 | Repository where Claude coding work actually happens | **Proposed: `StepenkoAnatoli/WindowsRunner`.** It is the only candidate with an agent-instruction file, a test suite, and CI. Runner-up `StepenkoAnatoli/Agent` has neither an instruction file nor CI and only 2 test-matching paths. **Needs user confirmation — the real coding project may be private and invisible to this token.** | READ → USER |
| G2 | Branch or commit to freeze for replay | **Proposed: `main` @ `406bc654a2e8`** (2026-09-17T17:25:36Z, "Add files via upload"), the tip of `main` at sweep time. Freeze on user confirmation. | READ → USER |
| G3 | Execution client and provider | **Open, and this is the highest-value open question.** Two readings give different experiments: (a) the user drives **Claude Code** to develop WindowsRunner → `I1` means dieting `AGENTS.md`/`CLAUDE.md` and pruning MCP in the user's client config; (b) **WindowsRunner itself** is the client, calling the Anthropic API with the user's key → `I1` means dieting the system prompt that `agent/prompt.ts` + `agent/project-context.ts` assemble, and fixing cache-breakpoint placement in `providers/anthropic.ts`. (b) is measurable inside the repo with no billing access. | USER |
| G4 | Model and configuration in normal use | Partial READ: `MAX_STEPS` = `process.env.WINDOWS_RUNNER_MAX_STEPS ?? 120` (`loop.ts` line 29); providers = `anthropic`, `openai-compatible` (OpenAI/OpenRouter/Gemini/Ollama), `mock`. Default model, effort and MCP servers in the user's actual use: `unavailable`. | READ + UNAVAIL |
| G5 | Representative task set | `unavailable` — needs 2–3 of the user's recent real tasks, or permission to derive T1–T3 from WindowsRunner (candidate mapping in `DECISION-LOG.md`, 2026-09-18 entry). | USER |
| G6 | Permission to add phase-1 assets there | `unavailable` — **not granted as far as this repository knows.** Nothing has been written to WindowsRunner. | USER |
| G7 | Telemetry and report storage | Proposal only: reports in this container under `cost-cut-plan/reports/`; run telemetry stays local to the target (the app is local-first and "nothing phones home"). Needs user sign-off. | USER |

### Additional facts required by the C1 deferral

| # | Fact to read | Answer | Class |
|---|---|---|---|
| F14 | Usage-window behaviour (if subscription) | `unavailable` — no account access here. | UNAVAIL |
| F15 | Batch availability (if API) | No batch path exists **in the candidate target's** provider code: `providers/pricing.ts` (123 lines) has no batch concept, and no `batch` symbol appears in the repository tree. Whether the user's own client has a batch path: `unavailable`. | READ + UNAVAIL |
| F16 | Model-routing impact | Partial READ: `providers/pricing.ts` hard-codes per-MTok rates, including cache read/write columns — Sonnet-class 3 / 15 with cacheRead 0.3 and cacheWrite 3.75; Opus-class 15 / 75 with 1.5 / 18.75; Haiku-3.5-class 0.8 / 4 with 0.08 / 1. These are **published rates re-stated in the target's source**, i.e. still "published rates" under the evidence boundary — not our measurements, and not verified against the user's account. `isFreeProvider()` returns a zero-cost estimate for local providers, so a local/Ollama route would make `I4` moot. Account-specific quality deltas: `unavailable`. | READ + UNAVAIL |

## What each answer unlocks

| Fact | Unlocks / unblocks |
|---|---|
| F1 + F2 | The objective gate in `final/` and v2's `FINAL.md`; decides whether batch/EN4 pricing applies at all. **Still blocked — both USER.** |
| F3 | Confirms or kills the "output is a minor term" premise. Collectable in the target with no new code (usage already parsed). |
| F4 + F5 | Cache model: **half-confirmed in code** (single ephemeral block on the system prompt); TTL still unobserved. |
| F6 + F7 | The `I1` experiment and its success measure — but the measure must be labelled a **3.5 chars/token proxy**, or taken from provider `usage` instead. |
| F8 + F9 | Immediate, reversible `I1` deletions. F9 gives a concrete starting number: **809 tokens of `AGENTS.md`, no `CLAUDE.md` at all.** |
| F10 | Whether `I3` (session shaping) is worth planning at all. **Still blocked — UNAVAIL.** |
| F11 | Quality gates **can be test-based and API-key-free** in the candidate target. This is the single most useful result of the sweep. |
| F12 | The measurement commands `/context` and `/cost` **do not exist in this sandbox**; they must be run on the user's machine or replaced by the target's own usage events. |
| F13 | Where config must live (user-level vs checked in). **Still blocked — USER.** |
| G1–G7 | G1/G2 now have concrete proposals; **G3, G5, G6, G7 still block phase 1.** |
| F14–F16 | The C1 evidence set. F16 partially read; F14/F15 still open. Objective unit therefore **remains deferred** — nothing in this sweep resolves C1. |

## Net effect of this sweep on the plan

- **Confirmed:** the target project can be identified without waiting (G1/G2 proposed); the quality gate can be
  tests rather than review; caching and usage accounting already exist in the candidate target.
- **Refuted:** A17's claim that other repositories are unreachable from this sandbox.
- **Unchanged:** C1 (objective unit) is still deferred; **no savings are claimed**; `I1`-first is still a
  working hypothesis; phase 1 is still not started, because G3, G5, G6 and G7 are unanswered.

## Output

Appended to `DECISION-LOG.md` as a dated entry, labelled **environment facts, read on 2026-09-18**, stating
which assumptions it confirms or refutes. Note the deliberate wording: these are **read** facts, not measured
runtime behaviour — nothing was executed in the target project during this sweep.
