#!/usr/bin/env node
/** Test snap-scroll by scrolling to features section first, then testing wheel events. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/snap-scroll-final-test";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  console.log("1. Navigating to http://localhost:3000...");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  fs.mkdirSync(OUT, { recursive: true });

  console.log("\n2. Scrolling directly to features section using JavaScript...");
  await page.evaluate(() => {
    const section = document.querySelector('section[style*="500vh"]');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(2000); // Wait for smooth scroll

  // Helper to analyze screen
  const analyzeScreen = async (stepName) => {
    const info = await page.evaluate(() => {
      const section = document.querySelector('section[style*="500vh"]');
      if (!section) return { leftTag: "N/A", leftTitle: "N/A", phoneScreen: "Not found", scrollY: window.scrollY };
      
      // Get left-side label
      const leftSide = section.querySelector('div');
      const allParagraphs = Array.from(section.querySelectorAll('p'));
      const tagPara = allParagraphs.find(p => /WELCOME|HOME|QUICK ACTIONS|SCHEDULE|DISCOVER/.test(p.innerText));
      const leftTag = tagPara?.innerText.split('\n')[0] || "N/A";
      const leftTitle = section.querySelector('h2, h3')?.innerText || "N/A";
      
      // Detect phone content
      const sectionText = section.innerText.toLowerCase();
      let phoneScreen = "Unknown";
      
      if (sectionText.includes('login with anilist')) phoneScreen = "Welcome/Login";
      else if (sectionText.includes('good afternoon') && sectionText.includes('new episodes')) phoneScreen = "Home";
      else if (sectionText.includes('watching') && sectionText.includes('completed') && sectionText.includes('plan to watch')) phoneScreen = "Quick Actions (Drawer)";
      else if (sectionText.includes('airing') && sectionText.includes('winter season')) phoneScreen = "Schedule (Airing)";
      else if (sectionText.includes('popular this season') && sectionText.includes('trending now')) phoneScreen = "Discover (Explore)";
      
      return { leftTag, leftTitle, phoneScreen, scrollY: window.scrollY };
    });
    
    console.log(`\n${stepName}`);
    console.log(`  Scroll position: ${info.scrollY}px`);
    console.log(`  Left tag: "${info.leftTag}"`);
    console.log(`  Left title: "${info.leftTitle}"`);
    console.log(`  Phone screen: ${info.phoneScreen}`);
    
    return info;
  };

  console.log("\n3. Initial state after scrolling to features section:");
  await page.waitForTimeout(1000);
  let info = await analyzeScreen("STEP 3: Initial");
  await page.screenshot({ path: path.join(OUT, "01-initial-features.png"), fullPage: false });
  
  console.log("\n4. Scroll DOWN once (should snap to next screen):");
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(1500);
  info = await analyzeScreen("STEP 4: After 1st scroll");
  const expected2 = "Home";
  console.log(`  Expected: ${expected2}`);
  console.log(`  Match: ${info.phoneScreen.includes(expected2) ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "02-after-scroll-1.png"), fullPage: false });
  
  console.log("\n5. Scroll DOWN once more (should snap to Quick Actions):");
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(1500);
  info = await analyzeScreen("STEP 5: After 2nd scroll");
  const expected3 = "Quick Actions";
  console.log(`  Expected: ${expected3}`);
  console.log(`  Match: ${info.phoneScreen.includes(expected3) ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "03-after-scroll-2.png"), fullPage: false });
  
  console.log("\n6. Scroll DOWN once more (should snap to Schedule):");
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(1500);
  info = await analyzeScreen("STEP 6: After 3rd scroll");
  const expected4 = "Schedule";
  console.log(`  Expected: ${expected4}`);
  console.log(`  Match: ${info.phoneScreen.includes(expected4) ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "04-after-scroll-3.png"), fullPage: false });
  
  console.log("\n7. Scroll DOWN once more (should snap to Discover):");
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(1500);
  info = await analyzeScreen("STEP 7: After 4th scroll");
  const expected5 = "Discover";
  console.log(`  Expected: ${expected5}`);
  console.log(`  Match: ${info.phoneScreen.includes(expected5) ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "05-after-scroll-4.png"), fullPage: false });
  
  console.log("\n" + "=".repeat(70));
  console.log("TEST COMPLETE");
  console.log("=".repeat(70));
  console.log(`Screenshots saved to: ${OUT}`);
  console.log("\nReview screenshots to verify:");
  console.log("  1. Each scroll triggered a complete snap transition");
  console.log("  2. Screens appear at rest state (not mid-animation)");
  console.log("  3. Left-side text matches phone content");
  
  await page.waitForTimeout(2000);
  await browser.close();
}

main().catch(console.error);
