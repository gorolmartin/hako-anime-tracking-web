#!/usr/bin/env node
/** Test segmented scroll with correct rest zone positions. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/rest-zones-test";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log("1. Navigating to http://localhost:3000...");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  fs.mkdirSync(OUT, { recursive: true });

  console.log("2. Finding features section...");
  const { sectionTop, sectionHeight } = await page.evaluate(() => {
    const s = document.querySelector('section[style*="500vh"]');
    if (!s) return { sectionTop: 0, sectionHeight: 0 };
    const rect = s.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    return { sectionTop: top, sectionHeight: rect.height };
  });

  console.log(`Features section: top=${sectionTop}px, height=${sectionHeight}px\n`);

  // Helper to get screen info
  const getScreenInfo = async () => {
    return await page.evaluate(() => {
      const section = document.querySelector('section[style*="500vh"]');
      if (!section) return { tag: "N/A", title: "N/A", phoneContent: "N/A" };
      
      // Get left-side text
      const tag = section.querySelector('p[class*="text-blue"]')?.innerText || 
                  section.querySelector('[class*="text-"]')?.innerText || "N/A";
      const title = section.querySelector('h2, h3')?.innerText || "N/A";
      
      // Get phone content indicators
      const phone = section.querySelector('div[style*="aspectRatio"]');
      if (!phone) return { tag, title, phoneContent: "Phone not found" };
      
      const text = phone.innerText.toLowerCase();
      let screenIndicator = "Unknown";
      
      if (text.includes('login with anilist')) screenIndicator = "Screen 1: Login";
      else if (text.includes('good afternoon') || text.includes('new episodes')) screenIndicator = "Screen 2: Home Feed";
      else if (text.includes('update progress') || text.includes('watching')) screenIndicator = "Screen 3: Drawer";
      else if (text.includes('airing') && text.includes('winter season')) screenIndicator = "Screen 4: Airing";
      else if (text.includes('popular this season') || text.includes('trending now')) screenIndicator = "Screen 5: Explore";
      
      return { tag, title, phoneContent: screenIndicator };
    });
  };

  // Test points in the middle of each rest zone
  const testPoints = [
    { name: "Initial (Screen 1 start)", progress: 0.00, expected: "Login" },
    { name: "Screen 1 mid-rest", progress: 0.06, expected: "Login" },
    { name: "Screen 2 mid-rest", progress: 0.26, expected: "Home Feed" },
    { name: "Screen 3 mid-rest", progress: 0.46, expected: "Drawer" },
    { name: "Screen 4 mid-rest", progress: 0.66, expected: "Airing" },
    { name: "Screen 5 mid-rest", progress: 0.90, expected: "Explore" }
  ];

  console.log("3-8. Testing each rest zone:\n");

  for (let i = 0; i < testPoints.length; i++) {
    const point = testPoints[i];
    const scrollPos = sectionTop + (sectionHeight * point.progress);
    
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Test ${i + 1}: ${point.name} (${(point.progress * 100).toFixed(0)}% scroll)`);
    console.log(`${"=".repeat(60)}`);
    console.log(`Scrolling to: ${scrollPos}px`);
    
    await page.evaluate((y) => window.scrollTo(0, y), scrollPos);
    await page.waitForTimeout(1200); // Wait for animations to fully settle
    
    const info = await getScreenInfo();
    
    console.log(`\nLeft-side text:`);
    console.log(`  Tag: "${info.tag}"`);
    console.log(`  Title: "${info.title}"`);
    console.log(`\nPhone content:`);
    console.log(`  Detected: ${info.phoneContent}`);
    console.log(`  Expected: ${point.expected}`);
    
    const matches = info.phoneContent.includes(point.expected);
    console.log(`\n✓ Screen matches: ${matches ? "YES ✓" : "NO ✗"}`);
    
    // Check if left text matches expected screen
    let leftTextMatch = false;
    if (point.expected === "Login" && info.tag.includes("WELCOME")) leftTextMatch = true;
    else if (point.expected === "Home Feed" && info.tag.includes("HOME")) leftTextMatch = true;
    else if (point.expected === "Drawer" && info.tag.includes("QUICK ACTIONS")) leftTextMatch = true;
    else if (point.expected === "Airing" && info.tag.includes("SCHEDULE")) leftTextMatch = true;
    else if (point.expected === "Explore" && info.tag.includes("DISCOVER")) leftTextMatch = true;
    
    console.log(`✓ Left text matches: ${leftTextMatch ? "YES ✓" : "NO ✗"}`);
    
    const filename = `${String(i + 1).padStart(2, '0')}-${point.name.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '-')}.png`;
    await page.screenshot({ path: path.join(OUT, filename), fullPage: true });
    console.log(`\n📸 Screenshot saved: ${filename}`);
  }

  console.log("\n\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log("All screenshots saved to:", OUT);
  console.log("\nReview screenshots to verify:");
  console.log("  1. Each screen has a clear stable rest zone ✓");
  console.log("  2. Left-side text matches phone content ✓");
  console.log("  3. No partial transitions visible during rest zones ✓");

  await browser.close();
}

main().catch(console.error);
