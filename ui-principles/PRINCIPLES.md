# Principles of UI Design

Seventeen principles for designing software interfaces. Each one is a thing the eye returns to, before color, before motion, before anything decorative. SKILL.md translates these into concrete defaults and a checklist; this file is the intent behind each rule. When a default in SKILL.md and a principle here seem to conflict, the principle wins.

---

**1. Alignment is the spine.**

Every section sits on the same vertical axis. One column width across the page. When the left and right edges of one section don't match the next, the page loses coherence. Drift on the spine is drift in attention.

**2. Padding is design, not whitespace.**

Top equals bottom. Left equals right. When a layout feels off but the cause isn't obvious, the answer is almost always padding asymmetry. Treat every spacing decision as deliberate.

**3. Content fills its parent.**

Text drifts to the edge of its column. Don't cap individual elements with their own narrow width. If something should be narrower, make its container narrower instead. Negative space inside a block reads as undecided.

**4. Rhythm comes from repetition.**

Same gap below every heading. Same gap between every section. Same radius on every corner. Same hover behavior on every interactive element. Repetition is what makes a system read as a system.

**5. Responsive is the same calm.**

The system should feel as considered at 320px as at 1920px. Breakpoints are decisions, not concessions. The page holds its rhythm at any viewport — content reflows, but the discipline doesn't change.

**6. Hierarchy is color and weight, not size.**

Two sizes is enough — one for statements, one for everything else. Everything that's not a statement earns its hierarchy from color and weight. When tempted to make something smaller, make it muted instead.

**7. Bold is too loud.**

Medium (500) is the maximum weight in the system. Anything heavier signals that the rest of the type isn't carrying its own. If hierarchy needs 700 to read, the hierarchy isn't working.

**8. Statements stay small.**

The page is read, not shouted at. Body type does most of the work. Display type is reserved for the one or two moments on the page that genuinely earn it.

**9. Mixed case, tight tracking.**

No all-caps with positive letter-spacing. That treatment reads as generic. Mixed case with slightly negative tracking is the default voice — calm, considered, conversational.

**10. Color is rare.**

A small set of neutrals does most of the work. Color is reserved for the few moments that genuinely earn it. When everything has a color, nothing reads as colored.

**11. Every block earns its place.**

Sections that read as afterthoughts break the work. A footer with just nav and copyright. A placeholder shape pretending to be a mark. Default form chrome. Either design it deliberately or leave it off.

**12. Reading order is intentional.**

Where the eye starts and where it goes is a design choice. Don't compete for attention; sequence it. Scan order is hierarchy made visible.

**13. Be honest.**

What you see is what you get. Interactive elements look interactive; static text doesn't tease clickability. A button looks like a button. A link looks like a link. A link that doesn't link is a lie — wire it up or omit it.

**14. Cards are a device, not a container.**

A card holds discrete, repeatable, often clickable content. When everything is a card, nothing is. Most blocks should live in the column with no wrapper — the card stays a meaningful device, not a default container.

**15. Motion is the smallest move.**

Hover states are color or background shifts. Never opacity, transforms, shadows, or scale changes. Restraint extends to motion — anything beyond a quiet color or background shift is overdesign.

**16. States are designed.**

A page with no content is still a designed page. Empty, loading, error, success, and overflow states are not afterthoughts — they're part of the work. Every action has a corresponding "after." The state the user sees when something fails — or succeeds — reveals the care taken.

**17. Performance is design.**

Slow is broken. Layout shift is broken. A page that jumps as fonts and images load is not finished. How the work feels is inseparable from how fast it feels.

---

The aesthetic is calm confidence. Good software, like good furniture, should last and stay out of the way. If a piece of UI feels like it's trying to impress, it has already failed.
