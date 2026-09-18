# Future `buffer` CLI contract

**Status:** design contract only. No `buffer` executable, package manifest, or
TypeScript implementation is present in this repository during the
research/bootstrap phase.

The future command line tool will enforce
[`MESSAGE-PROTOCOL.md`](MESSAGE-PROTOCOL.md) locally. It will not require an API
key, contact a model provider, start a service, or push to Git automatically.
Git review and synchronisation remain deliberate operator actions.

## Common behavior

- Commands operate on the Buffer repository root discovered from the working
  directory, or on an explicit `--root <path>`.
- All reads and writes remain below `<root>/.buffer` after canonical path
  resolution. A name from an envelope is never concatenated into a filesystem
  path before grammar validation.
- A mutating command stages temporary files, validates the full proposed state,
  then performs a same-filesystem rename. It never leaves a valid-looking
  partial route on an ordinary error.
- Commands do **not** run `git add`, `git commit`, `git pull`, or `git push` by
  default. They print the affected paths and a suggested commit message.
- `--json` is machine-readable output only; it does not change stored message
  format. Diagnostics go to stderr.
- Planned exit codes: `0` success; `1` operational or validation failure; `2`
  invalid command usage; `3` conflict/idempotency failure. Final code must
  document any additional code before shipping.

## Commands

### `buffer send` — create and route a message

```text
buffer send --from <sender> --to <recipient> --thread <thread-id>
            --intent <intent> (--body <text> | --body-file <path>)
            [--format markdown|json] [--subject <line>] [--reply-to <message-id>]
            [--root <path>] [--json]
```

`send` generates the timestamp and collision-resistant message ID, rejects
invalid inputs, and performs the normal **copy** route in one local operation:

- `.buffer/outboxes/<sender>/<id>.<ext>` with `status: routed`;
- `.buffer/inboxes/<recipient>/<id>.<ext>` with `status: pending`; and
- `.buffer/threads/<thread-id>/<id>.<ext>` with `status: routed`.

It reports all three paths and a suggested `git commit` command. It does not
call a provider, embed the body in a URL, make an HTTP request, or commit/push.
A caller sending to several people invokes `send` once per recipient; each
message gets its own ID and can have the same `thread_id`.

### `buffer validate` — verify protocol and repository state

```text
buffer validate [--root <path>] [--strict] [--path <message-path>] [--json]
```

Without `--path`, validation scans `.buffer` except `templates/` and bootstrap
placeholder files. `--strict` applies every rule in section 7 of the protocol,
including duplicate-copy integrity, placement, status, tracked transport, and
routed-copy completeness. The default mode may report a working-tree operation
in progress, but it still rejects malformed envelopes and unsafe paths.

The JSON result will contain a stable summary (`valid`, `checked`, `errors`,
and `warnings`) and each error will identify a path, rule, and actionable
message. It MUST NOT print message bodies in diagnostics unless an explicit
future privacy-safe flag is introduced.

### `buffer inbox` — list active recipient deliveries

```text
buffer inbox --for <recipient> [--thread <thread-id>] [--limit <n>]
             [--root <path>] [--json]
```

`inbox` reads only `.buffer/inboxes/<recipient>/` and returns messages whose
validated status is `pending`, oldest first by `timestamp` then `id`. The text
view is a concise list of ID, time, sender, intent, thread ID, subject, and
body preview; it does not execute or render embedded instructions. `--thread`
filters on the envelope's `thread_id`.

### `buffer thread` — render a chronological conversation

```text
buffer thread <thread-id> [--root <path>] [--format text|markdown|json]
```

`thread` reads `.buffer/threads/<thread-id>/`, validates the ledger entries,
and orders them by timestamp then ID. It renders each entry's sender,
recipient, intent, timestamp, optional subject, and body. The thread ledger is
the source for conversation chronology, so delivery copies are not repeated in
the output. The renderer treats body text as data, never as commands.

### `buffer route` — deliver a queued or repair a routed message

```text
buffer route <message-id> [--root <path>] [--copy|--move] [--json]
```

`route` reads the declared sender, recipient, and thread from a validated
outbox message; it does not permit a caller to redirect it by path manipulation.
`--copy` is the default and normal behavior: retain/update the routed outbox
record, create the pending inbox copy, and create the routed thread record.
Running the same route again is idempotent when immutable content matches.

`--move` is an explicit handoff mode for a **queued** outbox message. It may
relocate that delivery to the declared inbox after creating the immutable
thread record. It MUST be conspicuously reported, MUST NOT be the default, and
MUST leave Git-visible recovery history. The initial implementation may reject
`--move` until its stricter marker and validation rules are designed; it must
never silently fall back to moving files. `send` always uses copy routing.

### `buffer archive` — mark a handled recipient message

```text
buffer archive <message-id> --for <recipient> [--handled-at <rfc3339-utc>]
               [--root <path>] [--json]
```

`archive` verifies the pending inbox copy belongs to the named recipient, moves
it to `.buffer/archives/<recipient>/`, changes only `status` to `archived`, and
adds `handled_at` (current UTC time unless supplied). The sender outbox and
thread ledger copies remain untouched. It is idempotent when the matching
archive entry already exists and validates.

## Manual Git workflow around the CLI

After a successful mutation, an operator reviews and transports it through
Git, for example:

```bash
buffer validate --strict

git add .buffer
git commit -m "buffer: archive msg_20260918T173012345Z_1a2b3c4d5e6f"
git push
```

A receiving clone fetches/pulls by its normal policy, runs `buffer validate
--strict`, then uses `buffer inbox --for <actor>`. Git provides history,
review, synchronisation, and recovery; the CLI provides only local protocol
operations.

## Explicit adapter boundary

A future `buffer-adapter-*` module may consume an inbox or produce an outbox
message after a human-approved model interaction. Such an adapter is a separate
package and configuration surface. It must not be a dependency of the core
`buffer` CLI, must not change core validation to accommodate provider payloads,
and must be covered by its own credential, network, consent, and telemetry
policy. Core `buffer` tests and CI must continue to pass with no API key and no
network access.
