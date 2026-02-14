#!/usr/bin/env node
/** Test snap-scroll behavior in the features section. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/snap-scroll-test";

async function main() {
  const browser = await chromium.launch({ headless: false }); // Non-headless to see behavior
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log("1. Navigating to http://localhost:3000...");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  fs.mkdirSync(OUT, { recursive: true });

  // Helper to get screen info
  const getScreenInfo = async () => {
    return await page.evaluate(() => {
      const section = document.querySelector('section[style*="500vh"]');
      if (!section) return { tag: "N/A", title: "N/A", phoneContent: "N/A", scrollY: window.scrollY };
      
      // Get left-side text
      const tag = section.querySelector('p[class*="text-blue"]')?.innerText || 
                  section.querySelector('[class*="text-"]')?.innerText?.split('\n')[0] || "N/A";
      const title = section.querySelector('h2, h3')?.innerText || "N/A";
      
      // Detect phone content
      const phone = section.querySelector('div[style*="aspectRatio"]');
      if (!phone) return { tag, title, phoneContent: "Phone not found", scrollY: window.scrollY };
      
      const text = phone.innerText.toLowerCase();
      let screenName = "Unknown";
      
      if (text.includes('login with anilist')) screenName = "Login";
      else if (text.includes('good afternoon')) screenName = "Home";
      else if (text.includes('update progress') || text.includes('watching')) screenName = "Drawer";
      else if (text.includes('airing') && text.includes('winter')) screenName = "Airing";
      else if (text.includes('popular this season')) screenName = "Explore";
      
      return { tag, title, phoneContent: screenName, scrollY: window.scrollY };
    });
  };

  console.log("2. Scrolling down to features section...");
  const { sectionTop } = await page.evaluate(() => {
    const s = document.querySelector('section[style*="500vh"]');
    if (!s) return { sectionTop: 800 };
    const rect = s.getBoundingClientRect();
    return { sectionTop: rect.top + window.scrollY };
  });

  // Scroll to just before the features section
  await page.evaluate((y) => window.scrollTo(0, y - 100), sectionTop);
  await page.waitForTimeout(500);

  // Now scroll into the features section
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(1500); // Wait for snap animation

  console.log("Taking screenshot of initial screen (should be Welcome/Login)...");
  let info = await getScreenInfo();
  console.log(`  Screen: ${info.phoneContent}, Tag: ${info.tag}, Scroll: ${info.scrollY}px`);
  await page.screenshot({ path: path.join(OUT, "01-initial-welcome.png"), fullPage: true });

  // Test 3: Scroll DOWN once -> should snap to Home
  console.log("\n3. Scrolling DOWN once (should snap to Home screen)...");
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(1500); // Wait for snap animation
  
  info = await getScreenInfo();
  console.log(`  Screen: ${info.phoneContent}, Tag: ${info.tag}, Scroll: ${info.scrollY}px`);
  console.log(`  Expected: Home screen with anime cards`);
  console.log(`  Match: ${info.phoneContent === "Home" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "02-snap-to-home.png"), fullPage: true });

  // Test 4: Scroll DOWN once -> should snap to Drawer
  console.log("\n4. Scrolling DOWN once (should snap to Drawer screen)...");
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(1500);
  
  info = await getScreenInfo();
  console.log(`  Screen: ${info.phoneContent}, Tag: ${info.tag}, Scroll: ${info.scrollY}px`);
  console.log(`  Expected: Drawer overlay on home screen`);
  console.log(`  Match: ${info.phoneContent === "Drawer" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "03-snap-to-drawer.png"), fullPage: true });

  // Test 5: Scroll DOWN once -> should snap to Airing
  console.log("\n5. Scrolling DOWN once (should snap to Airing/Schedule screen)...");
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(1500);
  
  info = await getScreenInfo();
  console.log(`  Screen: ${info.phoneContent}, Tag: ${info.tag}, Scroll: ${info.scrollY}px`);
  console.log(`  Expected: Airing screen with calendar`);
  console.log(`  Match: ${info.phoneContent === "Airing" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "04-snap-to-airing.png"), fullPage: true });

  // Test 6: Scroll DOWN once -> should snap to Explore
  console.log("\n6. Scrolling DOWN once (should snap to Explore/Discover screen)...");
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(1500);
  
  info = await getScreenInfo();
  console.log(`  Screen: ${info.phoneContent}, Tag: ${info.tag}, Scroll: ${info.scrollY}px`);
  console.log(`  Expected: Explore screen with Popular/Trending/Upcoming`);
  console.log(`  Match: ${info.phoneContent === "Explore" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "05-snap-to-explore.png"), fullPage: true });

  // Test 7: Scroll DOWN once more -> should scroll past features section
  console.log("\n7. Scrolling DOWN once more (should scroll past features section)...");
  const scrollBefore = info.scrollY;
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(1500);
  
  info = await getScreenInfo();
  console.log(`  Scroll before: ${scrollBefore}px, after: ${info.scrollY}px`);
  console.log(`  Scrolled past section: ${info.scrollY > scrollBefore ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "06-scroll-past-section.png"), fullPage: true });

  // Test scrolling UP
  console.log("\n8. Testing SCROLL UP behavior...");
  console.log("Scrolling UP once (should go back to Airing)...");
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(1500);
  
  info = await getScreenInfo();
  console.log(`  Screen: ${info.phoneContent}, Tag: ${info.tag}`);
  console.log(`  Expected: Airing screen`);
  console.log(`  Match: ${info.phoneContent === "Airing" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "07-scroll-up-to-airing.png"), fullPage: true });

  console.log("\nScrolling UP once more (should go back to Drawer)...");
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(1500);
  
  info = await getScreenInfo();
  console.log(`  Screen: ${info.phoneContent}, Tag: ${info.tag}`);
  console.log(`  Expected: Drawer screen`);
  console.log(`  Match: ${info.phoneContent === "Drawer" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "08-scroll-up-to-drawer.png"), fullPage: true });

  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log("All screenshots saved to:", OUT);
  console.log("\nSnap-scroll behavior test complete.");
  console.log("Review screenshots to verify:");
  console.log("  - Each scroll triggers a complete transition");
  console.log("  - Transitions are not stopped mid-way");
  console.log("  - Left-side text matches phone content");
  console.log("  - Scroll up/down works bidirectionally");

  await browser.close();
}

main().catch(console.error);
