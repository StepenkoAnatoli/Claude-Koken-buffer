# Buffer workspace

This directory is the tracked transport workspace for the Buffer v1 protocol.
It is intentionally made of regular files and directories so it works on
Windows without symlink, daemon, database, network-service, or API-key
requirements.

> **Bootstrap note:** `buffer send`, `buffer validate`, `buffer inbox`,
> `buffer thread`, `buffer route`, and `buffer archive` are documented future
> CLI commands. They are not executable on this research/bootstrap branch.

## Layout

```text
.buffer/
├── inboxes/<recipient>/       # active deliveries awaiting handling
├── outboxes/<sender>/         # sender-side records and queued deliveries
├── archives/<recipient>/      # handled delivery copies
├── threads/<thread-id>/       # chronological, append-only conversation ledger
└── templates/                 # copyable authoring templates; never routed
```

All message paths are relative to the repository root. A message filename is
its `id` plus `.md` or `.json`, for example:

```text
.buffer/outboxes/windows-runner/msg_20260918T173012345Z_1a2b3c4d5e6f.md
.buffer/inboxes/reviewer/msg_20260918T173012345Z_1a2b3c4d5e6f.md
.buffer/threads/thr_buffer-bootstrap/msg_20260918T173012345Z_1a2b3c4d5e6f.md
```

See [`docs/protocol/MESSAGE-PROTOCOL.md`](../docs/protocol/MESSAGE-PROTOCOL.md)
for the exact file rules, schema, status mapping, and lifecycle.

## Manual exchange until the CLI exists

1. Copy `templates/message.md` to
   `outboxes/<sender>/<message-id>.md` and fill in a unique ID, receiver,
   thread, timestamp, intent, and body.
2. Validate the envelope against the protocol by review. The future
   `buffer validate --strict` command will automate this exact check.
3. To route it, copy the file to `inboxes/<recipient>/` with `status: pending`
   and to `threads/<thread-id>/` with `status: routed`. Keep the sender copy
   in the outbox with `status: routed`.
4. Commit all three related files atomically, for example:

   ```bash
   git add .buffer
   git commit -m "buffer: send <message-id> to <recipient>"
   git push
   ```

5. The receiver reviews the inbox delivery. When handled, move that copy to
   `archives/<recipient>/`, change its status to `archived`, and commit the
   move. The outbox and thread entries remain as history.

The normal routing mode is **copy**: it preserves the sender's record and
creates the recipient delivery. The future CLI will also specify a constrained
move mode for handoff workflows; see the CLI contract.

## Operational guardrails

- Keep the directory tracked. If `git check-ignore` reports a message path,
  fix the ignore rule before treating the message as sent.
- Do not edit the immutable fields or body of one copy after routing. Only the
  location-specific `status` (and archival `handled_at`) may differ.
- Do not create paths by concatenating untrusted names. Sender, recipient, and
  thread IDs are deliberately restricted for cross-platform safety.
- Do not commit secrets. Rotation after a mistaken Git commit is not sufficient
  on its own; follow your organisation's history-rewrite and credential-revoke
  procedure.
