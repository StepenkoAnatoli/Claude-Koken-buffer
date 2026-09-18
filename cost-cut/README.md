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
