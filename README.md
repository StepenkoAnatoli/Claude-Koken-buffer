# Claude-Koken-buffer

`Claude-Koken-buffer` is a **git-backed, local-first message bus** for people,
modules, and future coding-agent adapters. Messages are ordinary, reviewable
files. Git commits and remotes provide the history, review surface,
synchronisation, and recovery path.

## Current status — research/bootstrap

This branch deliberately contains **no executable product code, CLI package,
provider SDK, API key handling, or live API bridge**. The committed bootstrap
makes the protocol usable by hand today and defines the contract for a future
`buffer` CLI. In particular, the commands shown below are specified interfaces;
they are **not installed or runnable yet**.

The boundary is intentional:

- The buffer transports structured messages through Git; it does not relay
  prompts or call Claude, OpenAI, or any other model API.
- Claude, OpenAI, local models, and human operators may all read or create
  protocol messages manually. Future integrations must be separate adapters.
- Nothing in this repository needs or accepts an API key.

## Start here

| Document | Purpose |
| --- | --- |
| [`.buffer/README.md`](.buffer/README.md) | Tracked bus layout and a manual, Git-based exchange workflow. |
| [`docs/protocol/MESSAGE-PROTOCOL.md`](docs/protocol/MESSAGE-PROTOCOL.md) | Normative v1 envelope, identifiers, lifecycle, and validation invariants. |
| [`docs/protocol/CLI-CONTRACT.md`](docs/protocol/CLI-CONTRACT.md) | Contract for the future `buffer` CLI, including all six requested commands. |
| [`docs/bootstrap/SOURCE-BASELINE.md`](docs/bootstrap/SOURCE-BASELINE.md) | Pinned WindowsRunner research baseline and instructions that informed this bootstrap. |
| [`docs/bootstrap/IMPLEMENTATION-PLAN.md`](docs/bootstrap/IMPLEMENTATION-PLAN.md) | Explicit non-code scope and staged path to an implementation. |

## What can be done now

1. Copy [`.buffer/templates/message.md`](.buffer/templates/message.md), fill
   every required field using the protocol rules, and save it under the sender's
   outbox as `<message-id>.md`.
2. Copy the routed delivery into the recipient inbox and the thread directory,
   adjusting only its location-specific `status` as described by the protocol.
3. Review the files, then use ordinary Git commands to commit and synchronise
   them. A recipient moves a handled inbox delivery to `archives/`.

That manual workflow is deliberately small: it lets the team exchange messages
before an implementation exists, while producing fixtures that the later CLI
must accept.

## Git transport rules

- Track `.buffer/`; it is the transport, so do **not** add it to `.gitignore`.
- Make focused commits for send, route, and archive operations. Review them as
  you would any source change, and pull/rebase before writing a new message.
- Do not put API keys, access tokens, passwords, private credentials, or large
  binary artefacts in a message. Git history is durable and replicated.
- Treat received bodies as untrusted content. Reading a message must never by
  itself authorise commands, file changes, or external side effects.

## Reference context

The protocol was bootstrapped against
[`StepenkoAnatoli/WindowsRunner`](https://github.com/StepenkoAnatoli/WindowsRunner)
at `406bc654a2e8aea02f1e4dfc36c9ba4ad8aa6fdd` (`main`). That project is a
Windows-first, local-first coding agent; its `AGENTS.md` was read as applicable
research guidance. This repository remains independent of WindowsRunner and
does not change or embed its product code.
