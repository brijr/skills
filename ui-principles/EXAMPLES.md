# Examples

Before/after patterns, one per principle cluster ([PRINCIPLES.md](PRINCIPLES.md)). This skill is principles-only, so the class names below are **illustrative, not a prescribed scale** — the point is the *move*, not the exact value. Bind to whatever tokens the project already defines; if it has none, pick one minimal set and apply it consistently.

---

## 1. The spine — one column, shared axis

Sections drifting to different widths break coherence. Put every section in the same container.

```
Before — each section sets its own width
section A: max-w-5xl mx-auto px-6
section B: max-w-3xl mx-auto px-8
section C: w-full px-4

After — one shared shell, applied identically (pick the project's container width)
.section: max-w-CONTAINER mx-auto px-PAD   (every section, no exceptions)
```

If one block genuinely needs to be narrower (a reading column), narrow a child container inside the shared shell — keep the outer axis intact.

---

## 2. Symmetric padding

```
Before — asymmetric, reads "off" for no obvious reason
class="pt-8 pb-4 pl-6 pr-10"

After — top equals bottom, left equals right (any value, applied symmetrically)
class="py-8 px-6"
```

When a layout feels wrong and nothing is obviously broken, audit padding pairs first.

---

## 6, 7 & 8. Hierarchy as a contrast stack — space → color → weight → size

Two failure modes, not one. Shouting (every cue dialed up) and a flat gray wall (one size, everything left to muting) are both broken. Build hierarchy by reaching for the cheapest contrast first and stopping the moment the level reads.

```
Too loud — four sizes, bold + caps + color all at once
h1:    text-3xl font-bold
label: text-xs font-semibold uppercase text-blue-500
meta:  text-[11px] font-bold

Too flat — one size, hierarchy left entirely to muting; nothing leads
h1:    text-BODY font-medium
label: text-BODY text-muted-foreground
meta:  text-BODY text-muted-foreground

Right — two sizes, one cue per level, escalating only as far as it takes
h1:    text-STATEMENT font-medium tracking-tight   (size  — the page's statement earns the larger step)
label: text-BODY font-medium                       (weight — separates it from body at the same size)
meta:  text-BODY text-muted-foreground             (color — demoted by tier, not shrunk)
date:  text-BODY text-muted-foreground tabular-nums
```

The statement (h1) takes the larger size because it earns it; everything below sits at body size, separated by weight, then color. No element carries more than one emphasis cue. Reach *down* the stack — space, then color, then weight — before you reach for size, and reserve size for the statement.

---

## 9. Mixed case, tight tracking — no generic caps

```
Before
class="uppercase tracking-widest text-xs"   /* SECTION LABEL */

After
class="tracking-tight"                       /* Section label */
```

---

## 4 & 15. Repeated rhythm + smallest-move motion

Pick one section gap, one heading gap, one radius — name them once, reuse everywhere. (Values are the project's to choose; the discipline is reuse.)

```css
:root {
  --gap-section: VALUE;   /* between every section */
  --gap-heading: VALUE;   /* below every heading */
  --radius:      VALUE;   /* every corner */
}
```

Hover is a color/background shift only:

```
Good — transition affects color/background only
class="rounded-[--radius] transition-colors hover:bg-muted"

Avoid — opacity / transform / scale / shadow on hover
class="transition-all hover:opacity-80 hover:scale-105 hover:shadow-lg"
```

---

## 13. Honest interactive states

A clickable element must look clickable; a non-link must not pretend.

```
Before — looks like a link, goes nowhere
class="text-blue-600 underline cursor-pointer"   (no href, no handler)

After — either wire it or make it plain text
- real link:  an anchor with a real href, styled as a link
- not a link: plain text, default cursor, no underline, no link color
```

---

## 14. Cards are a device, not a default container

```
Before — a card wrapping content that needs no containment
a Card around a heading + description + list

After — open composition; spacing and type create the grouping
a plain container: heading, muted description, then the list, separated by the section gap
```

Reach for a card only when the content is discrete, repeatable, or clickable — a surface that needs containment.

---

## 16. Designed states — every action has an "after"

A list/table/query view needs more than the happy path. Sketch all of them up front:

- **Empty** — a deliberate message and, if relevant, one clear next action. Not a blank area.
- **Loading** — reserve the final layout's space (skeleton at the real dimensions) so nothing jumps.
- **Error** — what failed, in plain language, plus a way to retry.
- **Success** — the visible confirmation after a create/save/delete.
- **Overflow** — long names, many rows, tiny screens: truncate or wrap on purpose.

---

## 17. No layout shift

Reserve space before content arrives.

```
Before — image has no dimensions; page jumps when it loads
an img with only a src

After — width/height (or aspect-ratio) reserved up front
class="aspect-video w-full"   + width/height attributes on the element
```

Load fonts with a size-adjusted fallback so swapping the webfont doesn't reflow text.
