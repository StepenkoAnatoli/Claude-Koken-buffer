# DECISION-LOG

Dated decisions, evidence, and status. One log for the whole programme (merged from v2's DECISION-LOG idea).
Rule: hypotheses and conclusions never share a row — a hypothesis is labelled until it is measured.

## 2026-09-18 — en1 received
Version-1 plan: four approaches (patch-only output, symbol-focused context, tests as the task contract,
concise interaction policy) + staged guarded recommendation. Recorded in `en1/`.

## 2026-09-18 — re1 review of en1
Outcome: reordering, not rejection. Foundation moved from symbol retrieval to the **resident prefix**;
rate routing added; session shaping added; patch-only demoted to reviewability; concise policy demoted to
hygiene; tests-as-contract promoted (turn reduction, not prose compression). Falsification test added.
Option naming `EN1–EN4` retired. Evidence: community measurements, labelled as hypotheses.

## 2026-09-18 — en2 received (Copilot "Cost-cut plan v2")
Evidence-gated plan adding telemetry/privacy, ownership, rollback, matched protocol, quality rubric,
go/no-go gates. Ordering converges with `re1`: prefix diet first, rate routing second (provider-gated),
session shaping conditional, retrieval last. Recorded in `en2/`.

## 2026-09-18 — re1 review of v2
Outcome: **v2 accepted as the stronger plan on governance**; seven amendments proposed
(`re1/re1-review-of-copilot-v2.md` §4), five of them contributions v2 lacks:
facts-sweep split, piggyback protocol, candidate payload-tax rubric line, EN3a/EN3b split, EN1 cache-freeze half.
One earlier position withdrawn: phase-1 bundling of prefix-diet with rate routing (v2's causality rule is correct).
New dominant risk recorded: **governance overhead that never yields a verified saving for a one-person project.**
Canonical intervention IDs proposed: `I1`–`I4` (aliases: v2 `EN1–EN4`, re1 `L1–L7`).

## 2026-09-18 — Evidence boundary agreed (user + Copilot + Arena)
Agreed and now binding: the figures used throughout this folder (93% cache share of spend, ~$0.79 output in a
$20.97 session, ~$0.60 restart warm-up, 20–30k cold-start payload, and the rest) are **external community
measurements**. They may justify why a hypothesis is worth testing; they may **not** appear as repository
results, forecast inputs, or acceptance criteria until reproduced here. This repository has no telemetry,
billing data, or task history, so it **claims no savings**. Ranking is replaced by a conditional chain:
(1) instrument; (2) identify dollars vs capacity vs both; (3) reproduce measurements; (4) benchmark `EN1`/`I1`
and the other candidates under the matched protocol; (5) rank from repository-specific evidence. Until step 5,
`I1`-first is a **working hypothesis**. Dependency recorded: API dollars → rate routing (`I4`/EN4) may be
valuable; subscription/rate-limit headroom → rate-routing assumptions may not apply and the recurring-prefix
intervention (`I1`/EN1) becomes more important. Binding on all documents — see `re1/re1-evidence-boundary.md`.

## 2026-09-18 — Assumption register merged (v2 of the register)
Merged the two independent assumption tables (mine A1–A10, Copilot v2's A1–A8) into one current register with
classes: **F** = readable fact, **C** = choice, **B** = benchmark-measurable, **D** = distributional over
weeks. Route, owner, and consequence of error recorded per row; closed items (doc-only scope, folder/naming,
repo-sourced thresholds) marked as agreed. New entry **A17**: the facts sweep must be executed by the user —
my sandbox has no access to their billing, session logs, or other repositories, so the critical path runs
through their reading, not through more planning. Nine previously silent assumptions are now stated
explicitly (§3 of the register), including this one and the reading of "Koken" as "token".
Two items are decision-critical and not discoverable by any measurement: **C1** objective unit/weighting and
**C2** the role of this repository. Both were asked again (sharper, two questions instead of four). If they
remain unanswered, the position is *not guessed*: C2 blocks phase-1 asset placement, C1 blocks the ranking
step; phase 0 and the sweep remain possible. Trade-offs T1–T6 recorded.

## 2026-09-18 — C1 answered: objective unit DEFERRED (decide from the bill)
Decision: do not choose dollars vs capacity now; **defer pending billing/usage verification**. Phase 0 may
begin immediately; the **final ranking must not be finalised** until the bill or usage page identifies the
active constraint. Evidence required before ranking: billing model, usage-window behaviour, token/cost
visibility, batch availability, model-routing impact (F1/F2/F14–F16). **Temporary planning rule in force:
`I1`/EN1 is the only cross-constraint candidate; `I4`/EN4 stays conditional with its rank deferred; no
savings are claimed.** Rationale: avoids silently assuming pay-per-token billing; prevents prioritising rate
routing where batch/model-rate routing may not exist; keeps `I1` valid under either constraint; keeps fact
collection separate from recommendation; reversible.

## 2026-09-18 — C2 answered: this repository is a PLAN CONTAINER only
Decision: `Claude-Koken-buffer` holds planning, decision, experiment-design, and reporting material.
**Phase-1 assets (target `CLAUDE.md`, target settings, replay tasks) must live in the actual measured target
project or execution environment — not here.** Measurement cannot begin until that target is identified;
treating this repo as the working project would invent a workload and make phase-1 measurements meaningless.
**Open prerequisite (A23): identify the target project and record** — owner/name; branch or commit for replay;
execution client and provider; model and configuration; representative task set; permission to add phase-1
assets there; where telemetry and reports are stored. Until then: phase 0 proceeds as **design work only**
(protocol, templates, report structure, facts sweep); phase 1 is not implemented or measured.

## 2026-09-18 — Environment facts, **read** on 2026-09-18 (facts sweep executed)
The facts sweep was executed from this sandbox. Full record with per-row provenance:
[`re1/re1-facts-sweep.md`](re1/re1-facts-sweep.md). Deliberate wording: these facts were **read** from files
and GitHub API responses, not measured at runtime — nothing was executed in the target project.

**One prior claim in this log is withdrawn.** The entry above ("Assumption register merged") and A17 stated
that this agent's sandbox has no access to the user's *other repositories*, and the Open list concluded from
that that the target project could not be identified from here. **That half is false.** `gh` in this sandbox is
authenticated as `arena-ai-coding-agent[bot]` and reads the owner's public repositories; `gh repo list
StepenkoAnatoli` returned three. The other half of A17 stands and is unchanged: there is no billing data,
usage page, session transcript, or Claude client here (`gh api user` → 403; `claude` not on PATH; no
`~/.claude`). The sweep was therefore split by owner instead of handed wholesale to the user.

Facts read (all reproducible via `gh api repos/StepenkoAnatoli/WindowsRunner/...`):

| Fact | Value read | Effect |
|---|---|---|
| Candidate targets | exactly 3 public repos: this container; `WindowsRunner` (TypeScript, 1,030 KB, pushed 2026-09-17); `Agent` (Python, 114 KB, pushed 2026-09-11) | G1 has a concrete proposal instead of a blank |
| **F11 tests** | 22 `*.test.ts`; `npm test` + `npm run typecheck`; CI on Node 20.x/22.x + windows + packed + docker; CI header: *"No job needs an API key: the suite uses fake SSE providers and the mock provider only."* | **A15 confirmed.** Quality gates can be test-based and spend-free — the biggest obstacle to a matched replay protocol is removed |
| **F9 memory** | `WindowsRunner/AGENTS.md` = 59 lines / 385 words / 2,831 chars (2,853 UTF-8 bytes) → **809 tokens** by the app's own `ceil(chars/3.5)` estimator. **No `CLAUDE.md` in that repo.** Load order hard-coded and deterministic: `AGENTS.md`, `CLAUDE.md`, `.windows-runner/instructions.md`, `.windows-runner.md`, then `~/.windows-runner/AGENTS.md` | `I1`'s "keep file-load order deterministic" requirement is **already satisfied** by construction; the dietable surface is 809 tokens, not an unknown |
| **F4 cache** | `providers/anthropic.ts` lines 89–90 send the entire system prompt as a **single** block with `cache_control: {type:'ephemeral'}`; lines 139–140 read back `cache_read_input_tokens` / `cache_creation_input_tokens` | Caching is on and the read/write split is **already captured** — F3/F4 need no new instrumentation |
| **F7 payload count** | no provider `count_tokens` call anywhere; `estimateTokens()` = `ceil(len / 3.5)` (`context-budget.ts` 28, 127–129) | Any payload delta from `estimateRequest()` must be labelled a **heuristic proxy**. Authoritative numbers only from provider `usage` |
| **F8 tools/MCP** | MCP client present (`test/mcp.test.ts`, `mcp-trust-baseline.test.ts`, `fixtures/fake-mcp-server.mjs`); 10 built-in tool modules under `agent/tools/` | MCP is a real prunable surface in the target; configured servers still unknown (user machine) |
| **F15/F16** | no batch concept in `providers/pricing.ts` (123 lines); that file hard-codes per-MTok rates incl. cache read/write (Sonnet-class 3/15 + 0.3/3.75; Opus-class 15/75 + 1.5/18.75); `isFreeProvider()` zeroes cost for local providers | Batch routing has no counterpart in the target; a local/Ollama route would make `I4` moot. Rates are **published rates re-stated in source** — still motivation only under the evidence boundary |
| **F12 surfaces** | `claude` not on PATH; `~/.claude`, `~/.claude.json`, `~/.config/claude*` absent | `/context` and `/cost` cannot be run here at all; baseline must come from the user's machine or the target's usage events |

Still `unavailable` after the sweep: F1 (billing), F2 (objective), F3 (session split), F5 (TTL), F10 (session
distribution), F13 (adoption scope), F14 (usage window). **C1 therefore remains deferred — this sweep did not
resolve the objective unit, and no ranking is unblocked by it.**

## 2026-09-18 — G1/G2 proposed (A23 narrowed, not closed)
Read from GitHub, pending user confirmation:

- **G1 (target):** `StepenkoAnatoli/WindowsRunner` — the only candidate with an agent-instruction file, a test
  suite, and CI. `StepenkoAnatoli/Agent` has no instruction file, no CI, and 2 test-matching paths. This
  container is excluded by C2.
- **G2 (freeze):** `main` @ `406bc654a2e8` (2026-09-17T17:25:36Z), the tip of `main` at sweep time.
- **G4 (partial):** `MAX_STEPS` = `process.env.WINDOWS_RUNNER_MAX_STEPS ?? 120` (`loop.ts` line 29); providers
  `anthropic`, `openai-compatible`, `mock`. Default model/effort/MCP in the user's actual use: unknown.

**G3 is the decision that changes what `I1` even means**, and it is not answerable from a repository:

| G3 reading | What `I1` becomes | Measurable without billing? |
|---|---|---|
| (a) user drives **Claude Code** to develop WindowsRunner | diet `AGENTS.md`/`CLAUDE.md`, prune MCP servers in the user's client config, freeze config mid-session | No — needs `/cost` on the user's machine |
| (b) **WindowsRunner itself** is the client, calling the Anthropic API with the user's key | diet the system prompt assembled by `agent/prompt.ts` + `agent/project-context.ts`; fix cache-breakpoint placement in `providers/anthropic.ts` | **Yes** — its own `usage` events report cache read/write, and `npm test` is the spend-free quality gate |

**Phase 1 remains not started.** G3, G5, G6 and G7 are unanswered; G6 (permission to write to WindowsRunner) is
explicitly **not granted** as far as this repository knows, and nothing has been written there.

## 2026-09-18 — Hypothesis H-cache recorded (labelled hypothesis, not a result)
While reading the proposed target, one code-level mechanism was found that matches `I1`'s "cache freeze" half.
It is recorded here as a **hypothesis to test**, and per the evidence boundary it may not be quoted as a
finding, a saving, or a gate:

- `runAgent()` (`loop.ts` line 145) reads session memory at line 158 and rebuilds the system prompt at line 179
  — i.e. **the system prompt is reconstructed on every user turn**, with session memory in the middle of it
  (`prompt.ts` line 97 order: project context, then session memory, then project instructions).
- `providers/anthropic.ts` lines 89–90 put a **single** `cache_control` breakpoint at the end of the whole
  system block.
- The `session_memory` tool supports `append` and `replace` (`agent/tools/session-memory.ts` lines 44–51, 77).

**H-cache:** if the model appends to session memory during turn *N*, the system block differs on turn *N+1*,
and with one breakpoint at the end of that block the cached prefix cannot be reused — the next request should
show a cache **write** where a cache **read** was available. **Falsifier:** run two turns in the target with a
memory append between them and compare `cacheReadTokens` / `cacheWriteTokens` from its own usage events. If
turn *N+1* still reports a cache read, H-cache is wrong. Nothing here has been executed; this is a static read
of source at `406bc654a2e8`.

## Open — blocks both plans
1. **Target project narrowed but not confirmed** (A23) → still blocks phase 1 and *all* measurement. Proposed
   and awaiting the user: G1 `StepenkoAnatoli/WindowsRunner`, G2 `main` @ `406bc654a2e8`. Still unanswered:
   G3 client+provider, G4 model/config in normal use, G5 task set, G6 permission to write there, G7 telemetry
   and report storage. Phase 0 proceeds meanwhile as design work (protocol, templates, report structure).
2. **Objective unit not chosen** (C1 deferred) → blocks the final ranking and the A2/A5 threshold units.
   Evidence set: billing model, usage-window behaviour, token/cost visibility, batch availability,
   model-routing impact (F1/F2/F14–F16). **The 2026-09-18 sweep did not resolve this.**
3. Environment facts: F8, F9, F11, F12, F16 were **read** on 2026-09-18 (see `re1/re1-facts-sweep.md`).
   F1, F2, F3, F5, F10, F13, F14 remain unavailable from this sandbox and are the user's to read — billing,
   usage page, session transcripts, and their own machine. The earlier statement that *none* of F1–F16 could
   be done by this agent is withdrawn: repository-readable facts can be, and now have been.

Status of the programme: **planning only. Nothing implemented, configured, or routed anywhere.**
Nothing has been written to `WindowsRunner` or any other repository.
No claim of savings is made anywhere in this repository.
