#!/usr/bin/env node
/** Manual-style verification: navigate, scroll through features, capture each segment. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/manual-verification";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log("1. Navigating to http://localhost:3000...");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  fs.mkdirSync(OUT, { recursive: true });

  console.log("2. Taking initial screenshot...");
  await page.screenshot({ path: path.join(OUT, "01-initial.png") });

  console.log("3. Scrolling down to features section...");
  const { sectionTop, range } = await page.evaluate(() => {
    const s = document.querySelector('section[style*="500vh"]');
    const top = s ? s.getBoundingClientRect().top + window.scrollY : 800;
    const vh = window.innerHeight;
    return { sectionTop: top, range: vh * 4 };
  });
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop);
  await page.waitForTimeout(800);

  console.log("4. Screenshot: Screen 1 (Welcome - Login)...");
  await page.screenshot({ path: path.join(OUT, "02-screen1-welcome.png") });

  console.log("5. Scrolling to Screen 2 (Home)...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.3);
  await page.waitForTimeout(800);

  console.log("6. Screenshot: Screen 2 (Home)...");
  await page.screenshot({ path: path.join(OUT, "03-screen2-home.png") });

  console.log("7. Scrolling to Screen 3 (Drawer)...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.5);
  await page.waitForTimeout(800);

  console.log("8. Screenshot: Screen 3 (Drawer)...");
  await page.screenshot({ path: path.join(OUT, "04-screen3-drawer.png") });

  console.log("9. Scrolling to Screen 4 (Airing)...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.7);
  await page.waitForTimeout(800);

  console.log("10. Screenshot: Screen 4 (Airing)...");
  await page.screenshot({ path: path.join(OUT, "05-screen4-airing.png") });

  console.log("11. Scrolling to Screen 5 (Explore)...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.9);
  await page.waitForTimeout(800);

  console.log("12. Screenshot: Screen 5 (Explore)...");
  await page.screenshot({ path: path.join(OUT, "06-screen5-explore.png") });

  await browser.close();
  console.log("\nScreenshots saved to:", OUT);
  console.log("Analyzing...\n");
}

main().catch(console.error);
