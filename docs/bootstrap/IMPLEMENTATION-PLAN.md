# Buffer implementation plan

**Status:** proposed next phases. This document does not authorise code changes
on the current research/bootstrap branch.

## Decision already made

The core is a **git-backed message bus**, not an API relay. Markdown/JSON
messages are the public interchange format. The core CLI enforces the local
protocol and works without a model connection. Git commits/remotes supply
history, review, synchronisation, and recovery. Any live model bridge is a
separate future adapter.

## Bootstrap deliverables complete in this branch

- [x] Pinned and recorded the WindowsRunner research baseline.
- [x] Read the applicable source `AGENTS.md` guidance.
- [x] Defined a versioned Markdown/JSON envelope with sender, recipient,
  thread ID, timestamp, intent, status, and body.
- [x] Created tracked inbox, outbox, archive, thread, and template directories.
- [x] Defined the six future CLI command contracts.
- [x] Recorded Windows-safe naming, Git transport, no-key, and untrusted-body
  constraints.

## Phase 1 — protocol fixtures and parser (future)

Create the smallest standalone CLI package only after approval. Start with a
normalizer/parser for Markdown front matter and JSON plus fixture messages for:

- valid queued, routed, pending, and archived copies;
- malformed fields, IDs, timestamps, paths, and status/location pairings;
- duplicate copies that differ only in status versus copies that diverge in an
  immutable field;
- unsafe Windows device names, path traversal attempts, case-only collisions,
  ignored messages, and invalid UTF-8; and
- chronological threads with same-millisecond timestamp ties.

**Gate:** parser output is deterministic, contains actionable path/rule errors,
and requires neither network access nor credentials.

## Phase 2 — local CLI lifecycle (future)

Implement `validate` first, then `send`, `inbox`, `thread`, `route`, and
`archive` against the exact contract in
[`../protocol/CLI-CONTRACT.md`](../protocol/CLI-CONTRACT.md). Use atomic local
writes, path containment, idempotent retry behavior, and an explicit dry-run
mode where useful. Do not make Git commits or network calls implicitly.

**Gate:** every mutating command either produces a complete valid local state or
leaves the prior state untouched; `validate --strict` passes after each standard
lifecycle operation.

## Phase 3 — tests and CI (future)

Add TypeScript tests and a CI workflow that runs on current supported Node
versions and `windows-latest` as well as Linux. Tests must be fixtures/unit or
local temporary-repository tests only. They must not require:

- Anthropic, OpenAI, or other provider API keys;
- a network connection, SaaS account, or live model;
- an installed Git remote; or
- a developer's real mailbox data.

Test the published command entry point as well as library helpers. Treat
Windows path behavior as a release gate, not a best-effort compatibility claim.
The cited 22 WindowsRunner TypeScript test modules are a useful quality
reference, not a target count or a test suite to copy.

**Gate:** install, typecheck, test, and packaged-CLI smoke checks pass in a
no-key environment; CI validates the same command sequence users run.

## Phase 4 — Git collaboration hardening (future)

Document and test merge/rebase behavior, duplicate-ID handling, atomic commit
recommendations, `.gitignore` detection, and recovery from partial working-tree
operations. Consider an opt-in commit-message helper only after its safety
trade-offs are reviewed. The core still must not choose a remote or push.

**Gate:** two cloned repositories can exchange a send/receive/archive sequence,
resolve a deliberate conflict, and recover with `validate --strict` without
provider access.

## Phase 5 — optional adapters, separately (future)

If desired, build adapters in separate modules/packages such as
`buffer-adapter-windows-runner` or `buffer-adapter-manual`. An adapter may read
an inbox and propose/write a protocol message only under its own explicit
configuration and approval model. It must isolate credentials, network access,
logging, and telemetry from the core CLI.

**Gate:** removing all adapter packages leaves the core `buffer` command,
protocol validation, manual Git exchange, tests, and CI fully functional and
keyless.

## Open design questions to resolve before Phase 1

1. Should v1 ship `--move` routing, or reject it until a durable handoff marker
   is specified? The safe default remains copy routing.
2. Is YAML front-matter support sufficient for all intended human operators, or
   should core initially accept JSON only and add Markdown once a safe parser is
   selected? The protocol permits both; implementation choice needs a security
   review.
3. Which Node versions, package name, licence, and distribution channels apply
   to this independent repository?
4. Which Git workflow is expected for concurrent writers: shared branch,
   feature branches with review, or per-agent branches? The protocol works with
   each, but operational guidance and fixtures should cover the chosen model.

No answer to these questions requires a model API or changes the core decision
that Git, rather than an API relay, is the transport.
