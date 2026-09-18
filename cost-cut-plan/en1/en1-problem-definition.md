# en1 — Problem definition (first planning version)

## Problem

`StepenkoAnatoli/Claude-Koken-buffer` (currently a minimal `README.md`) exists to reduce the token cost
of Claude-based coding work **without degrading correctness, test success, or review quality.**

## Cost model used from the start

```
cost  ≈  Σ over turns of ( context sent that turn  ×  cache-adjusted price per token )
```

Three multipliers, in order of leverage:

1. **turns** — how many round-trips a task takes, including clarification and rework turns.
2. **context per turn** — everything re-sent on each request: resident payload + conversation tail.
3. **rate** — the price per token (cache read/write vs fresh input; model tier; effort; batch).

Output tokens are a rounding error inside this model. That is the premise the review then tests
(see `../re1/re1-arena-feedback.md` §Evidence).

## Scope of version 1

In scope:
- Four candidate approaches to cutting tokens (P1–P4, see `en1-four-approaches.md`).
- A baseline measurement step before any change.
- A staged rollout with guardrails, keeping correctness first.

Out of scope at this stage:
- Any code, configuration, or workflow change (explicit user constraint: nothing until `final` is verified).
- Building tooling (indexers, harnesses) beyond what measurement requires.
- Optimising the human's own typing time as a proxy for tokens.

## Constraints accepted

- No optimisation may suppress tests, diagnostics, error output, or security warnings.
- Full-file output must remain permitted when a patch would be less reliable (file creation, heavy refactor).
- Every change is validated by a check, not by an impression.
- Measurement must track **total task cost**, not tokens per individual response.
- The user is the final verifier of the `final` plan.

## Success definition (version 1)

Cost per **completed** task falls measurably (tokens and, where billed, dollars) while test-pass rate,
rework rate, and review quality stay flat or improve. A token reduction that raises turns or rework is
not a success — it is a transfer of cost from one column to another.
