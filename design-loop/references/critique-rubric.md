# Critique rubric (taste layer)

Score each of the four screenshots (light/dark × desktop/mobile) against these checks. Each check is pass/fail with a one-line reason. This is the layer the token-lint can't do — it requires actually looking at the rendered surface and comparing it to the surface brief and `/design.md`.

This is the default rubric. `/design.md` may add project-specific checks such as density philosophy, brand specifics, motion rules, voice rules, or reference-product fidelity. Apply those too. When the project contract and this default conflict, the project contract wins.

## The 15 default checks

1. **Hierarchy** — Can you tell the most important element on the screen at a glance? Is there one clear focal point per region, not three competing ones?
2. **Type scale** — Every text size maps to a token in `/design.md`. No one-off sizes. Heading, body, label, and caption relationships are visually distinct.
3. **Spacing rhythm** — Gaps follow the spacing scale and feel consistent. Related things are close, unrelated things are apart. No "almost aligned" gaps.
4. **Alignment** — Elements share edges and baselines. Nothing is off by a few pixels. Optical alignment where mathematical alignment looks wrong, such as icons next to text.
5. **Density fit** — The information density matches the surface's job. A data-heavy table is tight; a marketing hero breathes. Wrong density is the most common "technically on-scale but visually wrong" failure.
6. **Color discipline** — Color carries meaning, not decoration. Neutral surfaces dominate unless the contract says otherwise. Accent color is rationed.
7. **Empty state** — Designed, not blank. Tells the user what goes here and how to start.
8. **Loading state** — Designed. Skeleton or spinner matches the eventual layout, with no content-shift jank implied.
9. **Error / edge state** — Long strings, zero items, huge numbers, overflow — all handled visibly, not clipped or broken.
10. **Dark-mode parity** — Dark screenshots are as considered as light ones. No invisible text, no pure-black voids, no inverted-but-wrong contrast. Every element is readable.
11. **Interaction affordance** — Interactive elements look interactive; focus states are visible; hit targets are adequate, especially at mobile width.
12. **Reading path** — The eye moves through the surface in the intended order from the brief. The primary object and primary action are obvious before secondary metadata.
13. **Necessary chrome** — Every card, panel, divider, border, icon, badge, and background earns its place. No decorative containers, nested cards, or generic dashboard filler.
14. **Mobile composition** — Mobile is designed, not merely collapsed. The order, density, controls, and empty/loading/error states still match the user job at 390px.
15. **Reference fidelity** — The screenshots credibly match the surface brief, approved reference slice, named reference products, and `/design.md`. Same restraint, same conventions, same level of finish.

## Design critique layer

After scoring the checks, add a design critique. This is where the loop catches surfaces that are technically compliant but still bland.

Answer every prompt:

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

If the critique names unresolved genericness, noise, or a weak hierarchy decision, the surface cannot pass yet. Make one bold revision, re-screenshot, and re-score.

## Output format

Write to `design/reviews/<surface>-<timestamp>.md`:

```md
# Critique: <surface> @ <timestamp>

## Mechanical (token-lint)
clean | N violations [paste lint output if any]

## Taste (15/15)
1. Hierarchy — PASS
2. Type scale — PASS
...
7. Empty state — FAIL: integrations list renders nothing when empty; needs an empty state
...

## Design Critique
Strongest part: clear form grouping and restrained action placement.
Weakest part: nested panels make a simple settings screen feel heavier than the brief.
What feels generic: dashboard-style cards around every section.
What is visually noisy: repeated borders and status badges competing with field labels.
Weakest hierarchy decision: workspace name is treated like metadata instead of the anchor.
What should be removed: outer cards around single-purpose sections.
What should be made more precise: primary save action and destructive account action.
One bold improvement: remove nested panels and rebuild the page around one left alignment spine.

## Verdict
<pass | needs-fix>
Fixes queued: <list>
Rule conflicts flagged for human gate: <list or none>
```

A surface only advances to the human gate when the mechanical layer is clean AND every taste check passes, or a failing check has been explicitly waived in `design/DECISIONS.md`.
