#!/usr/bin/env node
/** Verify Screen 5 (Explore) by scrolling to 85-100% of the features section. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/explore-verification";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log("Navigating to http://localhost:3000...");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  fs.mkdirSync(OUT, { recursive: true });

  console.log("Finding features section...");
  const { sectionTop, sectionHeight } = await page.evaluate(() => {
    const s = document.querySelector('section[style*="500vh"]');
    if (!s) return { sectionTop: 0, sectionHeight: 0 };
    const rect = s.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    return { sectionTop: top, sectionHeight: rect.height };
  });

  console.log(`Section top: ${sectionTop}, height: ${sectionHeight}`);

  // Scroll to 85% of the section
  console.log("Scrolling to 85% of features section...");
  const scroll85 = sectionTop + (sectionHeight * 0.85);
  await page.evaluate((y) => window.scrollTo(0, y), scroll85);
  await page.waitForTimeout(1000);

  console.log("Screenshot at 85%...");
  await page.screenshot({ path: path.join(OUT, "01-explore-85percent.png"), fullPage: false });

  // Check what's visible on the phone
  const content85 = await page.evaluate(() => {
    const phone = document.querySelector('div[style*="aspectRatio"]');
    if (!phone) return "Phone not found";
    return phone.innerText.substring(0, 200);
  });
  console.log("Phone content at 85%:", content85);

  // Scroll to 95%
  console.log("\nScrolling to 95% of features section...");
  const scroll95 = sectionTop + (sectionHeight * 0.95);
  await page.evaluate((y) => window.scrollTo(0, y), scroll95);
  await page.waitForTimeout(1000);

  console.log("Screenshot at 95%...");
  await page.screenshot({ path: path.join(OUT, "02-explore-95percent.png"), fullPage: false });

  const content95 = await page.evaluate(() => {
    const phone = document.querySelector('div[style*="aspectRatio"]');
    if (!phone) return "Phone not found";
    return phone.innerText.substring(0, 200);
  });
  console.log("Phone content at 95%:", content95);

  // Scroll to 100% (end of section)
  console.log("\nScrolling to 100% (end of features section)...");
  const scroll100 = sectionTop + sectionHeight - 100;
  await page.evaluate((y) => window.scrollTo(0, y), scroll100);
  await page.waitForTimeout(1000);

  console.log("Screenshot at 100%...");
  await page.screenshot({ path: path.join(OUT, "03-explore-100percent.png"), fullPage: false });

  const content100 = await page.evaluate(() => {
    const phone = document.querySelector('div[style*="aspectRatio"]');
    if (!phone) return "Phone not found";
    return phone.innerText.substring(0, 200);
  });
  console.log("Phone content at 100%:", content100);

  // Check for expected Explore screen elements
  console.log("\nChecking for Explore screen elements...");
  const exploreElements = await page.evaluate(() => {
    const phone = document.querySelector('div[style*="aspectRatio"]');
    if (!phone) return {};
    
    const text = phone.innerText.toLowerCase();
    return {
      hasPopular: text.includes("popular"),
      hasTrending: text.includes("trending"),
      hasUpcoming: text.includes("upcoming"),
      hasSearch: !!phone.querySelector('input[type="text"]') || text.includes("search"),
      fullText: phone.innerText
    };
  });

  console.log("\nExplore screen elements found:");
  console.log("- Popular section:", exploreElements.hasPopular ? "YES" : "NO");
  console.log("- Trending section:", exploreElements.hasTrending ? "YES" : "NO");
  console.log("- Upcoming section:", exploreElements.hasUpcoming ? "YES" : "NO");
  console.log("- Search bar:", exploreElements.hasSearch ? "YES" : "NO");
  console.log("\nFull phone text:");
  console.log(exploreElements.fullText);

  await browser.close();
  console.log("\nScreenshots saved to:", OUT);
}

main().catch(console.error);
