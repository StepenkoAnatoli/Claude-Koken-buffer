# RE1 — Review and decision analysis

## Review of the four tracks

| Track | Relevance | Evidence needed | Error consequence | Reversibility | Main hidden assumption |
|---|---|---|---|---|---|
| EN1 | High: recurring payload | replay token and quality telemetry | omitted constraint or unchanged billing | High | removed text is inferable and billed as assumed |
| EN2 | High in large contexts | task-level savings and rework | wrong edit or missed dependency | Medium | smaller context remains sufficient |
| EN3 | High if long sessions dominate | session distribution and outcome data | interrupted work and user friction | High | a guardrail changes behavior without harm |
| EN4 | High if rate differences are real | provider pricing and matched benchmark | quality, privacy, or latency regression | High if routed per task | routes have equivalent capability for the task |

## Teardown of the example
- Diff-only output can reduce output volume, but output may be a smaller cost term than input and patches can fail for broad changes.
- LSP or indexing can reduce retrieval volume, but tool definitions and maintenance become recurring cost and partial context can cause rework.
- Test-driven requests are valuable primarily because they reduce ambiguity and correction turns, not because code is always cheaper than prose.
- No-fluff instructions are low effort, but savings are modest and excessive brevity can hide assumptions or warnings.

## Decision correctness versus technical correctness
A technically correct optimization can still be a bad decision if it targets the wrong billing objective, shifts cost into rework, increases user effort, or reduces trust. The plan therefore uses task-level outcomes and reversible experiments.

## Open questions
1. Is the primary objective API dollars, subscription/rate-limit headroom, or a weighted score?
2. Which provider, model, effort, cache mode, and billing rules are in scope?
3. What representative task set reflects real user work?
4. What correctness bar is required beyond tests: review, security checks, accessibility, and behavior?
5. What amount of extra latency or user effort is acceptable?

## Provisional ranking
EN1 first; EN4 as a same-day add-on only after provider facts; EN3 after measuring session tail and designing non-disruptive guardrails; EN2 last until it proves task-level rather than prompt-level savings.
