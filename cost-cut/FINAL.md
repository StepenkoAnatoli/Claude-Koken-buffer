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
