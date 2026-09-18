# re1 — Assumption register and ambiguity handling

Policy applied: **do not silently guess.** Every load-bearing assumption in this plan is named, labelled,
and either **asked now** (decision-critical) or **stated explicitly** (not decision-critical).
Resolver: the user. Consequences of error are stated for each row.

> Note: this file is an addition to the agreed tree. It is part of the review stage (`re1`), not a new
> version. Veto/relocate is trivial — nothing depends on its path.

## 1. Labels

- `[FACT]` — verified against a cited source.
- `[ASSUMPTION]` — believed true, **not verified in your environment**.
- `[UNKNOWN]` — decision-critical and currently unanswered → asked in §3.

## 2. Load-bearing assumptions

| ID | Assumption | Label | If wrong → consequence (what actually breaks) | Resolution |
|---|---|---|---|---|
| A1 | The cost target is **money for tokens** (API-style billing), so "$ per completed task" is the right KPI. | `[UNKNOWN]` → Q1 | If you are on a Pro/Max subscription, "$" is not a billed quantity. The headline KPI, the `L5` batch lever, and the cache-dollar emphasis must be re-expressed as **rate-limit headroom**, not re-labelled. Cost of error: we optimise a number you never pay. | **Q1** |
| A2 | `en1/` faithfully records the version-1 plan and is preserved rather than rewritten. | `[ASSUMPTION]` | If that text was Copilot's draft rather than yours, the label "first planning version" still holds (it is version 1 of the plan), but the guardrails are not "yours". Consequence: low — kept verbatim either way; all amendments live in `re1`/`final`. | accepted as low impact |
| A3 | The environment is Claude Code CLI with `/context`, `/cost`, `/usage`, MCP, skills, auto-compact. | `[ASSUMPTION]` | Without `/context` (or equivalent), phase 1 cannot be measured as written and condition **V5** (knob names) fails. Cost of error: high — blocks the phase-1 gate. | **Q3** + phase-0 dry run |
| A4 | Config knob names (`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`, `MAX_MCP_OUTPUT_TOKENS`, `BASH_MAX_OUTPUT_LENGTH`, effort level, tool-search deferral) exist and behave as described in the installed version. | `[ASSUMPTION]` | A wrong knob fails **silently** — no error, just no effect, and the plan reports "no saving" without knowing why. | V5 verify + the phase-1 falsification test catches it (payload would not drop) |
| A5 | Cache read ≈ 0.1× base, write ≈ 1.25× base, TTL ≈ 5 min ⇒ "compact before an idle gap" is worth doing. | `[FACT]` (community-measured) | If the TTL is longer, the rule is merely unnecessary (harmless). If billing differs, the compact-before-idle advice could be wrong in either direction. | phase 0: deliberately idle 10 min, read the cache-write rows in `/cost` |
| A6 | Single developer, effectively one machine, interactive use only. | `[UNKNOWN]` → Q4 | If a team or CI is involved, user-level `~/.claude` config is not enforceable, project config must be checked in, and the batch/non-interactive path becomes material. Cost of error: high — the implementation plan's file locations and enforcement story change. | **Q4** |
| A7 | `Claude-Koken-buffer` is the repo where the plan is applied and measured. | `[UNKNOWN]` → Q2 | If this repo is only the *plan container* and real work happens elsewhere, the asset table in `final-implementation-plan.md` (`CLAUDE.md`, `.claude/settings.json`, replay tasks) points at the wrong repo and phase 1 produces nothing evaluatable. Cost of error: high. | **Q2** |
| A8 | Replay tasks T1–T3 can be run repeatedly from fixed commits in this environment. | `[ASSUMPTION]` | If not, phase gates degrade to manual bookkeeping — which §5 argues will be abandoned. Cost of error: high, but detectable immediately. | phase 0 dry-run of one replay task |
| A9 | You are the final verifier and will complete sign-off V1–V4. | `[FACT]` (your instruction) | — | — |
| A10 | Quality can be judged by test results plus your review. | `[ASSUMPTION]` | If the target project has no test suite, criteria A2/A4 weaken: "quality flat" would be asserted without evidence. Cost of error: medium — the plan must then say "review + no regressions" instead of "test-pass rate". | phase 0: count available tests in target repo |

## 3. Decision-critical ambiguities — asked now

| ID | Question | Why it is decision-critical (cost of a wrong guess) |
|---|---|---|
| Q1 | Objective function: API dollars, subscription rate-limit headroom, or both? | Changes the KPI, the dashboard, and whether `L5` batch applies. Guessing wrong invalidates the measurement plan (A1). |
| Q2 | What is `Claude-Koken-buffer` — reusable toolkit, the working project, both, or a plan container? | Determines where phase-1 assets live and whether phase 1 is measurable at all (A7). |
| Q3 | Which surface(s) must the plan cover: CLI only, CLI + IDE extension, API/SDK builds, or all? | Determines which knobs exist and whether `/context`-based measurement is available (A3/A4). |
| Q4 | Adoption scope: just you on one machine, you on several, a team, or a team plus CI? | Determines whether config can be user-level or must be checked in, and whether the non-interactive path matters (A6). |

## 4. Ambiguities deliberately **not** asked (stated instead)

- **Marker semantics** — resolved: `en1`/`re1`/`final` are version marks, `L1–L7` are levers.
- **Plan folder name** — using `cost-cut-plan/` exactly as you specified; a rename is trivial.
- **The extra `README.md` and this file** — assumed useful for navigation/audit; removable on request.
- **Documentation style** — assumed dense tables with no prose padding, matching your concise-interaction policy.
- **Version-1 preservation** — assumed verbatim, including its guardrails, with my changes visible as explicit diffs in `re1`.
- **Numbers precision** — assumed qualitative ranking is acceptable now and exact figures must come from your own measurement, not community sources.

## 5. Honest limitations of this plan (self-critique, user-centered)

1. **It is a plan, not evidence.** Nothing has been measured here. Every effect size in `re1` is a
   community-measured hypothesis to be confirmed on T1–T3.
2. **Measurement friction is the most likely real-world failure mode.** A plan requiring manual replay runs
   twice a week will be abandoned by week three, and then the phase gates become fiction. Mitigation must be
   designed in phase 0: one-command replay, automatic capture (OTel/statusline), machine-generated reports —
   not willpower.
3. **`L1`'s rule needs judgement every time.** Deleting a memory rule that "seems inferable" can surface weeks
   later as a repeated mistake. Mitigation: deletions in reversible commits, explicit 2-week review.
4. **If billing is subscription-based, part of this plan is inapplicable** (`L5` batch, $ framing). The plan
   must be re-expressed, not just re-labelled. Hence Q1.
5. **Cost is not the only user goal.** Session continuity and recovery matter; the handoff file in phase 2 is
   the mechanism, and it must not be skipped just because it costs tokens.
6. **Pricing and TTL are external facts that will change.** Structure survives; specific numbers do not.

## 6. Top three consequences of error (why §3 is worth answering before Copilot's reply)

1. **A1 wrong** → the whole programme optimises a quantity you never pay, and looks successful while doing it.
2. **A7 wrong** → phase 1 changes a repo that is not measured; the effort is invisible.
3. **A3/A8 wrong** → no gate can be evaluated, so the plan stalls after phase 1 with no way to tell whether
   anything worked.
