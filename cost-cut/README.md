# Cost reduction plan

## Purpose
Reduce the cost and capacity pressure of Claude coding work without reducing correctness, trust, usability, or maintainability.

## Repository status
This is a greenfield repository with a one-line README and no existing implementation, telemetry, workflow, or benchmark. All numerical claims in the source proposal are therefore hypotheses until reproduced in this repository's chosen environment.

## Folder map
- `EN1-prefix-diet.md` — recurring request-prefix reduction and cache discipline.
- `EN2-retrieval-discipline.md` — targeted context retrieval.
- `EN3-session-shaping.md` — control turn count and session growth.
- `EN4-rate-routing.md` — model, effort, and batch routing.
- `RE1-review.md` — evidence, risks, and decision review.
- `FINAL.md` — validated recommendation and rollout plan.

## Recommendation in one line
Validate EN1 first, add low-risk EN4 routing only where the objective and provider support it, use EN3 only with practical guardrails, and defer EN2 until retrieval savings are proven to exceed rework cost.

## Decision standard
A change is successful only when it reduces the selected objective (API dollars, rate-limit usage, or both) while preserving task correctness, security-relevant warnings, test outcomes, reviewability, and acceptable user effort.

## Mark convention
`EN1`–`EN4` are proposal tracks, `RE1` is review, and `FINAL` is the decision record. No implementation is authorized by these planning documents alone.
