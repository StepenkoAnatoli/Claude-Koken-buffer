# en1 — Initial recommendation (first planning version)

**Status: superseded.** Kept as the record of what version 1 proposed. The current proposal is
`../re1/re1-revised-recommendation.md`.

## Recommendation as stated in version 1

Do not adopt a single instruction. Use a controlled combination:

1. **Symbol-focused context as the foundation.**
2. **Tests and acceptance criteria as the task contract.**
3. **Patch-only output for implementation changes.**
4. **Concise interaction rules as a safety layer**, not as the primary optimisation.

Rationale as stated: it reduces both input and output tokens while preserving the information Claude needs
to make correct decisions, and it delivers measurable workflow improvements rather than merely shorter
responses.

## Rollout order as stated in version 1

1. Establish baseline measurements for representative coding tasks.
2. Add concise interaction rules.
3. Introduce test-driven task specifications.
4. Add patch-only output requirements.
5. Add symbol-aware context retrieval.
6. Compare combined workflow against baseline.
7. Keep only if correctness, test success, and review quality remain stable or improve.

## Guardrails as stated in version 1 (retained in the revised plan, verbatim in substance)

- Do not optimise token count at the expense of tests, diagnostics, or security warnings.
- Permit full-file output when a file is created, heavily refactored, or when a patch is less reliable.
- Require validation after every patch.
- Preserve enough context for architectural and cross-file changes.
- Measure total task cost, not only tokens in individual responses.

## What version 2 changes

- Two uncovered levers are added and given the **front** of the rollout: the resident payload
  (prefix diet + cache freeze) and the rate (model/effort/batch).
- The foundation is moved from symbol retrieval to the payload, because the payload is re-billed every
  turn and is configured in files, whereas symbol retrieval is a tooling project with a recurring cost.
- Patch-only is demoted from a cost measure to a reviewability practice.
- Concise interaction rules stay, explicitly labelled as hygiene with a low ceiling.
- The rollout becomes phase-gated on measured acceptance criteria, with kill criteria per lever.

See `../re1/re1-arena-feedback.md` for the reasoning and `../re1/re1-comparison-and-risks.md` for scoring.
