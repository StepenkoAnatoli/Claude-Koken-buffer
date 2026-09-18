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
