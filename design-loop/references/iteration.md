## Running one iteration

Work through these steps in order. Do not skip the quality target or screenshot steps — an agent that has not named what great looks like before code, and cannot see its own work after code, can only be consistent, not good.

### 1. Load the contract and pick the surface

Read `/design.md`, `/design.dark.md` if present, `design/BACKLOG.md`, and `design/DECISIONS.md`. Then determine the target surface:
- If the user named a surface, use it.
- Otherwise read `design/BACKLOG.md` and take the highest-priority surface whose status is `todo` or `in-progress`.
- Restate which surface you're working on and its current status before touching code.

Mark the surface `in-progress` in `design/BACKLOG.md` if it isn't already.

### 2. Write the surface brief and quality target

Before touching implementation files, follow [surface quality](surface-quality.md).

Write `design/briefs/<surface>-<timestamp>.md` with:
- user job, primary object, and primary action
- intended information hierarchy and density target
- 1-3 reference products, screens, or approved in-repo surfaces, plus anti-references
- what to remove, quiet, and sharpen
- non-negotiables from `/design.md`, `design/DECISIONS.md`, and the approved reference slice

If the brief conflicts with `/design.md`, `design/DECISIONS.md`, or the user's explicit direction, stop and flag the conflict before implementing. Do not resolve taste conflicts silently.

### 3. Implement

Build or refactor the surface against the design contract. Hard requirements:
- Use ONLY token values from `/design.md` or `/design.dark.md`. No arbitrary Tailwind values (`p-[13px]`, `text-[#333]`), no off-scale spacing, no raw colors outside token definitions. Token-backed references like `w-[var(--sidebar-width)]` are fine. The lint script enforces this — but write it right the first time.
- Follow component defaults and pattern guidance in `/design.md`. If a pattern exists for what you're building, use it; don't reinvent it.
- Design the full surface, not the happy path: empty states, loading states, error states, keyboard interaction, focus order. The reference-quality bar is "all the way," not 80%.
- Implement toward the brief. The primary object should be visually clear, the primary action should be easier to find than secondary actions, and unnecessary containers or decorative chrome should be removed rather than restyled.

### 4. Render and screenshot

Render the surface and capture screenshots so you can critique what actually shows up, not what you intended.
- Run `node scripts/screenshot.mjs <url> <out-dir>` using the script's path inside this skill's directory. It captures light + dark mode at desktop (1280px) and mobile (390px) widths — four shots. It handles both `prefers-color-scheme` and class-based dark mode (it sets `.dark` on `<html>` and seeds the next-themes localStorage key).
- In Codex, if the Browser plugin is available, prefer opening the surface URL in the in-app Browser for authenticated or user-visible review flows. Capture supported themes and desktop/mobile layouts when affected.
- If the project has Playwright MCP or `claude --chrome` available, you may drive the browser directly instead (useful when the surface is behind auth); cover affected supported themes and viewport layouts.
- View each screenshot before critiquing. You must actually look at the images.

### 5. Critique against the contract and quality target

Three layers are required. Write the results to `design/reviews/<surface>-<timestamp>.md`.

**Mechanical layer (zero judgment, ruthless):** run `node scripts/token-lint.mjs <changed-files>` using the script's path inside this skill's directory. Any arbitrary value, off-scale spacing, or raw color outside token definition files is an automatic fail. CSS custom-property definitions and `var(--...)` references pass. If a legitimate project pattern conflicts with this check, report it rather than weakening the contract to pass.

**Taste layer (vision rubric):** score each screenshot against the checklist in [critique rubric](critique-rubric.md), the surface brief, `/design.md`, and the reference slice if one exists. Each check gets pass/fail + a one-line reason. The default rubric covers hierarchy, spacing rhythm, alignment, state coverage, dark-mode parity, necessary chrome, mobile composition, and fidelity to the reference. `/design.md` may add checks — honor those too.

**Design critique layer (quality ceiling):** follow [surface quality](surface-quality.md) and answer: strongest part, weakest part, what feels generic, what is visually noisy, weakest hierarchy decision, what should be removed, what should be made more precise, and one bold improvement.

### 6. Fix, revise, or pass

- If anything failed: fix it and return to step 4. Re-render, re-screenshot, re-critique. Loop until clean.
- If the surface is mechanically clean but the design critique names unresolved genericness, noise, or weak hierarchy: make one bold structural revision from [surface quality](surface-quality.md), then return to step 4. Tiny color, radius, or shadow tweaks do not count as the bold revision unless the brief specifically made that the quality target.
- If the first pass already matches the quality target, the review must say why before skipping the bold revision.
- The ratchet rule: you may NEVER relax `/design.md` to make a surface pass. If a rule genuinely seems wrong, leave the surface failing and flag the conflict for the human gate. Quietly eroding constraints is the failure mode this whole system exists to prevent.

### 7. Promote and prune

Before declaring the surface done, make the contract absorb what this iteration learned:
- Did I build anything that already exists elsewhere in near-identical form, or that another surface will obviously need? If reuse is demonstrated within the authorized scope, extract it and record the pattern. Propose broader migrations separately.
- The inverse, too: if a token or pattern has gone unused across several surfaces, propose deleting it at the gate. The design contract stays a living thing rather than a museum.
- This is the step that makes the system compound. Without it you get N nice screens; with it the design contract gets stronger every iteration.

### 8. Record verification and continue

Write the brief, screenshot evidence, critique, fixes, and any unresolved issues to the surface review. Mark `done` when verified and no requested human checkpoint remains; use `needs-review` when a user verdict is required. Never present agent verification as human approval.

If more surfaces are authorized, continue to the next one. Stop for a requested checkpoint, a material unresolved contract choice, unavailable verification, or completion of the authorized scope. Keep the final preview easy to find using an available browser capability.

Record actual user verdicts verbatim in `design/DECISIONS.md`; keep agent findings in reviews. Propose general contract changes rather than silently weakening requirements. Reopen a surface if feedback requires fixes.
