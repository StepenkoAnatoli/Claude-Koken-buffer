# EN3 — Session shaping

## Problem
Long sessions accumulate repeated context, unclear objectives, stale assumptions, and correction turns. A large tail of very long sessions may dominate spend, but the exact distribution must be measured here.

## Proposed change
Shape sessions around clear milestones:
- define the task and acceptance criteria before implementation;
- use tests or compact examples as the contract;
- stop after a validated change rather than continuing exploratory conversation;
- create a concise handoff when context becomes stale or the task changes;
- start a new session for an independent objective.

A handoff should contain current state, files changed, tests run, unresolved risks, and the next action—not a transcript.

## Enforcement boundary
Do not impose arbitrary turn limits. A limit that interrupts debugging or encourages unsafe shortcuts harms users. Prefer soft warnings, checkpoint prompts, and task-completion detection. A hard limit is acceptable only after evidence identifies a safe threshold and provides a recovery path.

## Validation
Measure session length distribution, turns per completed task, abandoned sessions, rework, test outcomes, user effort, and total cost before and after the discipline.

## Trade-offs
Potentially the largest tail reduction; also the highest usability risk if enforced rigidly. Adopt only the smallest guardrail that reduces waste without interrupting legitimate complex work.
