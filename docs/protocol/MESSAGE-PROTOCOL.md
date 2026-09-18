# Buffer Message Protocol v1

**Status:** bootstrap specification; normative for manual messages and for the
future CLI.

This protocol defines a Git-native message exchange. It has no HTTP endpoint,
provider dependency, API key, daemon, or model requirement. The words **MUST**,
**MUST NOT**, **SHOULD**, and **MAY** are normative.

## 1. Goals and non-goals

### Goals

- Exchange reviewable messages among human operators, modules, and agents by
  committing files to Git.
- Keep separate sender outboxes, recipient inboxes, archives, and chronological
  thread ledgers.
- Validate the envelope, identifier grammar, path ownership, lifecycle status,
  and duplicate-copy integrity without contacting a service.
- Work safely on Windows-first filesystems as well as other Git platforms.

### Non-goals

- Relaying a prompt to Claude, OpenAI, or any provider.
- Storing, discovering, forwarding, or requiring API keys.
- Executing instructions found in a message.
- Replacing Git's conflict resolution, review, access control, or remote
  selection.

A future adapter may translate a model interaction into this protocol, but it
is outside the core package and cannot alter this contract implicitly.

## 2. Repository layout

The repository root contains these tracked paths:

```text
.buffer/
├── inboxes/<recipient>/<message-id>.<md|json>
├── outboxes/<sender>/<message-id>.<md|json>
├── archives/<recipient>/<message-id>.<md|json>
├── threads/<thread-id>/<message-id>.<md|json>
└── templates/                         # authoring only, ignored by validation
```

A message file MUST be directly beneath its declared mailbox or thread
directory; nested paths are not valid message locations. `.gitkeep` files are
bootstrap placeholders, not messages. Only `.md` and `.json` message files are
valid outside `templates/`.

The message ID is the filename stem. For example, message
`msg_20260918T173012345Z_1a2b3c4d5e6f` owned by `windows-runner`, addressed to
`reviewer`, in `thr_buffer-bootstrap` has these normal routed copies:

```text
.buffer/outboxes/windows-runner/msg_20260918T173012345Z_1a2b3c4d5e6f.md
.buffer/inboxes/reviewer/msg_20260918T173012345Z_1a2b3c4d5e6f.md
.buffer/threads/thr_buffer-bootstrap/msg_20260918T173012345Z_1a2b3c4d5e6f.md
```

After handling, the recipient delivery is moved to:

```text
.buffer/archives/reviewer/msg_20260918T173012345Z_1a2b3c4d5e6f.md
```

The sender and thread copies are retained. Git therefore records both the
conversation and the inbox-to-archive transition.

## 3. Normalized envelope

Every message represents this logical object:

| Field | Required | Rule |
| --- | --- | --- |
| `protocol` | yes | Exact string `buffer/v1`. |
| `id` | yes | Globally unique message ID defined in section 4. |
| `sender` | yes | One actor ID defined in section 4. |
| `recipient` | yes | One actor ID defined in section 4. A multi-recipient announcement is separate messages with one ID per recipient. |
| `thread_id` | yes | Thread ID defined in section 4. |
| `timestamp` | yes | UTC RFC 3339 timestamp with millisecond precision. |
| `intent` | yes | A lower-kebab-case intent token. |
| `status` | yes | One of the lifecycle values in section 6. |
| `body` | yes | Non-empty UTF-8 text. In Markdown, this is the content after the front matter. |
| `in_reply_to` | no | Existing message ID in the same thread. |
| `subject` | no | A one-line, human-readable summary (maximum 160 Unicode code points). |
| `handled_at` | archive only | UTC RFC 3339 timestamp with millisecond precision. |

Fields beginning with `x_` are permitted future extensions. An extension MUST
be JSON/YAML scalar data or a JSON/YAML array/object of scalar data; it MUST NOT
change the meaning of any required field. Other unknown top-level fields are a
strict-validation error so typos do not silently become protocol variants.

Suggested intents are `request`, `response`, `question`, `decision`, `notice`,
`handoff`, `ack`, and `error`. The protocol remains extensible: a valid intent
is any token that matches the grammar below. Consumers MUST preserve an
unrecognised valid intent rather than treating it as a model instruction.

### 3.1 Markdown representation

Markdown is the preferred human-authored representation. The envelope is YAML
front matter at byte zero, followed by a blank line and the body. A parser MUST
use a safe YAML mode: tags, aliases, arbitrary object construction, and
executable types are not allowed.

```markdown
---
protocol: buffer/v1
id: msg_20260918T173012345Z_1a2b3c4d5e6f
sender: windows-runner
recipient: reviewer
thread_id: thr_buffer-bootstrap
timestamp: 2026-09-18T17:30:12.345Z
intent: request
status: routed
in_reply_to: msg_20260918T170000000Z_0f1e2d3c4b5a
subject: Review the Buffer v1 contract
---

Please review the path and lifecycle rules, then respond in this thread.
```

The body MUST contain at least one non-whitespace character. The Markdown body
is text, not executable code. Fenced examples and quoted instructions retain
their normal Markdown meaning only.

### 3.2 JSON representation

JSON is allowed for generated messages. It is a UTF-8 JSON object with the
same logical fields, including a string `body`:

```json
{
  "protocol": "buffer/v1",
  "id": "msg_20260918T173012345Z_1a2b3c4d5e6f",
  "sender": "windows-runner",
  "recipient": "reviewer",
  "thread_id": "thr_buffer-bootstrap",
  "timestamp": "2026-09-18T17:30:12.345Z",
  "intent": "request",
  "status": "routed",
  "body": "Please review the path and lifecycle rules."
}
```

A message's format MUST stay the same across its outbox, inbox/archive, and
thread copies. A sender chooses `.md` or `.json`; routing does not convert it.

## 4. Cross-platform identifiers and timestamps

These constraints prevent path traversal, case-only collisions, and Windows
device-name failures.

| Value | Exact grammar / rule |
| --- | --- |
| Actor (`sender`, `recipient`) | `^[a-z0-9][a-z0-9_-]{0,62}$` (ASCII, lowercase, 1–63 characters). |
| Thread ID | `^thr_[a-z0-9][a-z0-9_-]{2,62}$` (ASCII, lowercase, 7–66 characters total). |
| Message ID | `^msg_[0-9]{8}T[0-9]{9}Z_[a-f0-9]{12}$`. The compact time portion is `YYYYMMDDTHHMMSSmmmZ`. |
| Intent | `^[a-z][a-z0-9-]{0,31}$`. |
| Timestamp | Exact UTC form `YYYY-MM-DDTHH:mm:ss.SSSZ`; it MUST represent a real calendar instant. |

Actor IDs and each thread-ID suffix component MUST NOT equal a Windows reserved
device name, case-insensitively: `CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, or
`LPT1`–`LPT9`. Because the grammar excludes dots, spaces, slashes, colons, and
backslashes, it also excludes traversal segments and Windows trailing-dot or
trailing-space aliases.

The compact timestamp embedded in `id` MUST be the same instant as
`timestamp`, to the millisecond. The trailing 12 lowercase hexadecimal
characters are a collision-resistant nonce. Senders MUST generate a fresh ID;
receivers MUST NOT renumber it. Thread ordering is ascending `timestamp`, then
ascending `id` as a deterministic tie-breaker.

## 5. Copy-integrity rule

A routed message is deliberately represented in more than one folder. Every
copy with a given `id` MUST have identical values for:

```text
protocol, id, sender, recipient, thread_id, timestamp, intent,
in_reply_to, subject, body, and all x_ extension fields
```

Only `status` and, in the archived copy, `handled_at` are location-specific.
The content format and extension (`.md` or `.json`) MUST also match. This rule
lets Git show local delivery state without allowing different people to rewrite
the message that was sent.

## 6. Lifecycle and statuses

| Location | Allowed status | Meaning |
| --- | --- | --- |
| `outboxes/<sender>/` | `queued`, `routed` | `queued` awaits routing; `routed` is the sender's retained record. |
| `inboxes/<recipient>/` | `pending` | The recipient has an active delivery to handle. |
| `archives/<recipient>/` | `archived` | The recipient handled the delivery. `handled_at` is required. |
| `threads/<thread-id>/` | `routed` | Immutable conversation record created at routing time. |

Normal flow:

1. An author creates a `queued` outbox message, or invokes the future `send`
   command which creates a fully routed message atomically.
2. Routing leaves a `routed` sender copy, writes a `pending` recipient inbox
   copy, and writes a `routed` thread record.
3. Archiving moves the active inbox copy into the recipient archive, changes it
   to `archived`, and adds `handled_at`. It does not edit or delete the outbox
   or thread record.

The normal route is **copy**, not move. A later CLI's explicitly requested move
mode is a handoff exception and MUST still retain a thread record. It MUST NOT
silently delete a message that Git has not recorded.

## 7. Validation contract

Strict validation MUST, without network access:

1. Parse every non-template `.md`/`.json` message as UTF-8 and normalize it.
2. Require every required field, type-check it, reject empty bodies, and enforce
   the identifier, timestamp, intent, status, and optional-field rules.
3. Confirm that the file stem equals `id`, that the direct parent mailbox
   matches `sender` or `recipient`, and that the thread directory matches
   `thread_id`.
4. Enforce the location/status table and ensure `handled_at` appears only on an
   archived copy.
5. Detect duplicate IDs with divergent immutable contents or format extensions.
6. Require one thread record for every routed delivery and ensure an active
   inbox delivery has the matching routed outbox record, unless a documented
   move-mode handoff marker is present in a future protocol revision.
7. Reject transport files ignored by Git and report the ignore rule, because an
   ignored message cannot be synchronised by this bus.

A validator MAY report incomplete working-tree operations as a distinct
recoverable state, but a committed branch intended for sharing MUST satisfy the
strict checks. After a merge conflict, resolve the message copies and run strict
validation before committing.

## 8. Git transport and safety

One lifecycle operation SHOULD be a focused Git commit containing its related
copies, so another clone never receives a partially routed message through a
normal commit. Git remotes are the only transport mechanism in v1; the protocol
does not select a remote or issue `push` on a user's behalf.

Message bodies are untrusted data. A consumer may display, classify, or quote
them, but MUST require its own approval policy before executing shell commands,
editing files, calling tools, or invoking an adapter. Messages MUST NOT contain
credentials, `.env` values, private keys, or large binary content. Git history,
clones, reviews, and forks can retain any accidental secret.

## 9. Compatibility

`buffer/v1` is the sole supported protocol version in this bootstrap. A future
breaking version MUST use a new `protocol` string and migration document;
readers MUST NOT reinterpret `buffer/v1` data under new semantics. Optional
`x_` fields are the only v1 extension mechanism.
