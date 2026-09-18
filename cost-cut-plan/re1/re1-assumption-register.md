# re1 — Assumption register (v2, merged and current)

Merges: my earlier A1–A10 register, Copilot v2's A1–A8 table, the agreed evidence boundary
(`re1-evidence-boundary.md`), and the facts sweep (`re1-facts-sweep.md`). Nothing here is new evidence.
Purpose: no requirement is guessed silently; every unknown has a class, an owner, a route, and a stated
consequence of error.

## 1. Classes (the route to resolution, not the confidence level)

| Class | Meaning | Route | Owner |
|---|---|---|---|
| **F** | Fact that can be read in minutes (bill, CLI, repo) | facts sweep F1–F13 | user |
| **C** | Choice — a value, not discoverable anywhere | must be decided | user |
| **B** | Measurable only by matched benchmark runs | task matrix + protocol | user + Copilot |
| **D** | Measurable only over weeks of real use (behaviour, distribution) | telemetry/ledger | user |

## 2. Register

| ID | Assumption / unknown | Class | Aliases | Status | If wrong → consequence of error | Route |
|---|---|---|---|---|---|---|
| A1 | Billing mode: API key/Console vs subscription | F | my A1, v2 A1 (part) | **open** | The programme optimises a quantity that is never paid | F1 |
| A2 | Objective unit: dollars, capacity units, or weighted | C | v2 objective gate | **open — ASKED** | Two dashboards silently mixed; comparisons invalid | C1 / F2 |
| A3 | Client surfaces in scope: CLI / IDE / API-SDK / CI | F | my A3 | **open** | Knobs and `/context`,`/cost` may not exist on that surface; measurement plan void | F12 |
| A4 | Adoption scope: one machine, several, team, CI | F + C | my A6, v2 ROLLOUT roles | **open** | Config applied at the wrong layer (user-level where it must be checked in); role assignment becomes fiction for a solo user | F13 |
| A5 | Config knobs exist and behave in the installed version | F | my A4 | **open** | Failure is **silent** — no error, no effect, and the plan reports "no saving" without knowing why | V5 + phase-1 falsification |
| A6 | The recurring prefix is billed or consumes capacity on each request | F | v2 A1 | **open** | `I1` may have no value at all | F3/F4 + counted request (F7) |
| A7 | Cache behaves as expected (read/write rates, TTL) | F | v2 A2 | **open** | `I1` saving estimate wrong; compact-before-idle rule wrong in either direction | F4/F5 |
| A8 | Some prefix content is safely inferable → deletable | B + judgement | v2 A3 | **open** | Quality or safety regression weeks later | diet rule + reversible commits + 2-week review |
| A9 | Output tokens are a minor cost term | F | v2 A4 | **open** | Wrong lever prioritised — this is what demotes patch-only and concise policy to hygiene; if output is large here, that ranking flips | F3 |
| A10 | Long sessions materially raise completed-task cost | D | v2 A5 | **open** | `I3` adds friction for nothing | F10 + distribution |
| A11 | Cheaper routes can handle eligible work | B | v2 A6 | **open** | Rework and defects on downgraded tasks | matched benchmark + verifiability rule |
| A12 | Targeted retrieval suffices for the chosen task classes | B | v2 A7, my old register A7 | **open** | Wrong edits; the classic fake saving (fewer tokens, more turns) | benchmark + omission analysis, guarded by turns |
| A13 | Users follow the workflow if it is visible/reversible/low-friction | D | v2 A8 | **open** | Bypass; plan decays into documentation | mitigation: only config-enforced levers on the critical path |
| A14 | Replay tasks are reproducible from fixed commits here | F | my A8 | **open** | Phase gates degrade to bookkeeping | phase-0 dry run |
| A15 | The target project has a usable test suite | F | my A10 | **confirmed by read 2026-09-18** for the proposed target: 22 `*.test.ts`, `npm test` + `npm run typecheck`, CI on Node 20/22 + windows, and CI's own header states no API key is needed | (consequence avoided) quality gates can be test-based and spend-free | F11 — read, not executed |
| A16 | This repository is where the plan is applied | C | my A7 | **CLOSED — plan container only**; implementation target **not yet identified** | Phase 1 would change a repo that is not measured → effort invisible and unrepeatable | C2 answered 2026-09-18 |
| A23 | The identity of the measured target project is known | C | — (**new**) | **narrowed 2026-09-18, not closed** — G1 proposed as `StepenkoAnatoli/WindowsRunner`, G2 proposed as `main` @ `406bc654a2e8`, both read from GitHub. G3/G5/G6/G7 still open, so phase 1 is still blocked | "Phase 1" has nowhere legitimate to live and nothing to measure; benchmarks would be invented rather than representative | user confirms G1/G2 and answers G3/G5/G6/G7 |
| A17 | The facts sweep is owned and executed **only** by the user, because the agent has no access to their repositories | C | — (**new, was silent**) | **PARTLY REFUTED 2026-09-18.** The "no access to other repositories" half is false: `gh` here reads the owner's public repos, so G1/G2/F8/F9/F11 were answered by the agent. The billing/session-log half **stands**: F1–F3, F5, F10, F13, F14 remain user-owned | If left as written, readable facts sit unanswered while both sides wait for the user — exactly what happened | ownership split: agent reads repositories; user reads billing, usage and their own machine |
| A18 | Measurement commands are available in the environment | F | my A3 (part) | **refuted for this sandbox 2026-09-18**: `claude` is not on PATH and `~/.claude`/`~/.claude.json` do not exist, so `/context` and `/cost` cannot be run here. Substitute available in the proposed target: its own parsed `usage` events | Phase 0 cannot produce a baseline **here**; it must run on the user's machine or through the target's usage events | F12 — read |
| A19 | Quality is judged by test results + user review | F | my A10 | **open** | "Quality flat" asserted, not evidenced | F11 + F15 |
| A20 | Plan is documentation-only for now; no tooling, config, or routing built | C | user instruction | **closed — agreed** | — | — |
| A21 | Folder `cost-cut-plan/`, version marks `en1`/`en2`/`re1`/`final`, canonical IDs `I1–I4` | C | user instruction | **closed — agreed** | — | — |
| A22 | Numeric thresholds must come from this repo's baseline | C | user instruction | **closed — agreed** | — | — |

## 3. Assumptions I was making silently — now explicit

These are the ones a reader could not have inferred from the documents. Stating them is not the same as
validating them; each is now falsifiable.

1. **The pasted policy text is a directive to me and applies to this plan's documents.** If it was instead a
   note intended for the Copilot handoff, the content of the work is unchanged — this register is shared —
   but I would not have needed to restate the register.
2. **I cannot read the user's account, billing, or session logs, and I have no access to their other
   repositories.** My sandbox is isolated. Consequence: **the facts sweep must be executed by the user**;
   the programme's critical path runs through ten minutes of their reading, not through more planning.
3. **"Koken" is a stylised spelling of "token"**, and the repo's purpose is token-cost reduction — not a
   product or codename named Koken.
4. **The target is Claude Code–style interactive coding usage** (basis: v2's client/provider language and
   the session commands discussed). If the real target is raw API/SDK agent builds, several F-class answers
   change and the measurement plan is rewritten.
5. **Only markdown planning artifacts are wanted at this stage** — no CI, scripts, config, or routing.
6. **The community figures are ranking hypotheses, nothing more** — now formalised in the evidence boundary;
   if output turns out to be a large term here, the demotion of patch-only and concise policy reverses.
7. **No translation or localisation is requested**; documents are English-only.
8. **The user is the sole approval authority**; Copilot consensus is desirable but does not substitute for
   sign-off V1–V7.
9. **Version marks and canonical IDs are acceptable** — no objection raised to the `I1–I4` aliasing.

## 4. Decisions taken on the two choice-class items (2026-09-18)

### C1 — Objective unit: **deferred pending billing/usage verification**
- **Phase 0: may begin immediately.**
- **Final ranking: must not be finalised** until the bill or usage page identifies the active constraint.
- **Required evidence before ranking:** billing model; usage-window behaviour; token/cost visibility; batch
  availability; model-routing impact.
- **Temporary planning rule in force:** `I1`/EN1 is the **only cross-constraint candidate**; `I4`/EN4 stays
  conditional with its rank deferred; **no savings are claimed**.
- **Why deferral is the correct choice here:** it avoids silently assuming pay-per-token billing; it prevents
  prioritising rate routing when batch/model-rate routing may not exist; it keeps `I1` valid under either
  constraint; it separates fact collection from recommendation; and it is reversible.

### C2 — Role of `Claude-Koken-buffer`: **plan container only**
- The repository holds planning, decision, experiment-design, and reporting material. **Phase-1 assets live in
  the actual measured target project** — not here. Measurement cannot begin until that target is identified.
- Reason recorded: the repo is a clean slate (one-line README, no product code, no config, no workload,
  no telemetry, no representative tasks). Treating it as the working project would invent a workload and make
  phase-1 measurements meaningless. "Reusable toolkit" is unsupported (no defined interface or consumer);
  "both" is premature.
- **Required next input before phase 1:** identify the repository/project where Claude coding work actually
  occurs, and record: owner/name; branch or commit used for replay; execution client and provider; model and
  configuration; representative task set; permission to add phase-1 assets there; where telemetry and reports
  should be stored.

### Consequence map

| Blocked by | Not blocked |
|---|---|
| **C1** → final ranking (step 5) and the units of the A2/A5 thresholds | Steps 1–4; the sweep; `I1` as a candidate |
| **C2/A23** → phase-1 asset placement and all measurement | Phase 0 as *design* work: protocol, task template, report structure, and the facts sweep |
## 5. Missing information inventory

| Missing item | Who can supply | Blocks | Route |
|---|---|---|---|
| **Identity of the measured target project** (owner/name, replay branch+commit, permission) | user | **All of phase 1 and every measurement** (A23) | C2 follow-up |
| Execution client + provider, model and configuration | user | Protocol validity (A3, A4, A5, A18) | C2 follow-up / F12 |
| Representative task set in that project | user | Baseline T1–T3 (A14) | C2 follow-up / F11 |
| Where telemetry and reports are stored | user | Reporting; privacy review | C2 follow-up |
| Billing model + units | user | Objective gate; whether `I4` batch/pricing applies | F1/F2 |
| Usage-window behaviour; batch availability; model-routing impact | user | C1 evidence set | F14–F16 |
| Session distribution (turns, >80-turn sessions) | user | `I3b`; A10 | F10 |
| Target project's test suite and commands | user | Quality gates A4; A15 | F11 |
| Installed client version and available commands | user | V5; A5, A18 | F12 |
| Frozen benchmark tasks and repos | user | Phase 0 baseline; A11, A12, A14 | T1–T3 |
| Copilot's position on amendments §4.1–§4.7 | Copilot | Consolidation into `final/` | handoff |
| Confirmation that the evidence boundary binds Copilot too | Copilot | Consistency of ranking language | handoff |

## 6. Trade-offs taken so far (and what they cost)

| # | Trade-off | Gained | Given up |
|---|---|---|---|
| T1 | One folder; governance docs at top level rather than duplicated per version | Single source of truth | Diverges from v2's `cost-cut/` paths — mapping required |
| T2 | `en1`/`en2` kept verbatim instead of rewritten | Audit provenance; nothing silently lost | Duplication: two orders, one canonical |
| T3 | Conditional chain instead of a ranked recommendation | Accuracy; no unfounded commitment | Momentum — mitigated by the phase-0 time-box |
| T4 | Facts sweep executed manually instead of automated telemetry | Starts sooner, no integration work | Precision; mitigated by the lite-ledger fallback |
| T5 | Accepted v2's causality rule (one candidate at a time) | Clean attribution | Slower convergence |
| T6 | `I1`-first kept as a hypothesis, not a decision | Honest; falsifiable | Risk of stalling if the objective gate is never cleared (hence V7) |

## 7. Top consequences of error

1. **Objective never chosen (C1/A2)** → the chain cannot reach step 5; the plan remains correct and inert.
2. **Sweep unowned (A17)** → same outcome, but caused by nobody executing a ten-minute task.
3. **Repo role wrong (A16/C2)** → phase 1 changes an unmeasured repo; effort is invisible and unrepeatable.

## 8. Limitations of this register

- It is administrative, not evidence; it resolves nothing by itself.
- C-class entries cannot be settled by reading, benchmarking, or waiting — they need a decision.
- If A4 (surfaces) resolves to raw API/SDK builds, several F-class answers change and this register must be
  rebuilt; it is versioned, not permanent.
