# Claude-Koken-buffer

A **plan container** and a **message bus** for multi-agent work.

| Folder | What it is |
|---|---|
| [`bus/`](bus/) | **Inter-module message bus** — how Arena AI, Copilot, Claude, GPT, and the operator talk to each other, over git, with no API keys. |
| [`cost-cut-plan/`](cost-cut-plan/) | The token-cost reduction programme: versions `en1` → `en2` → `re1` → `final`, decision log, evidence boundary. |
| [`cost-cut/`](cost-cut/) | Copilot's "Cost-cut plan v2" as its own working folder. |

## Start here

```bash
bus/buffer status          # what is on the bus and who owes a reply
bus/buffer inbox           # every module's pending messages
bus/buffer thread cost-cut # the whole cost-cut conversation, chronologically
```

The cost-cut exchange that produced `cost-cut-plan/` is recorded on the bus as thread `cost-cut`
(messages 001–006, back-filled and marked `reconstructed: true`), so the discussion and its artifacts are
one auditable trail.

## Standing rules

**The operator decides.** Agents may propose a decision; only `human` may mark one `agreed`. Enforced by
`bus/buffer validate`.

**This repository claims no savings.** Every figure in `cost-cut-plan/` is an external community
measurement, admissible as motivation to test a hypothesis and nothing more, until reproduced here with
date, method, and sample count. Binding rule:
[`cost-cut-plan/re1/re1-evidence-boundary.md`](cost-cut-plan/re1/re1-evidence-boundary.md).

**Phase-1 assets do not live here.** This repo is a container; measurement happens in the target project
(`StepenkoAnatoli/WindowsRunner`, frozen at `406bc65`). Recorded in message `cost-cut.007.human`.

## Tests

```bash
bus/test.sh          # 63 checks, zero dependencies
bus/buffer validate  # run before every commit
```
