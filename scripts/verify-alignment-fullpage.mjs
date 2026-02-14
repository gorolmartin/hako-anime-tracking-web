#!/usr/bin/env node
/** Verify alignment with full-page screenshots. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/alignment-fullpage";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log("Navigating to http://localhost:3000...");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  fs.mkdirSync(OUT, { recursive: true });

  console.log("Finding features section...");
  const { sectionTop, range } = await page.evaluate(() => {
    const s = document.querySelector('section[style*="500vh"]');
    const top = s ? s.getBoundingClientRect().top + window.scrollY : 800;
    const vh = window.innerHeight;
    return { sectionTop: top, range: vh * 4 };
  });

  // Screen 1 - Login
  console.log("\nScreen 1 (Welcome/Login)...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, "01-screen1-login-full.png"), fullPage: true });

  // Screen 2 - Home
  console.log("Screen 2 (Home)...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.3);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, "02-screen2-home-full.png"), fullPage: true });

  // Screen 3 - Drawer
  console.log("Screen 3 (Drawer)...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.5);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, "03-screen3-drawer-full.png"), fullPage: true });

  // Screen 4 - Airing
  console.log("Screen 4 (Airing)...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.7);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, "04-screen4-airing-full.png"), fullPage: true });

  // Screen 5 - Explore
  console.log("Screen 5 (Explore)...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.85);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, "05-screen5-explore-full.png"), fullPage: true });

  await browser.close();
  console.log("\n✓ Full-page screenshots saved to:", OUT);
}

main().catch(console.error);
