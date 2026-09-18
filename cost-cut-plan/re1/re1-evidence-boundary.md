# re1 — Limitations and evidence boundary (AGREED)

Agreed 2026-09-18 between the user, Copilot (v2), and the Arena review. **Binding on every document in
`cost-cut-plan/`.** This file exists because a plan that cites numbers is one edit away from presenting them
as its own results.

## 1. The rule

External measurements may be used for exactly one purpose: **to justify why a hypothesis is worth testing.**
They may **not** be used as:

- **repository results** — nothing here was measured in this repository;
- **forecast inputs** — no projected savings, no expected percentages, no extrapolated bills;
- **acceptance criteria** — no external figure may become a gate, threshold, or target.

**Promotion path:** reproduce in this environment → recorded with date, method, and sample count →
becomes *repository evidence* → only then admissible as a result, a forecast input, or a criterion.

## 2. External figure register

Every figure used anywhere in this plan, with its actual status. "Motivation only" means it may be cited as
a reason to run an experiment, never as a number we rely on.

| Figure | Value | Origin | Status |
|---|---|---|---|
| Cache reads+writes share of session spend | ~93% (41-day dataset) | community analysis | motivation only |
| Output share of session spend | ~$0.79 of $20.97 (170-turn session); ~7% | community analyses | motivation only |
| Restart warm-up cost | ~$0.60 per restart; ~$0.50–$1.00 after compact | community analysis | motivation only |
| Cold-start resident payload | 20k–30k tokens before typing | community measurement | motivation only |
| MCP tool definitions | 10k–20k tokens per server per session | community measurement | motivation only |
| Cache economics | read 0.1×, write 1.25×, TTL ~5 min | provider docs + community | verify against provider docs and in this environment before use |
| `CLAUDE.md` diet benchmark | 3,847 → 312 tokens, no regression | community benchmark | motivation only |
| Spend concentration | 91% of spend in 80+ turn sessions | community analysis | motivation only |
| Model rates / batch discount | Sonnet $3/$15, Opus $5/$25, Haiku $1/$5, batch −50% | published rates | applies only after the objective is chosen (F1–F2) |
| `/context` MCP overstatement | 45k reported vs ~15k real | community investigation | caveat only — verify by counting the real request |

## 3. What this repository can claim today

**Nothing.** There is no telemetry, no billing data, no task history, no benchmark, and no implementation.
Therefore, throughout this repository:

- no savings claim of any kind is made or implied;
- every ranking is a hypothesis pending measurement;
- every threshold in `final/` is provisional until set from the phase-0 baseline of this project.

## 4. Objective dependency (agreed)

The ranking of interventions **depends on the objective**, which is not yet chosen:

| If the constraint is… | Then… |
|---|---|
| **API dollars** | Rate routing (`I4`/EN4) may be valuable; the batch path (−50%) applies; the unit is dollars. |
| **Subscription / rate-limit headroom** | Rate-routing assumptions may not apply (batch unavailable; the unit is window capacity consumed) — and the **recurring-prefix intervention (`I1`/EN1) becomes more important**, because it reduces capacity burn on every turn. |
| **Both** | Two dashboards; a weighting rule must be written down; units must never be silently switched mid-comparison. |

## 5. Conditional recommendation (agreed; supersedes any earlier ranking)

1. **Instrument first.** No behaviour change until measurements can distinguish successful work, retries,
   correction turns, cache usage, and failures.
2. **Identify whether the constraint is dollars, capacity, or both.**
3. **Reproduce measurements** in this environment (facts sweep F1–F13, then replay tasks T1–T3).
4. **Benchmark `I1` (prefix diet) and the other candidates** under the matched protocol and quality rubric.
5. **Rank them from repository-specific evidence.**

Until step 5 completes, the `I1`-first ordering is a **working hypothesis, not a decision.**

## 6. Consequences carried into the other documents

| Document | Change |
|---|---|
| `final/final-decision.md` | Reframed: the decision **is** the conditional chain above; the ordering is labelled a working hypothesis. |
| `final/final-acceptance-criteria.md` | Numeric thresholds marked **provisional**; to be set from the phase-0 baseline. External figures removed as criteria. |
| `re1/re1-comparison-and-risks.md`, `re1/re1-revised-recommendation.md` | Banner added: figures are external; thresholds provisional. |
| `DECISION-LOG.md` | This agreement logged as a dated entry. |

**Enforcement:** any number appearing in this repository without an external/internal label is a defect —
report it rather than trusting it. A future reader must never be able to mistake a community measurement for
our result.
