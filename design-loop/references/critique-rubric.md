# Critique rubric (taste layer)

Score each of the four screenshots (light/dark × desktop/mobile) against these checks. Each check is pass/fail with a one-line reason. This is the layer the token-lint can't do — it requires actually looking at the rendered surface.

This is the *default* rubric. The project's `UI_RULES.md` may add project-specific checks (density philosophy, brand specifics, motion rules). Apply those too. When the project rubric and this default conflict, the project wins.

## The 12 default checks

1. **Hierarchy** — Can you tell the most important element on the screen at a glance? Is there one clear focal point per region, not three competing ones?
2. **Type scale** — Every text size maps to a step in the scale. No one-off sizes. Heading→body→caption relationships are visually distinct.
3. **Spacing rhythm** — Gaps follow the spacing scale and feel consistent. Related things are close, unrelated things are apart. No "almost aligned" gaps.
4. **Alignment** — Elements share edges and baselines. Nothing is off by a few pixels. Optical alignment where mathematical alignment looks wrong (e.g. icons next to text).
5. **Density fit** — The information density matches the surface's job. A data-heavy table is tight; a marketing hero breathes. Wrong density is the most common "technically on-scale but visually wrong" failure.
6. **Color discipline** — Color carries meaning, not decoration. Neutral surfaces dominate; accent color is rationed. No color used just because it was available.
7. **Empty state** — Designed, not blank. Tells the user what goes here and how to start.
8. **Loading state** — Designed. Skeleton or spinner that matches the eventual layout, no content-shift jank implied.
9. **Error / edge state** — Long strings, zero items, huge numbers, overflow — all handled visibly, not clipped or broken.
10. **Dark-mode parity** — The dark screenshots are as considered as the light ones. No invisible text, no pure-black voids, no inverted-but-wrong contrast. Every element readable.
11. **Interaction affordance** — Interactive elements look interactive; focus states are visible; hit targets are adequate (especially at mobile width).
12. **Reference fidelity** — If a reference slice exists, does this surface feel like it belongs in the same product? Same restraint, same conventions, same level of finish.

## Output format

Write to `design/reviews/<surface>-<timestamp>.md`:

```
# Critique: <surface> @ <timestamp>

## Mechanical (token-lint)
clean | N violations [paste lint output if any]

## Taste (12/12)
1. Hierarchy — PASS
2. Type scale — PASS
...
7. Empty state — FAIL: integrations list renders nothing when empty; needs an empty state
...

## Verdict
<pass | needs-fix>
Fixes queued: <list>
Rule conflicts flagged for human gate: <list or none>
```

A surface only advances to the human gate when the mechanical layer is clean AND every taste check passes (or a failing check has been explicitly waived in `DECISIONS.md`).
