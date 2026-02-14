#!/usr/bin/env node
/**
 * Visual verification: scroll through FeatureShowcase and capture screenshots at each segment.
 * Run: node scripts/verify-showcase-visual.mjs
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const OUT = "scripts/showcase-screenshots";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const fs = await import("fs");
  const path = await import("path");
  fs.mkdirSync(OUT, { recursive: true });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Scroll into FeatureShowcase (900vh); use scroll positions that map to segment thresholds 0, 0.2, 0.4, 0.6, 0.8
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => window.innerHeight);
  const showcaseStart = vh * 1.2; // Hero ~1.2 viewports
  const showcaseRange = vh * 8.2; // 900vh - 1vh buffer
  const segments = [
    { name: "01-welcome", y: showcaseStart },
    { name: "02-home", y: showcaseStart + showcaseRange * 0.22 },
    { name: "03-drawer", y: showcaseStart + showcaseRange * 0.42 },
    { name: "04-airing", y: showcaseStart + showcaseRange * 0.62 },
    { name: "05-explore", y: showcaseStart + showcaseRange * 0.82 },
  ];

  const phone = page.locator('div.bg-bg-surface.overflow-hidden.shadow-xl').first();
  for (const s of segments) {
    await page.evaluate((y) => window.scrollTo(0, y), s.y);
    await page.waitForTimeout(1800); // Let scroll + segment animations run
    const file = path.join(OUT, `${s.name}.png`);
    try {
      await phone.screenshot({ path: file });
    } catch {
      await page.screenshot({ path: file });
    }
  }

  await browser.close();
  console.log("Screenshots saved to", OUT);
}

main().catch(console.error);
