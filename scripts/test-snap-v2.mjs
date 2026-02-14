#!/usr/bin/env node
/** Test snap-scroll with better initial positioning. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/snap-scroll-test-v2";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log("Navigating to http://localhost:3000...");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  fs.mkdirSync(OUT, { recursive: true });

  // Get features section position
  const sectionInfo = await page.evaluate(() => {
    const s = document.querySelector('section[style*="500vh"]');
    if (!s) return null;
    const rect = s.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      height: rect.height,
      viewportHeight: window.innerHeight
    };
  });

  if (!sectionInfo) {
    console.log("❌ Features section not found!");
    await browser.close();
    return;
  }

  console.log(`Features section: top=${sectionInfo.top}px, height=${sectionInfo.height}px`);
  console.log(`Viewport height: ${sectionInfo.viewportHeight}px\n`);

  // Scroll directly to the features section start
  console.log("Scrolling to features section start...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionInfo.top);
  await page.waitForTimeout(2000);

  // Helper to get current state
  const getState = async () => {
    return await page.evaluate(() => {
      const scrollY = window.scrollY;
      const section = document.querySelector('section[style*="500vh"]');
      if (!section) return { scrollY, tag: "N/A", screen: "N/A" };
      
      // Get visible text
      const tagEl = Array.from(section.querySelectorAll('p, h2, h3'))
        .find(el => el.innerText.match(/WELCOME|HOME|QUICK ACTIONS|SCHEDULE|DISCOVER/));
      const tag = tagEl?.innerText.split('\n')[0] || "N/A";
      
      // Try to identify screen
      const allText = section.innerText.toLowerCase();
      let screen = "Unknown";
      if (allText.includes('login with anilist')) screen = "Login";
      else if (allText.includes('good afternoon')) screen = "Home";
      else if (allText.includes('watching') && allText.includes('completed')) screen = "Drawer";
      else if (allText.includes('winter season 202')) screen = "Airing";
      else if (allText.includes('popular this season')) screen = "Explore";
      
      return { scrollY, tag, screen };
    });
  };

  console.log("=== INITIAL STATE ===");
  let state = await getState();
  console.log(`Scroll: ${state.scrollY}px, Tag: ${state.tag}, Screen: ${state.screen}`);
  await page.screenshot({ path: path.join(OUT, "01-initial.png"), fullPage: false });

  // Now test scroll wheel events
  const tests = [
    { name: "Scroll DOWN #1 → Home", file: "02-home.png" },
    { name: "Scroll DOWN #2 → Drawer", file: "03-drawer.png" },
    { name: "Scroll DOWN #3 → Airing", file: "04-airing.png" },
    { name: "Scroll DOWN #4 → Explore", file: "05-explore.png" },
    { name: "Scroll DOWN #5 → Past section", file: "06-past-section.png" }
  ];

  for (let i = 0; i < tests.length; i++) {
    console.log(`\n=== ${tests[i].name} ===`);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(2000); // Wait for snap animation
    
    state = await getState();
    console.log(`Scroll: ${state.scrollY}px, Tag: ${state.tag}, Screen: ${state.screen}`);
    await page.screenshot({ path: path.join(OUT, tests[i].file), fullPage: false });
  }

  // Test scrolling UP
  console.log("\n=== Scroll UP #1 → Back to Airing ===");
  await page.mouse.wheel(0, -200);
  await page.waitForTimeout(2000);
  
  state = await getState();
  console.log(`Scroll: ${state.scrollY}px, Tag: ${state.tag}, Screen: ${state.screen}`);
  await page.screenshot({ path: path.join(OUT, "07-up-to-airing.png"), fullPage: false });

  console.log("\n=== Scroll UP #2 → Back to Drawer ===");
  await page.mouse.wheel(0, -200);
  await page.waitForTimeout(2000);
  
  state = await getState();
  console.log(`Scroll: ${state.scrollY}px, Tag: ${state.tag}, Screen: ${state.screen}`);
  await page.screenshot({ path: path.join(OUT, "08-up-to-drawer.png"), fullPage: false });

  console.log("\n✓ Test complete. Screenshots saved to:", OUT);
  
  await page.waitForTimeout(2000); // Keep browser open briefly
  await browser.close();
}

main().catch(console.error);
