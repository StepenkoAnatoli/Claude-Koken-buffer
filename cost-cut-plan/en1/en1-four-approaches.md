# en1 — The four approaches (first planning version, as received)

Recorded faithfully from the version-1 proposal. Evaluation criteria are those stated in version 1;
the review in `../re1/` scores them and reorders the rollout.

---

## P1 — Patch-only output

- **Mechanism:** require Claude to return unified diffs or minimal edits instead of rewriting whole files.
- **Expected benefit:** substantial reduction in output tokens.
- **Stated risk:** patches can be incomplete or hard to apply when context is inaccurate.
- **Stated evaluation:** patch correctness, apply success rate, review time, token savings.

## P2 — Symbol- and dependency-focused context

- **Mechanism:** symbol indexing, Tree-sitter/ctags/LSP lookups; retrieve definitions, references, imports
  and relevant test files instead of whole files.
- **Expected benefit:** lower input tokens *and* better code navigation.
- **Stated risk:** index maintenance; incomplete context for cross-cutting changes.
- **Stated evaluation:** task success rate, context size, missed-dependency rate, lookup latency.

## P3 — Test- and acceptance-criteria-driven requests

- **Mechanism:** express requirements as failing tests, fixtures, examples, and explicit acceptance criteria;
  use prose only where tests cannot describe the behaviour.
- **Expected benefit:** fewer clarification turns, more deterministic results.
- **Stated risk:** writing good tests costs developer effort.
- **Stated evaluation:** follow-up turns, test-passing rate, regression rate, total token use.

## P4 — Concise interaction policy

- **Mechanism:** project-level instructions banning filler, repeated summaries, unnecessary explanation,
  and redundant restatement; require direct answers and concise progress reports.
- **Expected benefit:** immediate reduction in unnecessary output.
- **Stated risk:** excessive brevity could hide assumptions or important warnings.
- **Stated evaluation:** output-token reduction, issue-detection rate, readability, developer satisfaction.

---

## Known gap at this stage (one line, recorded at the time)

P1–P4 target **output length** and **per-lookup context**. The **resident per-request payload**
(system prompt machinery, tool/MCP definitions, memory files) and **cache economics** are not yet covered,
although both are re-billed on every turn. Flagged here so the gap is visible in the record, not just in
the review.

## Appendix — companion record (parallel first draft)

A separate first draft by the review side framed the same problem as four levers. It is recorded here for
completeness; the consolidated, deduplicated list is `L1–L7` in `../re1/re1-comparison-and-risks.md`.

| First-draft ID | Lever | Relationship to P1–P4 |
|---|---|---|
| O1 | Prefix diet + cache freeze (shrink and then stop mutating the always-resident payload) | Not covered by P1–P4 |
| O2 | Per-turn retrieval discipline (exact files, filtered tool output, subagents) | Overlaps P2, broader scope |
| O3 | Session shaping (turn count, compact vs clear, mega-session tail) | Partly covered by P3's turn reduction |
| O4 | Rate routing (model tier, effort/thinking budget, batch pricing) | Not covered by P1–P4 |
