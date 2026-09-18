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
| A15 | The target project has a usable test suite | F | my A10 | **open** | Quality gates become review-only; A4 asserted without evidence | F11 |
| A16 | This repository is where the plan is applied | C | my A7 | **open — ASKED** | Phase 1 changes a repo that is not measured → effort invisible | C2 / F13 |
| A17 | The facts sweep is owned and executed by the user | C | — (**new, was silent**) | **open** | The plan's critical path stalls with nobody owning it: complete, coherent, and inert | confirm ownership |
| A18 | Measurement commands are available in the environment | F | my A3 (part) | **open** | Phase 0 cannot produce a baseline | F12 |
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

## 4. Decision-critical and NOT discoverable → asked now

Everything else in §2 is either readable (F), benchmarkable (B), or distributional (D). Only two items
require a **value judgement that no measurement can supply**:

- **C1 — objective unit** (partly readable as A1, but the *weighting* when both apply is a choice).
- **C2 — what `Claude-Koken-buffer` is** (toolkit / working project / both / plan container).

If either is left unanswered, the honest position is: **not guessed; the dependent step stays blocked.**
Precisely what that blocks:

| Blocked by | Not blocked |
|---|---|
| C2 → placement of phase-1 assets (`CLAUDE.md`, `.claude/settings.json`, replay tasks) | Phase 0 instrumentation and the facts sweep |
| C1 → the ranking step (step 5) and the A2/A5 thresholds' unit | Steps 1–4 of the conditional chain |

## 5. Missing information inventory

| Missing item | Who can supply | Blocks | Route |
|---|---|---|---|
| Billing mode and units | user | Objective gate; whether `I4` batch/pricing applies | F1/F2 |
| Session distribution (turns, >80-turn sessions) | user | `I3b`; A10 | F10 |
| Target project's test suite and commands | user | Quality gates A4; A15 | F11 |
| Installed client version and available commands | user | V5; A5, A18 | F12 |
| Frozen benchmark tasks and repos | user | Phase 0 baseline; A11, A12, A14 | T1–T3 |
| Decision on the repo's role | user | Phase-1 asset placement | C2 |
| Copilot's position on amendments §4.1–§4.7 | Copilot | Consolidation into `final/` | handoff |
| Confirmation that the evidence boundary is binding for Copilot too | Copilot | Consistency of ranking language | handoff |

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
