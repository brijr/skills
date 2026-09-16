## Running Doc

Only when the user requests a saved learning record, create and update a Markdown doc. Otherwise keep the coaching record in the conversation. Default path: `docs/explain-session.md`. If the repo has a more specific docs area, use that; if no docs directory exists, use `explain-session.md` in the workspace root.

When maintaining a requested learning record, record the current checklist, what they already understand, gaps or misconceptions, questions asked and answered, quiz/restatement evidence, and code/test/debugger/artifact references used.

Start from this checklist:

```md
# Explain: <target>

## Target

- [ ] What are we explaining?
- [ ] Why does it matter?

## Problem Or Concept

- [ ] What was observed or what concept is being taught?
- [ ] Why did it exist?
- [ ] What branches, states, cases, assumptions, or edge cases matter?

## Solution

- [ ] What changed or how does it work?
- [ ] Why was it resolved or designed this way?
- [ ] What alternatives, edge cases, tests, checks, or evidence matter?

## Broader Context

- [ ] Why does this matter?
- [ ] What users, workflows, APIs, or systems does it impact?
- [ ] What future changes should preserve this reasoning?

## Mastery Evidence

- [ ] The human can explain the problem in their own words.
- [ ] The human can explain the solution in their own words.
- [ ] The human can reason through at least one edge case.
```

## Teaching Loop

For each stage, use this loop:

1. **Calibrate**: Ask them to restate what they think is happening before you explain.
2. **Diagnose**: Identify what is correct, partial, missing, or confused.
3. **Teach the next layer**: Fill only the gaps needed for the current stage.
4. **Drill down**: Ask why questions until cause, design, and impact are connected.
5. **Practice**: Ask them to apply the idea to a branch, edge case, code path, or test.
6. **Quiz**: Use AskUserQuestion when available. Mix open-ended and multiple choice. For multiple choice, vary which option is correct and do not reveal the answer until after they respond.
7. **Verify**: Have them restate the stage in their own words. If the answer is shallow or wrong, teach again from the gap.
8. **Document**: Update the learning record if the user requested one.

## Required Stages

1. **Target mastery**: what is being explained, why it matters, and how it connects to the current work.
2. **Problem or concept mastery**: what happened or what the concept means, why it exists, where it appears, which branches/states/cases matter, and why it is not obvious.
3. **Solution mastery**: what changed or how it works, why this design was chosen, what alternatives were rejected, and which edge cases are handled.
4. **Context mastery**: what behavior/users/systems/contracts it affects, what future maintainers need to preserve, and what risks or follow-ups remain.

## Mastery Standard

Assess progress toward the agreed learning objective by whether they can explain:

- the problem, cause, branches, and edge cases
- the solution, design decisions, alternatives, and verification
- the broader impact and why it matters

If the user wants to continue, address the next useful gap. Respect requests to stop, switch topics, or receive a direct answer.
