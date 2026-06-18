# Surface quality layer

This layer raises the ceiling of the loop. Tokens and screenshot checks keep a surface from being sloppy; the quality layer keeps it from being merely compliant. Run it on every surface before implementation and again after the first screenshot critique.

## 1. Write the surface brief before code

Before touching implementation files, write a short brief. Keep it specific to the current surface and grounded in `/design.md`, optional `/design.dark.md`, `design/DECISIONS.md`, and any approved reference slice.

Write the brief to `design/briefs/<surface>-<timestamp>.md`:

```md
# Design Brief: <surface> @ <timestamp>

## User Job
<what the user is trying to accomplish on this surface>

## Primary Object
<the main thing being inspected, edited, selected, bought, configured, or monitored>

## Primary Action
<the action the screen should make easiest>

## Information Hierarchy
1. <first thing the eye should understand>
2. <second>
3. <third>

## Density Target
<tight / moderate / spacious, with the reason>

## Reference Feeling
Feels closer to:
- <product or screen> — <specific quality to borrow>
- <product or screen> — <specific quality to borrow>

Does not feel like:
- <anti-reference> — <quality to avoid>

## Remove / Quiet / Sharpen
- Remove: <visible elements, containers, copy, or states that do not earn their place>
- Quiet: <secondary UI that should recede>
- Sharpen: <primary data, action, or hierarchy that should become more precise>

## Non-Negotiables From The Contract
- <constraints from /design.md, /design.dark.md, the decision log, or the approved reference slice>
```

If the brief cannot name the user job, primary object, and primary action, stop and inspect the product more. A surface without a job will drift into decorative UI.

## 2. Calibrate references

Pick 1-3 reference products, screens, or approved in-repo surfaces. References set the quality target; they are not assets to copy.

Good reference notes are concrete:
- "Closer to Stripe settings for hierarchy, restrained borders, and predictable form grouping."
- "Closer to Linear issue lists for density, keyboard-first scanning, and quiet metadata."
- "Not generic SaaS dashboard: no decorative metric cards, no loud gradients, no empty chrome."

Avoid vague references:
- "Make it premium."
- "Apple-like."
- "Modern dashboard."

If the repo already has an approved reference slice, it wins over outside references. If a user-provided reference conflicts with `/design.md` or `design/DECISIONS.md`, stop and flag the conflict instead of quietly choosing one.

## 3. Implement toward the target

During implementation, keep asking:
- Does this screen have one dominant reading path?
- Does the primary object get the most visual clarity?
- Is the primary action easier to find than every secondary action?
- Did I remove enough, or did I just restyle existing clutter?
- Would the screenshot look credible beside the references named in the brief?

Prefer structural improvements over cosmetic ones. Removing a redundant container, tightening a data table, or making a hierarchy obvious usually improves quality more than changing color, radius, or shadow.

## 4. Run a post-screenshot design critique

After the first screenshot pass and mechanical lint, write this critique into the review artifact before deciding whether the surface can go to the human gate:

```md
## Design Critique
Strongest part:
Weakest part:
What feels generic:
What is visually noisy:
Weakest hierarchy decision:
What should be removed:
What should be made more precise:
One bold improvement:
```

The bold improvement must change the structure, hierarchy, density, copy, or interaction model in a visible way. It cannot be a tiny color, radius, or shadow tweak unless the brief specifically made that the quality target.

## 5. Make one bold revision

Make the bold improvement, then re-render and re-screenshot. This is required even when the token lint is clean and the rubric appears to pass, unless the critique explicitly says the first pass already matches the quality target and names why.

Common bold improvements:
- Collapse repeated cards into a denser list or table.
- Remove a secondary panel and move its two useful fields inline.
- Promote the primary object from a header label into the visual anchor of the page.
- Replace decorative status color with a quieter semantic treatment.
- Rewrite vague empty-state copy around the user's next action.
- Turn a mobile stack from a collapsed desktop layout into a designed mobile order.

Do not make multiple speculative redesigns in one loop. One strong revision, then screenshot and critique again.

## 6. Gate on quality, not compliance

A surface can reach the human gate only when:
- mechanical token lint is clean,
- the default and project-specific rubric passes,
- the design critique does not identify unresolved genericness, noise, or hierarchy problems,
- the final screenshots credibly match the brief and reference target.

If the surface is compliant but bland, keep it `in-progress`. "Technically clean" is not a design verdict.
