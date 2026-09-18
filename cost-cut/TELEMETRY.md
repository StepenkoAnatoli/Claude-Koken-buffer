# TELEMETRY — cost-cut v2

## Minimum event fields
- experiment and candidate ID;
- task class and anonymized task ID;
- repository revision;
- model, provider, effort, cache mode, and route;
- input, output, cached-input, cache-write, and total tokens when available;
- cost and/or rate-limit units;
- turn count, correction turns, retries, abandonment, and latency;
- test and review outcomes;
- override and fallback reason.

## Definitions
A completed task is one that reaches its acceptance criteria and passes the defined validation. Completed-task cost includes retries and correction turns. Token savings without completed-task savings are not success.

## Privacy and security
Do not store raw source, secrets, credentials, or full prompts by default. Prefer identifiers, aggregates, redacted metadata, and short retention. Document access, retention, deletion, and data-residency rules before collection. Treat telemetry configuration as production-sensitive.

## Reporting
Report baseline and candidate medians, ranges, sample counts, failures, quality outcomes, and limitations. Separate API dollars from subscription/rate-limit headroom; they are different objectives.

## Stop conditions
Stop collection or disable an experiment if it leaks sensitive data, produces unreliable accounting, changes user-visible behavior without review, or cannot distinguish retries from successful work.
