#!/usr/bin/env node
/** Re-verify: (1) Segment 2 drawer slides up; (2) Segment 4 Explore popular top + search bottom. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/showcase-screenshots";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  fs.mkdirSync(OUT, { recursive: true });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Scroll to bring section into view first
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);

  const { vh, sectionTop, docHeight } = await page.evaluate(() => {
    const sections = document.querySelectorAll("section");
    const showcase = Array.from(sections).find((s) => s.querySelector('img[alt="Login with AniList"]')) || sections[1] || sections[0];
    const top = showcase ? showcase.getBoundingClientRect().top + window.scrollY : 900;
    return { vh: window.innerHeight, sectionTop: top, docHeight: document.documentElement.scrollHeight };
  });
  const showcaseRange = Math.min(vh * 8, docHeight - sectionTop - vh);
  const drawerY = sectionTop + showcaseRange * 0.40;
  const drawerScrolls = [drawerY - vh * 0.5, drawerY, drawerY + vh * 0.5];
  console.log("scroll params:", { vh, sectionTop, docHeight, showcaseRange, drawerY });
  const phone = page.locator('section:has(img[alt="Login with AniList"]) >> div.overflow-hidden.shadow-xl').first();

  // (1) Segment 2 – drawer slides up. Scroll gradually through 0 → 0.2 → 0.4 to trigger transitions.
  let drawerFound = false;
  const steps = [0.15, 0.25, 0.35, 0.40, 0.42, 0.45];
  for (const p of steps) {
    const y = sectionTop + showcaseRange * p;
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(1000);
    const { h2, alts } = await page.evaluate(() => {
      const h2 = document.querySelector("h2")?.textContent?.trim() || "";
      const alts = Array.from(document.querySelectorAll("img")).map((i) => i.alt).filter(Boolean);
      return { h2, alts };
    });
    drawerFound = alts.some((a) => /action|drawer/i.test(a));
    if (drawerFound) break;
  }
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + showcaseRange * 0.40);
  await page.waitForTimeout(2500);
  await phone.screenshot({ path: path.join(OUT, "02-drawer.png") }).catch(() => page.screenshot({ path: path.join(OUT, "02-drawer.png") }));

  // (2) Segment 4 – Explore: popular top, search bottom.
  const exploreY = sectionTop + showcaseRange * 0.82;
  await page.evaluate((yy) => window.scrollTo(0, yy), exploreY);
  await page.waitForTimeout(2500);
  const { hasPopular, hasSearch, hasTrending, h2: exploreH2 } = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    const alts = imgs.map((i) => i.alt);
    return {
      hasPopular: alts.includes("Explore popular"),
      hasSearch: alts.includes("Explore search"),
      hasTrending: alts.includes("Explore trending"),
      h2: document.querySelector("h2")?.textContent?.trim()?.slice(0, 40) || "",
    };
  });
  console.log("  explore h2=" + exploreH2, "popular=" + hasPopular, "search=" + hasSearch);
  await phone.screenshot({ path: path.join(OUT, "04-explore.png") }).catch(() => page.screenshot({ path: path.join(OUT, "04-explore.png") }));

  await browser.close();

  const explorePass = hasPopular && hasSearch;
  console.log("--- Verification ---");
  console.log("(1) Segment 2 Drawer slides up:", drawerFound ? "PASS" : "FAIL", drawerFound ? "- overlay visible" : "- drawer overlay not detected in DOM");
  console.log("(2) Segment 4 Explore:", explorePass ? "PASS" : "PARTIAL/FAIL", `- popular:${hasPopular} search:${hasSearch} trending:${hasTrending}`);
  console.log("Screenshots: 02-drawer.png, 04-explore.png");
}

main().catch(console.error);
