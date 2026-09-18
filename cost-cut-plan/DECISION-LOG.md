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

## Open — blocks both plans
1. **Target project not identified** (A23) → blocks phase 1 and *all* measurement: G1 repo owner/name,
   G2 replay branch/commit, G3 client+provider, G4 model/config, G5 task set, G6 permission, G7 telemetry
   and report storage. Phase 0 proceeds meanwhile as design work (protocol, templates, report structure).
2. **Objective unit not chosen** (C1 deferred) → blocks the final ranking and the A2/A5 threshold units.
   Evidence set: billing model, usage-window behaviour, token/cost visibility, batch availability,
   model-routing impact (F1/F2/F14–F16).
3. Environment facts F1–F16 not yet measured → see `re1/re1-facts-sweep.md` (10–60 minutes of reading,
   none of which this agent can do on the user's behalf).

Status of the programme: **planning only. Nothing implemented, configured, or routed anywhere.**
No claim of savings is made anywhere in this repository.

## 2026-09-18 — Inter-module message bus adopted (`bus/`)
The exchange between the operator, Claude, Copilot, and Arena AI was previously tracked only by folder
naming (`en1`, `en2`, `re1`, `final`), which records *versions* but not *who asked whom for what, and what
is still owed*. Adopted `bus/` — a git-backed message bus (`koken-bus/1`, spec in `bus/PROTOCOL.md`).

Design decisions:
- **Git is the transport.** A message is a file; sending is a commit. No API keys, no live connection, so
  paste-only participants (GPT, and Copilot outside VS Code) are first-class rather than second-class.
- **One canonical file per message**; `inbox/`, `outbox/`, and `archive/` hold pointers, so copies cannot
  drift. `bus/buffer reindex` rebuilds the index from envelopes after a bad merge.
- **Closed intent and status vocabularies**, so a recipient never has to infer whether it is being asked to
  decide, to critique, or merely to read.
- **Authority rule, mechanically enforced:** only `human` may send or set `status: agreed`; a later reply
  can never downgrade an `agreed` decision. Agents propose, the operator ratifies.
- **Evidence boundary carried in the envelope:** every message declares `evidence: none|external|repository`,
  putting `re1/re1-evidence-boundary.md` in the header instead of in prose.

Thread `cost-cut` messages 001–006 are back-filled from this log and the existing documents; they carry
`reconstructed: true` and are **not** claimed to be verbatim transcripts of the original exchanges.

Status: tooling and protocol only. **No change to any cost-cut conclusion, ranking, or claim.** Decisions
C1 (ranking frozen) and C2 (plan container) stand.

## 2026-09-18 — Target project identified (G1, G2 answered; C2 prerequisite partially cleared)
Recorded on the bus as `cost-cut.007.human`.

| # | Item | Answer |
|---|---|---|
| G1 | Target repository | `StepenkoAnatoli/WindowsRunner` |
| G2 | Replay branch + commit | `main` @ `406bc654a2e8aea02f1e4dfc36c9ba4ad8aa6fdd` |
| G4 | Project type | Windows-first, local-first coding agent |
| G5 | Phase | Research/bootstrap only — no product code changes |
| G6 | Checks available | 22 TypeScript tests; CI/test workflow requires no API key |
| G7 | Instructions in force | `AGENTS.md` present and applies |

Consequences: **F11 is answered in advance** — quality gates for T1–T3 can be test-based rather than
review-based, removing the weakest link in the benchmark design. The replay tree is frozen, so T1–T3 can be
defined against a fixed commit. `AGENTS.md` is the resident-prefix artifact that `I1`/EN1 would act on there.

Still blocked: **G3** (execution client and provider account) and the telemetry storage location; **F1/F2**
(billing mode and objective unit) remain unread, so **decision C1 stands unchanged** — the ranking is still
frozen, `I1`-first is still a working hypothesis, and no savings are claimed. Per G5 (research/bootstrap
only), the next action in the target project is **measurement, not change**.
