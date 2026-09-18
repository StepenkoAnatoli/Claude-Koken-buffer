# BENCHMARK — cost-cut v2

## Purpose
Measure task-level value, not isolated prompt compression.

## Task matrix
Use at least one frozen, representative task from each applicable class:

1. narrow bug fix;
2. cross-file feature;
3. failing-test diagnosis;
4. refactor;
5. security or permission-sensitive change;
6. documentation or summarization.

Exclude confidential data unless the approved environment permits it. Record repository state, task text, expected behavior, and validation commands.

## Matched protocol
For every candidate:

1. freeze model, provider, effort, tools, repository commit, and task wording;
2. run the baseline and candidate under the same conditions;
3. repeat enough times to expose material variance, with a minimum of three paired runs per task class;
4. record all successful, failed, abandoned, and retried runs;
5. blind or independently review the final diff where practical;
6. report median and range, not only the best run.

Do not compare candidates using different objectives or different quality bars.

## Measurements
Record input, output, cached input, cache writes, total tokens, cost or rate-limit units, turns, correction turns, latency, tests, defects, security/accessibility checks, reviewer result, and user effort.

## Quality rubric
A run passes only if:

- required tests pass;
- behavior matches acceptance criteria;
- no high-severity security or privacy issue is introduced;
- no required warning or diagnostic is silently lost;
- the diff is reviewable;
- correction turns remain within the approved threshold;
- user effort and latency remain acceptable.

## Decision rule
Adopt only when task-level objective improves and no quality gate fails. If results are mixed, keep the candidate limited to the task classes where it passes. If telemetry is unavailable or inconsistent, report the result as inconclusive rather than claiming savings.
