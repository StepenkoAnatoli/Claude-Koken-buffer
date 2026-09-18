# en2 — Copilot's "Cost-cut plan v2" (as received)

Provenance: authored by Copilot, pasted by the user on 2026-09-18. Recorded here as the **second planning
version** (`en2`), so the discussion has an auditable trail. Reproduced verbatim except that the outer code
fences are removed and each document is a section. No edits.

---

## cost-cut/README.md

```
# Cost-cut plan v2

This folder contains a decision-ready, implementation-free plan for reducing Claude coding costs without sacrificing correctness, trust, security, usability, or maintainability.

## Decision status
The previous ranking is replaced by a conditional recommendation. EN1 remains the first experiment, not a final decision, until the objective, billing environment, cache behavior, and benchmark results are verified.

## Files
- `README.md` — scope, status, and navigation.
- `EN1-prefix-diet.md` through `EN4-rate-routing.md` — candidate interventions.
- `RE1-review.md` — decision-quality review.
- `ASSUMPTIONS.md` — assumptions and validation status.
- `BENCHMARK.md` — task matrix, protocol, and quality rubric.
- `TELEMETRY.md` — measurements, privacy, and reporting.
- `ROLLOUT.md` — ownership, staged adoption, and rollback.
- `DECISION-LOG.md` — dated decisions and evidence.
- `FINAL.md` — gated recommendation and next actions.

## Operating principle
Optimize completed, correct user work—not prompt tokens in isolation. A change fails if it saves tokens but increases rework, defects, unsafe omissions, latency, or unacceptable user effort.

## Current state
Planning only. No implementation, routing logic, retrieval tooling, session enforcement, or provider configuration has been added.
```

## cost-cut/ASSUMPTIONS.md

```
# ASSUMPTIONS — cost-cut v2

| ID | Assumption | Confidence | Validation | Failure consequence |
|---|---|---:|---|---|
| A1 | The recurring prefix is billed or consumes meaningful capacity on each request | Low | provider billing and token telemetry | EN1 may have no value |
| A2 | The provider caches the relevant prefix as expected | Low | cache hit/write telemetry and documentation | EN1 savings estimate is wrong |
| A3 | Some prefix content is redundant and safely inferable | Medium | independent review and replay | quality or safety regression |
| A4 | Output tokens are a smaller cost term in the target environment | Low | cost breakdown | wrong lever is prioritized |
| A5 | Long sessions materially increase completed-task cost | Low | session distribution and task linkage | EN3 adds friction without value |
| A6 | Lower-cost model/effort routes can handle eligible tasks | Low | matched-task benchmark | EN4 creates rework or defects |
| A7 | Targeted retrieval remains sufficient for selected task classes | Low | omission and rework analysis | EN2 causes wrong edits |
| A8 | Users will follow the workflow if it is visible, reversible, and low-friction | Medium | adoption, override, and satisfaction metrics | users bypass the plan |

## Required decisions
Before rollout, record the primary objective, provider/model, client, cache mode, task classes, quality thresholds, privacy constraints, and accountable owner.

## Confidence rule
A hypothesis is not evidence. Numerical claims from other environments must remain labelled as estimates until reproduced under the selected environment.
```

## cost-cut/BENCHMARK.md

```
# BENCHMARK — cost-cut v2

## Purpose
Measure task-level value, not isolated prompt compression.

## Task matrix
Use at least one frozen, representative task from each applicable class:

1. narrow bug fix;
2. cross-file feature;
3. failing-test diagnosis;
4. refactor;
5. security or permission-sensitive change;
6. documentation or summarization.

Exclude confidential data unless the approved environment permits it. Record repository state, task text, expected behavior, and validation commands.

## Matched protocol
For every candidate:

1. freeze model, provider, effort, tools, repository commit, and task wording;
2. run the baseline and candidate under the same conditions;
3. repeat enough times to expose material variance, with a minimum of three paired runs per task class;
4. record all successful, failed, abandoned, and retried runs;
5. blind or independently review the final diff where practical;
6. report median and range, not only the best run.

Do not compare candidates using different objectives or different quality bars.

## Measurements
Record input, output, cached input, cache writes, total tokens, cost or rate-limit units, turns, correction turns, latency, tests, defects, security/accessibility checks, reviewer result, and user effort.

## Quality rubric
A run passes only if:

- required tests pass;
- behavior matches acceptance criteria;
- no high-severity security or privacy issue is introduced;
- no required warning or diagnostic is silently lost;
- the diff is reviewable;
- correction turns remain within the approved threshold;
- user effort and latency remain acceptable.

## Decision rule
Adopt only when task-level objective improves and no quality gate fails. If results are mixed, keep the candidate limited to the task classes where it passes. If telemetry is unavailable or inconsistent, report the result as inconclusive rather than claiming savings.
```

## cost-cut/TELEMETRY.md

```
# TELEMETRY — cost-cut v2

## Minimum event fields
- experiment and candidate ID;
- task class and anonymized task ID;
- repository revision;
- model, provider, effort, cache mode, and route;
- input, output, cached-input, cache-write, and total tokens when available;
- cost and/or rate-limit units;
- turn count, correction turns, retries, abandonment, and latency;
- test and review outcomes;
- override and fallback reason.

## Definitions
A completed task is one that reaches its acceptance criteria and passes the defined validation. Completed-task cost includes retries and correction turns. Token savings without completed-task savings are not success.

## Privacy and security
Do not store raw source, secrets, credentials, or full prompts by default. Prefer identifiers, aggregates, redacted metadata, and short retention. Document access, retention, deletion, and data-residency rules before collection. Treat telemetry configuration as production-sensitive.

## Reporting
Report baseline and candidate medians, ranges, sample counts, failures, quality outcomes, and limitations. Separate API dollars from subscription/rate-limit headroom; they are different objectives.

## Stop conditions
Stop collection or disable an experiment if it leaks sensitive data, produces unreliable accounting, changes user-visible behavior without review, or cannot distinguish retries from successful work.
```

## cost-cut/ROLLOUT.md

```
# ROLLOUT — cost-cut v2

## Ownership
Assign before implementation:

- experiment owner;
- correctness and code-review owner;
- security/privacy reviewer;
- billing or platform-data owner;
- rollout approver;
- configuration maintainer.

One person may hold multiple roles only when the risk is low and the decision is documented.

## Stages
1. instrument and validate telemetry without changing behavior;
2. run offline or isolated matched benchmarks;
3. enable one reversible candidate for a small internal cohort or task class;
4. monitor for the agreed observation period;
5. expand only when quality gates and objective thresholds pass;
6. document the result and update the decision log.

Do not mix candidates during causal evaluation.

## Rollback triggers
Rollback immediately for high-severity correctness, security, privacy, or data-loss issues. Roll back for a statistically or operationally meaningful increase in correction turns, defects, abandonment, latency, or user complaints. Also roll back when accounting is unreliable.

## Recovery
Every change must have an explicit off switch, prior configuration, owner, and verification step. Users need a visible override or fallback for legitimate exceptional tasks.

## User experience requirements
Explain route or context decisions briefly, avoid blocking legitimate work, preserve diagnostics, and never force a lower-quality route. Session handoffs must be compact, editable, and recoverable.
```

## cost-cut/DECISION-LOG.md

```
# DECISION-LOG — cost-cut v2

## 2026-09-18 — Plan expanded
The original four-track plan was expanded because it lacked an explicit objective, environment facts, benchmark design, telemetry/privacy rules, ownership, and rollback mechanics.

## Current provisional decision
EN1 is the first experiment because it is potentially recurring, reversible, and small in scope. This is not a final ranking. EN4 takes the next slot only if the provider supports a meaningful lower-cost or batch route for eligible work. EN3 depends on measured session-tail waste. EN2 remains last until task-level savings exceed rework cost.

## Evidence required to change the ranking
Update this log when any of these are verified:

- billing and cache behavior;
- objective function;
- benchmark results;
- session distribution;
- route quality results;
- user adoption and override behavior.

Record the evidence, decision, owner, and date. Do not silently replace a hypothesis with a conclusion.
```

## cost-cut/FINAL.md

```
# FINAL — cost-cut v2 decision plan

## Decision status
No optimization has been approved for production. The recommendation is gated by evidence.

## Objective gate
Choose one primary objective before benchmarking:

- API dollars per successfully completed task;
- subscription or rate-limit headroom per successfully completed task;
- or an explicitly weighted combination.

Report the other dimensions as constraints or secondary KPIs. If the objective is not chosen, only instrumentation and benchmark preparation may proceed.

## Environment gate
Document the actual client, provider, model/version, effort setting, tools/MCP, cache behavior, pricing, rate limits, batch availability, privacy constraints, and available token telemetry. Claims from another environment are not transferable without verification.

## Recommendation
1. **Instrument first.** Add no behavior change until measurements can distinguish successful work, retries, correction turns, cache usage, and failures.
2. **Run the matched benchmark.** Use the task matrix and quality rubric in `BENCHMARK.md`.
3. **Test EN1 first.** Remove only reviewed redundancy from the recurring prefix. Preserve security, acceptance, architecture, test, accessibility, and destructive-operation constraints.
4. **Add EN4 only when supported by provider facts.** Route only eligible low-risk work; retain visible fallback and override.
5. **Test EN3 only if session data shows material completed-task waste.** Begin with non-blocking checkpoints and recoverable handoffs, never arbitrary hard limits.
6. **Test EN2 last and narrowly.** Use targeted context only where the benchmark shows lower completed-task cost and no missed dependency.

## Go/no-go gates
Go only when all apply:

- the primary objective improves;
- accounting reflects the claimed mechanism;
- tests and behavioral review pass;
- no high-severity security, privacy, or accessibility issue appears;
- correction turns and defects do not exceed approved thresholds;
- latency and user effort remain acceptable;
- ownership, rollback, and maintenance are explicit.

A token reduction alone is not a go decision.

## Falsification tests
- If EN1 per-turn usage does not fall by approximately the removed recurring payload, reject or revise the cost model.
- If a candidate saves prompt tokens but adds a correction turn, compare completed-task cost; reject it when total cost worsens.
- If a lower-cost route changes quality or privacy outcomes, restrict or remove that route.
- If session shaping reduces turns by increasing abandonment or unsafe shortcuts, reject it.
- If targeted retrieval misses dependencies, widen context or reject the task class.

## Immediate next actions
1. Assign the owner and reviewers in `ROLLOUT.md`.
2. Choose and document the primary objective.
3. Fill the environment and privacy fields in `ASSUMPTIONS.md` and `TELEMETRY.md`.
4. Select frozen benchmark tasks and acceptance criteria.
5. Run baseline measurements before changing behavior.
6. Decide EN1 only from the baseline and matched replay.

## Long-term success definition
The project succeeds when users complete correct work with less verified cost or capacity pressure, without extra cognitive burden, hidden quality loss, unsafe omissions, or unmaintainable infrastructure.

## Limitations
This repository has no implementation, production telemetry, billing integration, or representative task history. The plan cannot claim actual savings until those facts are supplied and measured.
```

---

## Clerk's note on the record

- `en2` is materially stronger than `en1` on governance: telemetry/privacy, ownership, rollback, matched
  protocol, quality rubric, go/no-go gates.
- Its lever ordering (**EN1 → EN4 → EN3 → EN2**, all conditional) **converges** with the `re1` proposal.
- It keeps the intervention IDs `EN1–EN4`, which visually collide with the user's version marks
  (`en1`/`re1`/`final`). Reconciliation proposed in `../re1/re1-review-of-copilot-v2.md` §7.
- It describes the folder `cost-cut/`; the user's actual folder is `cost-cut-plan/`. Kept as specified by
  the user (one folder).
