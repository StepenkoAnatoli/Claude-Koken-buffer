# Claude-Koken-buffer — cost-cut plan (v0, PLAN ONLY)

Status: **plan / discussion draft.** No code, no config applied yet.
Owner of final decision: the user. This folder is the artifact that gets handed to Copilot for the
"which way do we go" discussion.

## Mark legend

| Mark | Meaning |
|---|---|
| `EN1`..`EN4` | **Engineering option** — one way to do the cost cut (candidates). |
| `RE1` | **Review / evaluation** — scored verdict on the four options, plus a teardown of the example advice that inspired this. |
| `FINAL` | The single recommendation + rollout + acceptance criteria + open questions. |

Markers are in both the filename and the first heading, so `grep -rn "EN2" .` works.
(Rename is a one-liner if "en"/"re" meant something else to you.)

## Index

| File | One-liner |
|---|---|
| [`EN1-prefix-diet.md`](EN1-prefix-diet.md) | Shrink + freeze the payload re-sent on **every** request. |
| [`EN2-retrieval-discipline.md`](EN2-retrieval-discipline.md) | Shrink the per-turn working set (exact files, filtered output, subagents). |
| [`EN3-session-shaping.md`](EN3-session-shaping.md) | Cut turn count and mega-session growth; compact instead of restart. |
| [`EN4-rate-routing.md`](EN4-rate-routing.md) | Pay a lower rate for the same tokens (model/effort/batch). |
| [`RE1-review.md`](RE1-review.md) | Scoring matrix, why the 4 popular tips underdeliver, traps. |
| [`FINAL.md`](FINAL.md) | **The recommendation**, rollout, KPIs, falsification test, questions for Copilot. |

## The one-line thesis (read `FINAL.md` for the argument)

Real Claude Code spend ≈ **turns × context-per-turn × cache-adjusted rate**, where output tokens are
**~3–7%** of the bill. Almost all popular advice optimises that 3–7% or relies on human discipline.
The winner optimises the multiplier that is re-sent every turn **and** is enforced by config.
