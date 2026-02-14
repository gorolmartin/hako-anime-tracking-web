#!/usr/bin/env node
/** Test segmented scroll behavior with rest zones. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/scroll-segments-test";

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

  console.log(`Section starts at ${sectionTop}px, height: ${sectionHeight}px`);

  // Helper to get current screen info
  const getScreenInfo = async () => {
    return await page.evaluate(() => {
      // Find left-side text (feature tag and title)
      const section = document.querySelector('section[style*="500vh"]');
      if (!section) return { tag: "N/A", title: "N/A", phoneContent: "N/A" };
      
      const leftSide = section.querySelector('div');
      const tag = leftSide?.querySelector('[class*="text-"]')?.innerText || "N/A";
      const title = leftSide?.querySelector('h2, h3')?.innerText || "N/A";
      
      // Get phone content
      const phone = section.querySelector('div[style*="aspectRatio"]');
      const phoneText = phone?.innerText.substring(0, 100) || "N/A";
      
      return { tag, title, phoneText };
    });
  };

  // Test each segment at its "rest" position
  // Based on the code: segments change at 0.2, 0.4, 0.6, 0.8
  // Rest zones should be at the midpoints: 0.1, 0.3, 0.5, 0.7, 0.9
  
  const segments = [
    { name: "Screen 1 (Welcome)", progress: 0.1, expected: "WELCOME" },
    { name: "Screen 2 (Home)", progress: 0.3, expected: "HOME" },
    { name: "Screen 3 (Drawer)", progress: 0.5, expected: "QUICK ACTIONS" },
    { name: "Screen 4 (Airing)", progress: 0.7, expected: "SCHEDULE" },
    { name: "Screen 5 (Explore)", progress: 0.9, expected: "DISCOVER" }
  ];

  console.log("\n3. Testing each segment at rest position...\n");

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const scrollPos = sectionTop + (sectionHeight * seg.progress);
    
    console.log(`\n${seg.name} (${seg.progress * 100}% through section):`);
    console.log(`  Scrolling to ${scrollPos}px...`);
    
    await page.evaluate((y) => window.scrollTo(0, y), scrollPos);
    await page.waitForTimeout(1000); // Wait for animations to settle
    
    const info = await getScreenInfo();
    console.log(`  Tag: "${info.tag}"`);
    console.log(`  Title: "${info.title}"`);
    console.log(`  Phone content: "${info.phoneText}"`);
    console.log(`  Expected tag: "${seg.expected}"`);
    console.log(`  Match: ${info.tag.includes(seg.expected) ? "✓ YES" : "✗ NO"}`);
    
    const filename = `0${i + 1}-${seg.name.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '-')}.png`;
    await page.screenshot({ path: path.join(OUT, filename), fullPage: true });
    console.log(`  Screenshot: ${filename}`);
  }

  // Now test transition zones (at the boundaries: 0.2, 0.4, 0.6, 0.8)
  console.log("\n\n4. Testing transition zones...\n");
  
  const transitions = [
    { name: "Transition 1→2", progress: 0.2 },
    { name: "Transition 2→3", progress: 0.4 },
    { name: "Transition 3→4", progress: 0.6 },
    { name: "Transition 4→5", progress: 0.8 }
  ];

  for (let i = 0; i < transitions.length; i++) {
    const trans = transitions[i];
    const scrollPos = sectionTop + (sectionHeight * trans.progress);
    
    console.log(`\n${trans.name} (${trans.progress * 100}% - boundary):`);
    console.log(`  Scrolling to ${scrollPos}px...`);
    
    await page.evaluate((y) => window.scrollTo(0, y), scrollPos);
    await page.waitForTimeout(800);
    
    const info = await getScreenInfo();
    console.log(`  Tag: "${info.tag}"`);
    console.log(`  Title: "${info.title}"`);
    
    const filename = `transition-${i + 1}-at-${trans.progress * 100}percent.png`;
    await page.screenshot({ path: path.join(OUT, filename), fullPage: true });
    console.log(`  Screenshot: ${filename}`);
  }

  await browser.close();
  console.log("\n\n✓ All screenshots saved to:", OUT);
  console.log("\nAnalysis:");
  console.log("- Check if rest zone screenshots show stable, fully-visible screens");
  console.log("- Check if transition screenshots show mid-animation states");
  console.log("- Verify left-side text matches the expected screen");
}

main().catch(console.error);
