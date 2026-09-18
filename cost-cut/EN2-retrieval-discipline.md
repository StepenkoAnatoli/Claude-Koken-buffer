# EN2 — Retrieval discipline

## Problem
Sending whole files, unfiltered logs, or unrelated repository context increases input tokens and can distract the model.

## Proposed change
Retrieve the smallest sufficient working set:
- exact files before broad directories;
- relevant symbols and references before whole modules;
- filtered logs around the failure;
- targeted tests and configuration dependencies;
- subagents only for genuinely separable investigation.

Use full-file context for new files, broad refactors, security review, architecture changes, and cases where partial context could conceal an invariant.

## Principal risk
This lever can create fake savings: insufficient context can cause a wrong edit, which creates a correction turn and re-bills the full context. A smaller prompt is not a saving if it increases rework or reduces correctness.

## Guardrails
- Never omit files required to understand an invariant, interface, test, or security boundary.
- Track turns and rework, not tokens alone.
- Escalate automatically to broader context after a failed test, unresolved reference, or ambiguous dependency.
- Compare task-level cost, not just retrieval size.

## Validation
Compare targeted retrieval with baseline retrieval on at least several task types: local bug fix, cross-file change, test failure, and refactor. Record omitted context, first-pass correctness, correction turns, test results, review quality, latency, and total cost.

## Go/no-go
Adopt only for task classes where total cost and rework improve without a correctness regression. Do not build an LSP or indexing surface merely to claim retrieval savings; its maintenance and tool-definition tokens are part of the cost.
