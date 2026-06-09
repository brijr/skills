// Capture four screenshots of a URL: light/dark × desktop/mobile.
// Usage: node scripts/screenshot.mjs <url> <out-dir>
// Requires: npm i -D playwright  (and `npx playwright install chromium` once)

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [, , url, outDir = "design/reviews/shots"] = process.argv;

if (!url) {
  console.error("usage: node scripts/screenshot.mjs <url> <out-dir>");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const matrix = [
  { name: "desktop-light", width: 1280, scheme: "light" },
  { name: "desktop-dark", width: 1280, scheme: "dark" },
  { name: "mobile-light", width: 390, scheme: "light" },
  { name: "mobile-dark", width: 390, scheme: "dark" },
];

const browser = await chromium.launch();
try {
  for (const { name, width, scheme } of matrix) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: scheme,
      deviceScaleFactor: 2,
    });
    // next-themes and friends read a persisted theme before first paint
    await ctx.addInitScript((s) => {
      try {
        localStorage.setItem("theme", s);
      } catch {}
    }, scheme);
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    // class-based dark mode (Tailwind `dark:` via .dark on <html>) ignores
    // prefers-color-scheme — set it explicitly so dark shots are actually dark
    await page.evaluate((s) => {
      document.documentElement.classList.toggle("dark", s === "dark");
      document.documentElement.style.colorScheme = s;
    }, scheme);
    // settle: webfonts, lazy images, layout shift
    await page.waitForTimeout(400);
    const out = join(outDir, `${name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`captured ${out}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
