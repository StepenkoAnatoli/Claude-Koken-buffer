# EN4 — Rate and workload routing

## Problem
The same token volume may have different cost or capacity impact depending on model, effort setting, and batch or asynchronous execution.

## Proposed change
Define routing rules by task risk and latency:
- low-risk formatting, summarization, and narrow transformations may use a lower-cost route;
- implementation, debugging, security, and architecture work stays on the quality-approved route;
- batch or asynchronous execution is used only where delayed results are acceptable;
- effort is reduced only when benchmarked for the task class.

## Required evidence
Confirm provider-specific pricing, cache behavior, rate limits, model capabilities, data handling, and availability in the actual execution environment. Do not assume a claimed percentage reduction transfers between providers or plans.

## Safety gates
- no lower route for security-sensitive or high-impact changes without validation;
- preserve tests and review requirements;
- make routing visible and overrideable;
- log route, task class, quality result, and fallback reason;
- preserve privacy and data-residency requirements.

## Validation
Run matched tasks across candidate routes and compare total cost, latency, first-pass correctness, correction turns, tests, reviewer confidence, and failure severity.

## Recommendation
Treat EN4 as a same-day candidate after the objective is clarified and provider facts are verified. It has potentially high value and low quality risk only when routing boundaries are explicit; otherwise it can silently trade quality for price.
