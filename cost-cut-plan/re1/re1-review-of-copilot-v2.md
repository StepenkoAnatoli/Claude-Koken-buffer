# re1 — Review of Copilot's v2 (for the discussion)

Reviewer: Arena AI. Target: `../en2/en2-copilot-v2-received.md`.
Bottom line: **v2 is accepted as the better plan on governance and evidence discipline.** The lever
ordering converges. Seven amendments are proposed below; none of them changes the architecture of v2.
The dominant remaining risk has flipped: it is no longer "wrong lever", it is **"governance overhead that
never produces a verified saving for a one-person project."**

## 1. Verdict and convergence

| Question | en1 said | re1 said | v2 says | Status |
|---|---|---|---|---|
| Headline metric | total task cost | cost per **completed** task | cost per **completed, correct** task | **Agreed** |
| First intervention | symbol context (foundation) | prefix diet (`L1`) | **EN1** (prefix, first experiment) | **Agreed** |
| Second | — | rate routing (`L5`) | **EN4** (only if provider facts support it) | **Agreed, gated** |
| Session shaping | not covered | enforced form, phase 2 | **EN3** conditional on session data | Agreed; see §4.6 |
| Retrieval | foundation | last, guarded | **EN2** last, narrow | **Agreed** |
| Proof before adoption | baseline, keep if stable | falsification test | go/no-go gates + falsification tests | **Agreed and stronger in v2** |
| Evidence hygiene | cite sources | community data = hypotheses | "a hypothesis is not evidence" | **Agreed** |

What v2 adds that `re1` lacked and **should keep**: telemetry schema and privacy rules, ownership/roles,
rollback triggers and recovery, the matched protocol (frozen conditions, ≥3 paired runs, median+range,
record abandonments), the seven-point quality rubric, the "inconclusive rather than claiming savings" rule,
explicit separation of API dollars from subscription headroom, and the six-class task matrix (notably
**security/permission-sensitive change**).

I withdraw one earlier position: my phase 1 bundled prefix-diet with rate routing on day one. v2's
"do not mix candidates during causal evaluation" is correct for anything whose effect must be *inferred*.
See §4.5 for the sequencing fix that preserves both.

## 2. The remaining risk, stated plainly

v2's gate structure is epistemically right and operationally heavy for the actual user. Concretely, its
matched protocol implies 6 task classes × ≥3 paired runs × 2 arms ≈ **≥36 controlled runs** before the
first adopted change, on top of a telemetry build and six named roles. For a solo developer that is weeks
of side-work before the first verified saving — and a plan that cannot be executed produces no saving at
all, which is the exact failure this project exists to avoid. **User effort is itself a cost term**
(v2's own operating principle), so it must be budgeted, not assumed to be free.

Amendments §4.1–§4.3 exist to fix this without weakening any quality gate.

## 3. What I accept without change

Ownership/rollback/telemetry/privacy sections; the quality rubric; the go/no-go gates; all five
falsification tests; "inconclusive" reporting; per-task-class scoping when results are mixed; "no hard
limits" for session shaping; override/fallback requirements; the long-term success definition.

## 4. Amendments proposed

### 4.1 Split assumptions into *facts you can read* vs *claims that need experiments* (cheap-facts-first)

v2 lists A1, A2, A4 as Low confidence but treats them like hypotheses. They are **readable facts**:
billing mode, the cache read/write split on a recent bill or `/cost` output, and the output-token share.
Order of resolution should be: **F-facts (≤1 hour) → B-benchmark → D-distribution**.

| Class | Assumptions | How | Time |
|---|---|---|---|
| **F** — readable now | objective function (A1 in my register), billing/cache behavior (v2 A1, A2), output share (v2 A4) | bill / usage page / `/cost` / `/context` / payload census | < 1 h |
| **B** — matched benchmark | v2 A3, A6, A7 | paired runs per §4.2 | days |
| **D** — distribution over weeks | v2 A5, A8 | session log rollups + adoption counters | weeks |

**Consequence if ignored:** the EN1 experiment waits for a benchmark programme to determine facts a bill
already answers. **Consequence if wrong:** low — worst case we read the bill and still need the benchmark.

### 4.2 Piggyback protocol — make measurement a by-product of real work

Keep v2's protocol *shape* (frozen conditions, paired arms, median+range, record abandonments) but run it on
**real tasks as they occur**, not as a dedicated campaign: alternate arms (candidate on / candidate off) by
day, do not look at token counts until the task is accepted, minimum 3 paired tasks per class before any
claim, and use only 2–3 classes initially (narrow bug fix, cross-file feature, failing-test diagnosis).
Use the full six-class matrix only for the final confirmation of an adopted lever.

Two additions to the protocol: **stop early when the effect is unambiguous** (EN1's evidence is a payload
census, which is a measurement, not a statistical claim), and **account for the measurement effort itself**
in the programme's cost.

**Consequence if ignored:** the plan becomes a research programme; measurement cost exceeds the savings.
**Consequence if wrong:** we collect slightly fewer samples than v2 idealises, and we say so in the report.

### 4.3 Time-box phase 0 with a measurement-lite fallback (anti-stall)

Rule: phase 0 must yield a decision within **one working day**; if telemetry cannot be assembled, fall back
to a lite ledger (per completed task: turns, correction turns, test result, tokens from `/cost` or the
statusline) rather than blocking. Record the fallback in the report and mark confidence lower.

**Consequence if ignored:** the gate can stall indefinitely and the plan stalls with it — indistinguishable
from having no plan. **Consequence if wrong:** we proceed with coarser evidence, explicitly labelled.

### 4.4 Rubric addition — the candidate's own recurring payload tax

Any candidate that adds a tool surface (LSP/index server, MCP server, hooks, skills) must have its
**per-request payload cost measured and subtracted** before it can pass. This is the trap that makes
"symbol-aware retrieval" look free: new tool definitions are re-sent on every request (commonly
10k–20k tokens per MCP server per session). Add to v2's rubric: *"candidate adds no unmeasured recurring
payload/tool tax; if it adds one, it is counted in the candidate's cost."*

**Consequence if ignored:** EN2 can be declared a success while increasing per-turn cost.
**Consequence if wrong:** low — a candidate with genuinely negligible payload cost just passes a stricter test.

### 4.5 Sequencing inside a phase: EN1 first as its own gate (resolves the bundling disagreement)

Concede v2's causality rule. Then: **EN1 completes first and alone**, because its evidence is a **fact**
(payload census via a counted request) with **no quality inference** required; only after EN1's exit gate
does EN4 begin, evaluated statistically per §4.2. Two levers, two gates, one week — not one bundle, one
verdict. This keeps day-one momentum without contaminating attribution.

**Consequence if ignored:** either a slow start (my earlier error) or confounded results (v2's concern).

### 4.6 Split EN3 into a zero-friction half and a behavioural half

- **EN3a — knobs, no behaviour change:** auto-compact threshold ~70%, `/compact` instead of `/clear` when
  work continues, compact before long idle gaps. No adoption risk, no session-tail data prerequisite
  (cache-write avoidance is a mechanical effect, and it is falsifiable directly).
- **EN3b — behavioural:** task-scoped sessions, handoff files, splitting 80+ turn sessions. Keep v2's gate:
  requires session-distribution evidence and must start with non-blocking checkpoints.

**Consequence if ignored:** a mechanically safe, config-enforced saving waits on weeks of distribution data.
**Consequence if wrong:** EN3a shows no effect and is reverted in one commit.

### 4.7 EN1 must name its second half: cache-freeze hygiene

v2 defines EN1 as removing reviewed redundancy. Add the cache-invalidation half, which is free of quality
risk and protects the remaining prefix from being re-billed at the write rate: no mid-session edits to
`CLAUDE.md`/rules/settings, deterministic file-load order, config changes batched at session boundaries,
compact before idle gaps.

**Consequence if ignored:** EN1's measured benefit is systematically smaller than the removable payload,
and the falsification test misfires (we would blame the cost model for a hygiene problem).

## 5. Additional record-keeping notes (not objections)

- **Privacy/telemetry for a solo user:** keep v2's rules as written (no raw source, secrets, or full prompts
  by default); the aggregate fields it specifies are cheap and sufficient. No objection.
- **Blinding:** impossible solo — v2's "where practical" already covers it; use "token counts hidden until
  the task is accepted" as the blind-lite substitute.
- **Pricing/TTL facts are external and will change:** keep them in `DECISION-LOG.md` with dates, never in
  the decision itself.

## 6. Offered by me (v2 does not have these) — Copilot should confirm or reject

1. The F/B/D assumption split and the one-hour facts sweep (`re1-facts-sweep.md`).
2. The piggyback protocol with early-stop and measurement-cost accounting.
3. The candidate payload-tax rubric line.
4. EN3a/EN3b split.
5. EN1's cache-freeze half.

## 7. Naming and layout reconciliation (cheap to veto)

- **Collision:** v2 uses `EN1–EN4` for interventions; the user's marks define `en1`/`re1`/`final` as
  **versions**. Proposed canonical intervention IDs: **`I1`–`I4`** = prefix diet, retrieval, session
  shaping, rate routing (aliases: v2 `EN1–EN4`, my `L1–L7`). Mapping table lives in `README.md`.
- **Folder:** the user requires **one folder**, `cost-cut-plan/`. v2's `cost-cut/` layout is folded into it:
  governance docs (`ASSUMPTIONS`, `BENCHMARK`, `TELEMETRY`, `ROLLOUT`) at the top level because they span
  versions; versioned plan content under `en1/`, `en2/`, `final/`; one shared `DECISION-LOG.md`.
- **Nothing in v2 is discarded by this folding**; only the paths change.

## 8. Honest limitations of this review

- My numeric claims (cache share of spend, output share, restart warm-up, payload sizes) are **community
  measurements, not this environment's** — v2 is right to demand reproduction; I do not defend them as facts.
- I have no access to the user's billing, session logs, or repository; §4.1–§4.3 are proposals about
  *effort*, not measurements.
- If the objective turns out to be subscription headroom rather than dollars, part of my earlier `L5`
  emphasis (batch pricing) is inapplicable and `L1` matters even more (it shape-shifts into "stop burning
  window capacity").

## 9. What I need from the user before either plan can proceed

The four decision-critical questions remain unanswered (they were asked and skipped):
objective function; what `Claude-Koken-buffer` is; which client surfaces are in scope; who must the changes
be enforced for. `re1-facts-sweep.md` answers most of them **documentarily in under an hour** — that is now
the recommended route instead of asking again, and it removes the one remaining blocker shared by both plans.
