# koken-bus/1 — inter-module message protocol

A git-backed message bus that lets **Arena AI, Copilot, Claude, GPT, and the human operator** hold one
auditable conversation, without any of them needing an API key, a live connection, or each other's tools.

**Git is the transport.** A message is a file. Sending is a commit. History, review, synchronisation, and
recovery are `git log`, `git diff`, `git pull`, and `git revert` — nothing is reimplemented.

> This document is **binding on message form**. It says nothing about the content of any thread, and it does
> not relax `cost-cut-plan/re1/re1-evidence-boundary.md`, which remains binding on claims.

---

## 1. The model in one picture

```
      writes                                                     reads
  ┌──────────────┐                                         ┌──────────────┐
  │  arena       │──┐                                   ┌──│  copilot     │
  │  (repo)      │  │      bus/threads/<thread>/        │  │  (mixed)     │
  └──────────────┘  │   ┌──────────────────────────┐    │  └──────────────┘
  ┌──────────────┐  ├──▶│ 001-human-to-all-....md  │◀───┤  ┌──────────────┐
  │  claude      │  │   │ 002-copilot-to-human-.md │    ├──│  gpt         │
  │  (mixed)     │──┤   │ 003-arena-to-copilot-.md │    │  │  (paste)     │
  └──────────────┘  │   └──────────────────────────┘    │  └──────────────┘
  ┌──────────────┐  │        ▲ canonical files          │
  │  human       │──┘        │                          │
  │  (relay)     │     bus/inbox/<module>/*.ptr  ───────┘  pointers, not copies
  └──────────────┘     bus/outbox/<module>/*.ptr
```

One message, one file, one canonical location. Inboxes hold **pointers** (`.ptr` files containing a relative
path), so two copies of a message can never drift apart.

---

## 2. Folder layout

```
bus/
├── PROTOCOL.md          this file — binding on message form
├── modules.json         registry: who may appear in from/to/cc/via
├── buffer               the CLI (Node, zero dependencies)
├── lib/                 CLI internals (fm.js, core.js, validate.js)
├── templates/           starting bodies per intent
├── threads/<thread>/    CANONICAL message files
├── inbox/<module>/      pointers to messages awaiting that module
├── outbox/<module>/     pointers to messages that module sent
└── archive/<thread>/    pointers to messages taken out of the working set
```

**Rule:** only `threads/` holds content. Everything else holds pointers and is rebuildable.

---

## 3. The envelope

A message is a Markdown file: strict front matter, then a free-form body.

```markdown
---
spec: koken-bus/1
id: cost-cut.003.arena
thread: cost-cut
from: arena
to: [copilot]
cc: [human]
via: [human]
date: 2026-09-18T14:05:00Z
intent: review
status: open
re: [cost-cut.002.copilot]
subject: Seven amendments to cost-cut plan v2
evidence: external
artifacts: [cost-cut-plan/re1/re1-review-of-copilot-v2.md]
labels: [governance]
---

## Context
...

## Content
...

## Requested of the recipient
...
```

### 3.1 Fields

| Field | Required | Type | Meaning |
|---|---|---|---|
| `spec` | ✅ | literal | Always `koken-bus/1`. Lets a future v2 coexist. |
| `id` | ✅ | `<thread>.<nnn>.<from>` | Globally unique. Assigned by `buffer send`. Never reused, never renumbered. |
| `thread` | ✅ | lower-kebab | Must equal the containing folder name. |
| `from` | ✅ | one module id | Exactly one sender. |
| `to` | ✅ | list of module ids | Who must act. Non-empty. |
| `cc` | — | list | Informed, not expected to act. |
| `via` | — | list | Who physically relayed it (e.g. `human` copy-pasting to a paste-only agent). Keeps provenance honest. |
| `date` | ✅ | `YYYY-MM-DDThh:mm:ssZ` | UTC, to the second. Timezone-free so agents in different places sort identically. |
| `intent` | ✅ | enum | **What the sender wants back.** See §4. |
| `status` | ✅ | enum | Lifecycle position. See §5. |
| `re` | conditional | list of ids | Required for `answer`, `review`, `revise`. Must resolve to existing messages. |
| `subject` | ✅ | one line | Human-scannable. |
| `evidence` | — | `none`/`external`/`repository` | Defaults to `none`. See §6. |
| `artifacts` | — | list of repo paths | Files this message is about. **Validated to exist.** |
| `labels` | — | list | Free tags. |
| `reconstructed` | — | boolean | `true` when back-filled from pre-bus history rather than sent live. |

Front matter is a **strict subset of YAML**: `key: scalar` or `key: [a, b]`. No nesting, no multi-line values,
no comments. This is deliberate — a parser disagreement between two agents is a silent corruption, and a
subset this small cannot be misread.

### 3.2 Filenames

```
bus/threads/<thread>/<nnn>-<from>-to-<to>-<slug>.md
                      │     │       │      └─ slugified subject
                      │     │       └──────── recipient, or `all` when several
                      │     └──────────────── sender
                      └────────────────────── zero-padded sequence in the thread
```

The filename is derived from the envelope and **validated against it** — a mismatch is an error, so a file
cannot quietly claim one thing in its name and another inside.

---

## 4. Intents — what the sender wants back

| Intent | Means | Expected response |
|---|---|---|
| `ask` | A question. | `answer` |
| `answer` | Reply to an `ask`. Requires `re`. | — |
| `propose` | Concrete proposal to adopt something. | `review`, or a `decision` |
| `review` | Critique of a named message. Requires `re`. | `revise` or a `decision` |
| `revise` | Reworked version of an earlier message. Requires `re`. | `review` or a `decision` |
| `handoff` | Transfer of work with everything needed to continue. | `ack` |
| `decision` | A ruling that binds later messages. | — |
| `ack` | Receipt confirmation, no new content. | — |
| `note` | Context for the record. | nothing |

**Why a closed set:** the recipient must never have to infer whether it is being asked to decide, to critique,
or merely to read. Ambiguity there is what turns a multi-agent exchange into a loop.

---

## 5. Statuses — lifecycle

| Status | Meaning | In inbox? |
|---|---|---|
| `draft` | Written, not routed. | no |
| `open` | Routed, awaiting the recipient. | **yes** |
| `answered` | The recipient replied; the reply carries `re`. | no |
| `agreed` | Binding on later messages. | no |
| `superseded` | Replaced by a later message naming it in `re`. | no |
| `rejected` | Considered and declined. | no |
| `archived` | Handled, out of the working set. | no |

Transitions are automatic where they can be: sending a reply with `re:` flips the referenced message from
`open` to `answered` and clears its inbox pointer. Nothing is deleted — status changes only.

### Authority rule

> Only `human` may send `intent: decision` with `status: agreed`.

Agents may **propose** a decision; they may not ratify one. `buffer validate` enforces this, and
`buffer archive --status agreed` refuses on any message whose `from` is not `human`. This keeps the existing
governance of `cost-cut-plan/` intact: agents argue, the operator decides.

---

## 6. Evidence field

`cost-cut-plan/re1/re1-evidence-boundary.md` is binding on this repository: external figures may motivate an
experiment, never serve as a result, forecast input, or acceptance criterion. The bus carries that rule in
the envelope:

| `evidence` | Meaning |
|---|---|
| `none` | No measurements cited. Default. |
| `external` | Cites figures measured elsewhere — **motivation only.** |
| `repository` | Cites figures measured in a named repo, with date, method, and sample count in the body. |

A message claiming `repository` evidence without that provenance in its body is a review failure — the CLI
checks the label is present and legal; a human or agent reviewer checks it is *true*.

---

## 7. Lifecycle — the five moves

```
 send ──▶ [open] ──▶ recipient acts ──┬──▶ reply (re:) ──▶ [answered]
   │                                  ├──▶ route --to x ──▶ also in x's inbox
   │                                  └──▶ archive ──────▶ [archived|agreed|superseded|rejected]
   └── --draft ──▶ [draft] ──▶ route ──▶ [open]
```

```bash
bus/buffer send --thread cost-cut --from arena --to copilot \
    --intent review --re cost-cut.002.copilot \
    --subject "Seven amendments to v2" --file draft.md

bus/buffer inbox copilot          # what is waiting for Copilot
bus/buffer thread cost-cut        # the conversation, chronologically
bus/buffer route  cost-cut.003.arena --to gpt      # add a recipient
bus/buffer archive cost-cut.001.human --status superseded
bus/buffer validate               # before every commit
```

---

## 8. How each module participates

| Module | Access | How it sends | How it receives |
|---|---|---|---|
| `arena` | repo | Runs `buffer send` directly, commits. | Reads `bus/inbox/arena/`. |
| `claude` | mixed | Claude Code runs the CLI; otherwise the operator commits its body. | Paste the message file into the session. |
| `copilot` | mixed | VS Code edit + commit, or operator relay. | Open the file, or paste it. |
| `gpt` | paste | Operator pastes its reply into `--file` and commits with `via: [human]`. | Operator pastes the message. |
| `human` | repo | `buffer send`. | `bus/inbox/human/`. |

**Paste-only agents are first-class.** The `via` field records who relayed, so a reply produced by GPT and
committed by the operator is attributed to `gpt`, not to the person who pressed the keys.

### Prompt to hand a paste-only agent

> You are `<module-id>` on a git-backed message bus (`koken-bus/1`). Below is a message addressed to you.
> Reply with a Markdown body only — no front matter, no code fence around the whole answer. Structure it as
> `## Context`, `## Content`, `## Requested of the recipient`. If you cite figures measured elsewhere, say so
> explicitly; this repository forbids presenting external numbers as its own results.

Then: `bus/buffer send --thread <t> --from <module> --to <you> --intent answer --re <id> --via human --file reply.md`

---

## 9. Validation rules

`bus/buffer validate` exits non-zero on any **error**. Rules:

**Envelope** — front matter parses; `spec` is `koken-bus/1`; all required fields present; `id` matches
`<thread>.<nnn>.<from>` and is unique; `date` is UTC to the second; `thread` matches the folder; body non-empty.

**Participants** — every `from`/`to`/`cc`/`via` id exists in `modules.json`; exactly one `from`;
sender in own recipient list is a warning.

**Vocabulary** — `intent` and `status` are in the closed sets; `evidence` is `none`/`external`/`repository`.

**Replies** — `answer`/`review`/`revise` carry `re`; every `re` resolves to a real message; no self-reply.

**Authority** — `decision` + `agreed` only from `human`.

**Filesystem** — filename matches `from`, sequence, and id; every `artifacts` path exists; no dangling `.ptr`.

**Routing** — `open` messages have an inbox pointer for each recipient (warning if not); terminal messages do
not linger in an inbox (warning).

Run it before every commit. `bus/buffer validate --json` is CI-shaped.

---

## 10. Why git, not an API relay

| Property | This bus | Live API relay |
|---|---|---|
| Works with paste-only agents | ✅ | ❌ |
| Needs API keys / network | ❌ none | ✅ required |
| Full history and attribution | `git log` | custom logging |
| Review before a message lands | pull request | none |
| Recovery from a bad exchange | `git revert` | manual |
| Two agents editing at once | merge / conflict | race |
| Cost per message | zero | tokens |

An API bridge is a **future adapter**, not part of the core: it would read `bus/inbox/<module>/`, call a
provider, and write the reply back as a normal envelope. Because the file format is the contract, such an
adapter can be added without changing a single existing message. Until then, nothing here requires a key.

---

## 11. Adding a module

1. Add an entry to `bus/modules.json` (`id`, `name`, `kind`, `access`, `role`).
2. `bus/buffer init`
3. `bus/buffer validate`
4. Commit.

Module ids are lower-kebab and permanent — they appear inside message ids, which are never rewritten.
