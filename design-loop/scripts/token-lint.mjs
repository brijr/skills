// Mechanical layer of the critique: fail on anything that bypasses the token system.
// Usage: node scripts/token-lint.mjs <file> [<file> ...]
// Exit 0 = clean, exit 1 = violations found.
//
// This is deliberately ruthless and judgment-free. It does not know what looks
// good — it only knows what bypassed the constraint system. The taste layer
// (vision rubric) handles "good". This handles "compliant".

import { readFileSync } from "node:fs";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: node scripts/token-lint.mjs <file> [<file> ...]");
  process.exit(1);
}

// Rules. Each: { id, test(line) -> bool (true = violation), why }
const RULES = [
  {
    id: "arbitrary-tailwind",
    // p-[13px], text-[#333], gap-[7px], w-[342px], etc.
    // Token-backed references are fine: w-[var(--sidebar-width)], bg-[--brand]
    re: /\b(?:[mwhpgxy]|min|max|inset|top|left|right|bottom|gap|space|text|leading|tracking|rounded|shadow|border|translate|scale|rotate|bg|fill|stroke|grid-cols|grid-rows|basis)[a-z-]*-\[(?!var\(--|--)[^\]]+\]/,
    why: "arbitrary Tailwind value bypasses the scale — use a token-backed utility",
  },
  {
    id: "raw-hex-color",
    // #fff, #ffffff, #ffffffff outside token definition files
    re: /#[0-9a-fA-F]{3,8}\b/,
    why: "raw hex color — reference a color token instead",
  },
  {
    id: "raw-color-fn",
    re: /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lch|lab)\(\s*[\d.]/,
    why: "raw color function — reference a color token instead",
  },
  {
    id: "inline-px",
    // style={{ padding: '13px' }} / style="margin: 11px" — off-scale inline pixels
    re: /style\s*=\s*[{"][^}]*?\b\d+px\b/,
    why: "inline px in a style attribute — move to a token-backed class",
  },
  {
    id: "off-scale-arbitrary-rem",
    // arbitrary rem in brackets: text-[1.1rem]
    re: /\[[\d.]+rem\]/,
    why: "arbitrary rem value — use the type/space scale",
  },
];

// Allow an explicit escape hatch when something is genuinely unavoidable,
// so the lint never tempts anyone to silently relax a real rule:
//   // token-lint-disable-next-line <rule-id> -- <reason>
const DISABLE = /token-lint-disable-next-line\s+(\S+)/;

let violations = 0;

for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    console.error(`skip (unreadable): ${file}`);
    continue;
  }
  // token definition files are allowed to hold raw values
  if (
    file.endsWith("/design.md") ||
    file === "design.md" ||
    file.endsWith("/design.dark.md") ||
    file === "design.dark.md" ||
    file.endsWith("tokens.css")
  ) {
    continue;
  }

  const lines = text.split("\n");
  let disabledNext = null;

  lines.forEach((line, i) => {
    const dm = line.match(DISABLE);
    if (dm) {
      disabledNext = dm[1];
      return;
    }
    const skip = disabledNext;
    disabledNext = null;

    // CSS custom-property definitions ARE token definitions (Tailwind v4
    // @theme blocks, :root ramps) — raw values are allowed where tokens are born
    if (/^\s*--[\w-]+\s*:/.test(line)) return;

    for (const rule of RULES) {
      if (skip === rule.id) continue;
      if (rule.re.test(line)) {
        violations++;
        console.log(
          `${file}:${i + 1}  [${rule.id}]  ${rule.why}\n    ${line.trim()}`
        );
      }
    }
  });
}

if (violations > 0) {
  console.log(`\n${violations} token violation(s). Surface fails the mechanical gate.`);
  process.exit(1);
}
console.log("token lint: clean");
