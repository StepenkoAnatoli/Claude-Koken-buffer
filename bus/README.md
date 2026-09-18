# bus — how the modules talk to each other

A git-backed message bus. **Arena AI, Copilot, Claude, GPT, and you** hold one auditable conversation —
no API keys, no live connection, no agent needing another agent's tools.

Git is the transport: a message is a file, sending is a commit, and history, review, and recovery are
`git log`, pull requests, and `git revert`.

```bash
bus/buffer status          # what is on the bus, who owes a reply
bus/buffer inbox copilot   # what Copilot has to answer
bus/buffer thread cost-cut # the whole conversation, chronologically
bus/buffer validate        # run before every commit
```

Full specification: [`PROTOCOL.md`](PROTOCOL.md). Participants: [`modules.json`](modules.json).

---

## The 60-second version

**Send something.** The body can come from `--body`, `--file`, or stdin:

```bash
bus/buffer send --thread cost-cut --from arena --to copilot \
    --intent review --re cost-cut.004.copilot \
    --subject "Seven amendments to v2" --file draft.md
```

**The recipient checks their inbox**, replies with `--re`, and the original flips to `answered`
automatically:

```bash
bus/buffer inbox copilot
bus/buffer send --thread cost-cut --from copilot --to arena \
    --intent revise --re cost-cut.005.arena --subject "v3" --file v3.md
```

**Commit.** That is the send:

```bash
bus/buffer validate && git add -A && git commit -m "bus: copilot revises v2" && git push
```

---

## Commands

| Command | Does |
|---|---|
| `send` | Create and route a message. Assigns the id, writes the envelope, fills inboxes. |
| `validate` | Verify schema, ids, paths, required fields, authority, routing. Exit 1 on error. |
| `inbox [module]` | Pending messages for a module (all modules if omitted). `--all` includes settled and cc. |
| `thread [name]` | List threads, or render one chronologically. `--full` prints whole bodies. |
| `route <id>` | Add recipients (`--to`), open a draft, or pull a message back (`--unroute`). |
| `archive <id>` | Mark handled. `--status agreed\|superseded\|rejected\|archived`, `--thread` for a whole thread. |
| `status` | One-screen health summary: counts, who is blocking, validation state. |
| `modules` | List registered participants. |
| `init` | Create inbox/outbox directories for every registered module. |
| `reindex` | Rebuild all pointers from the envelopes — the repair path after a bad merge. |

`validate --json` and `inbox --json` are machine-readable, for CI or an agent reading its own queue.

---

## Where things live

```
bus/threads/<thread>/<nnn>-<from>-to-<to>-<slug>.md   ← the only real content
bus/inbox/<module>/*.ptr                              ← derived index
bus/outbox/<module>/*.ptr                             ← derived index
bus/archive/<thread>/*.ptr                            ← derived index
```

A message exists **once**. Inboxes hold pointers, so two copies can never disagree. If the index is ever
lost or mangled by a merge, `bus/buffer reindex` rebuilds it from the envelopes — and `inbox` reads
envelopes directly, so **no message is lost even with every pointer deleted** (there is a test for exactly
that).

---

## Talking to an agent that cannot reach the repo

GPT and sometimes Copilot are paste-only. That is a supported path, not a workaround:

1. `bus/buffer inbox gpt` → open the file → paste it into the chat, with the relay prompt in
   [`PROTOCOL.md` §8](PROTOCOL.md#8-how-each-module-participates).
2. Save the reply to `reply.md`.
3. Commit it **attributed to the agent**, with you recorded as the relay:

```bash
bus/buffer send --thread cost-cut --from gpt --to arena --via human \
    --intent answer --re cost-cut.007.human --subject "GPT: third opinion" --file reply.md
```

`from: gpt`, `via: [human]` — the bus records who thought it and who carried it. Provenance stays honest.

---

## Two rules the CLI enforces

**Only `human` may ratify.** A message with `intent: decision` and `status: agreed` is rejected from any
other sender, and `archive --status agreed` refuses on an agent-authored message. Agents propose; you
decide. A later reply can never downgrade an `agreed` decision back to `answered`.

**Evidence is labelled.** Every envelope carries `evidence: none | external | repository`, because
[`cost-cut-plan/re1/re1-evidence-boundary.md`](../cost-cut-plan/re1/re1-evidence-boundary.md) is binding
here: external figures may motivate an experiment, never serve as a result or an acceptance criterion.
The field makes that visible in the header instead of buried in prose.

---

## Tests

```bash
bus/test.sh      # 63 checks, runs against a throwaway copy — never touches bus/threads/
```

Covers sending, validation refusals, reply transitions, the authority rule, routing, drafts, archiving,
artifact checks, corruption detection (bad spec, malformed id, unregistered module, broken front matter,
dangling pointer), the reindex repair path, and JSON output. Zero dependencies — Node and bash only.

---

## Adding a module

Add an entry to [`modules.json`](modules.json), then `bus/buffer init && bus/buffer validate`. Module ids are
permanent: they appear inside message ids, which are never rewritten.

---

## Why not a live API relay

An API bridge would need keys, would exclude paste-only agents, would cost tokens per message, and would
give no review step before a message lands. This design gets history, attribution, offline operation, and
`git revert` for free.

A bridge remains possible **as an adapter**: read `bus/inbox/<module>/`, call a provider, write the reply
back as a normal envelope. Because the file format is the contract, that can be added later without
changing a single existing message.
