# EN1 — Prefix diet and cache discipline

## Problem
A recurring instruction or tool payload is sent on every request. Removing information the model can safely infer may reduce a flat cost paid on every turn and may reduce cache writes.

## Proposed change
Create a minimal project instruction set containing only durable, non-inferable constraints:
- repository-specific safety rules;
- required validation commands;
- output or file-format requirements that are not obvious from the task;
- escalation rules for ambiguity and destructive operations.

Delete duplicated explanations, generic coding advice, repeated examples, and information available from repository conventions. Freeze the resulting prefix so it changes only through deliberate review.

## Safety rule
Delete only information the model can infer reliably from the repository, tools, or task. Do not delete security requirements, acceptance criteria, architecture constraints, test commands, accessibility requirements, or instructions needed to avoid destructive actions.

## Validation experiment
Run the same representative task twice:
1. baseline prefix;
2. reduced prefix.

Keep model, effort, tools, repository state, task wording, and validation procedure constant. Record per-turn input tokens, cache-read/write tokens if available, total cost or rate-limit units, turns, rework, tests, and reviewer judgment.

## Go/no-go criteria
Go only if:
- per-turn recurring payload falls by approximately the removed amount;
- tests and behavioral review show no regression;
- no additional correction turn is required;
- the prefix remains understandable and maintainable.

If token accounting does not reflect the removed payload, stop and re-derive the cost model.

## Trade-offs
Benefit: recurring, low-risk reduction and easy rollback. Risk: over-compression can hide important constraints. Mitigation: retain a short rationale and review every deletion against the safety rule.
