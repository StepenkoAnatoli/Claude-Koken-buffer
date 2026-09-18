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
