# FINAL — Validated cost-reduction plan

## Decision
Do not implement a broad token-optimization system. First validate and adopt the smallest change that produces measured savings without quality or usability regression:

1. **EN1 first:** reduce and freeze only redundant recurring instructions and payload.
2. **EN4 second:** route eligible low-risk work to lower-cost or batch execution after provider facts and quality gates are verified.
3. **EN3 third:** add soft, recoverable session-shaping guardrails only if session data shows a material tail.
4. **EN2 last:** add retrieval tooling or stricter context filtering only if it reduces total task cost after rework.

The order is provisional until the experiments below are run. Evidence can reverse it.

## Objective function
Before implementation, record the primary objective:
- API dollars;
- subscription or rate-limit headroom;
- or a weighted combination.

Report the other dimension as a constraint or secondary KPI. Do not compare options using incompatible objectives.

## Baseline experiment
Select a representative, repeatable task with a known expected result. Capture:
- model, effort, provider, cache mode, and tool configuration;
- input, output, cache, and total tokens where available;
- cost or rate-limit usage;
- turns, latency, and rework;
- tests, behavioral checks, security/accessibility checks where relevant;
- final diff quality and user effort.

Run the baseline more than once if variance is material. Freeze repository state and task wording.

## Stage 1 — EN1 replay
Replay the same task with only the prefix diet changed. Go only when recurring tokens decrease as predicted and correctness, tests, rework, and review quality do not regress. If accounting disagrees with the model, stop and update this decision record.

## Stage 2 — EN4 matched routes
Verify current provider facts, then benchmark candidate routes on task classes. Route only eligible work, make the route visible, retain an override and fallback, and reject a route with meaningful quality, privacy, or latency regression.

## Stage 3 — EN3 session guardrails
Use observed session data to choose a threshold or checkpoint. Start with a non-blocking reminder and compact handoff format. Remove it if it interrupts legitimate work or increases abandonment and rework.

## Stage 4 — EN2 retrieval pilot
Pilot targeted retrieval on narrow task classes. Escalate context after uncertainty or failed validation. Do not deploy an indexer or LSP solely on projected savings.

## KPIs and guardrails
Primary KPI: selected objective per successfully completed task.

Secondary KPIs:
- total tokens per completed task;
- turns and correction turns;
- first-pass test success;
- escaped defects and security findings;
- latency;
- user effort and override rate;
- maintenance and failure overhead.

A stage fails if it saves prompt tokens but increases completed-task cost, defects, unsafe omissions, or unacceptable user friction.

## Falsification test
If EN1 per-turn tokens do not fall by approximately the removed recurring payload on a controlled replay, the cost model is wrong and the ranking must be re-derived. If any candidate reduces tokens but causes an extra correction turn or quality regression, it is not a successful optimization.

## Rollback
Keep each change independently toggleable. Restore the prior prefix, route, session behavior, or retrieval mode immediately when guardrails fail. Preserve the experiment record so a rollback is not mistaken for a failure of measurement.

## Completion criteria
The plan is complete only when:
- the objective and environment are documented;
- baseline and matched experiments are reproducible;
- measured savings are reported with limitations;
- correctness and user-impact checks pass;
- the chosen change has an owner, rollback, and maintenance expectation.

## Current status
Planning only. No code, provider configuration, routing logic, retrieval tooling, or session enforcement is authorized until the baseline experiment and objective are confirmed.

## Open questions for final verification
- What is the actual execution and billing environment?
- Which task should be the benchmark?
- Which objective has priority?
- Who reviews correctness and user impact?
- What regression threshold is acceptable?
