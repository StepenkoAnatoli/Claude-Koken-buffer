# DECISION-LOG

Dated decisions, evidence, and status. One log for the whole programme (merged from v2's DECISION-LOG idea).
Rule: hypotheses and conclusions never share a row — a hypothesis is labelled until it is measured.

## 2026-09-18 — en1 received
Version-1 plan: four approaches (patch-only output, symbol-focused context, tests as the task contract,
concise interaction policy) + staged guarded recommendation. Recorded in `en1/`.

## 2026-09-18 — re1 review of en1
Outcome: reordering, not rejection. Foundation moved from symbol retrieval to the **resident prefix**;
rate routing added; session shaping added; patch-only demoted to reviewability; concise policy demoted to
hygiene; tests-as-contract promoted (turn reduction, not prose compression). Falsification test added.
Option naming `EN1–EN4` retired. Evidence: community measurements, labelled as hypotheses.

## 2026-09-18 — en2 received (Copilot "Cost-cut plan v2")
Evidence-gated plan adding telemetry/privacy, ownership, rollback, matched protocol, quality rubric,
go/no-go gates. Ordering converges with `re1`: prefix diet first, rate routing second (provider-gated),
session shaping conditional, retrieval last. Recorded in `en2/`.

## 2026-09-18 — re1 review of v2
Outcome: **v2 accepted as the stronger plan on governance**; seven amendments proposed
(`re1/re1-review-of-copilot-v2.md` §4), five of them contributions v2 lacks:
facts-sweep split, piggyback protocol, candidate payload-tax rubric line, EN3a/EN3b split, EN1 cache-freeze half.
One earlier position withdrawn: phase-1 bundling of prefix-diet with rate routing (v2's causality rule is correct).
New dominant risk recorded: **governance overhead that never yields a verified saving for a one-person project.**
Canonical intervention IDs proposed: `I1`–`I4` (aliases: v2 `EN1–EN4`, re1 `L1–L7`).

## 2026-09-18 — Evidence boundary agreed (user + Copilot + Arena)
Agreed and now binding: the figures used throughout this folder (93% cache share of spend, ~$0.79 output in a
$20.97 session, ~$0.60 restart warm-up, 20–30k cold-start payload, and the rest) are **external community
measurements**. They may justify why a hypothesis is worth testing; they may **not** appear as repository
results, forecast inputs, or acceptance criteria until reproduced here. This repository has no telemetry,
billing data, or task history, so it **claims no savings**. Ranking is replaced by a conditional chain:
(1) instrument; (2) identify dollars vs capacity vs both; (3) reproduce measurements; (4) benchmark `EN1`/`I1`
and the other candidates under the matched protocol; (5) rank from repository-specific evidence. Until step 5,
`I1`-first is a **working hypothesis**. Dependency recorded: API dollars → rate routing (`I4`/EN4) may be
valuable; subscription/rate-limit headroom → rate-routing assumptions may not apply and the recurring-prefix
intervention (`I1`/EN1) becomes more important. Binding on all documents — see `re1/re1-evidence-boundary.md`.

## Open — blocks both plans
1. Environment facts (F1–F13) not yet measured → see `re1/re1-facts-sweep.md`.
2. Objective function not chosen (API dollars vs subscription headroom vs weighted).
3. `Claude-Koken-buffer`'s role not confirmed (toolkit / working project / both / plan container).
4. Client surfaces and adoption scope not confirmed.

Status of the programme: **planning only. Nothing implemented, nothing configured, nothing routed.**
No claim of savings is made anywhere in this repository.
