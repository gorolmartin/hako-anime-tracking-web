#!/usr/bin/env node
/** Test video-based feature showcase with scroll-triggered playback. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/video-showcase-test";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  console.log("1. Navigating to http://localhost:3000...");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  fs.mkdirSync(OUT, { recursive: true });

  console.log("\n2. Scrolling to features section...");
  await page.evaluate(() => {
    const section = document.querySelector('section[style*="500vh"]');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(2500);

  // Helper to analyze state
  const analyzeState = async (stepName) => {
    const info = await page.evaluate(() => {
      const section = document.querySelector('section[style*="500vh"]');
      if (!section) return { leftText: "Section not found", hasVideo: false, videoPlaying: false };
      
      // Get left-side text
      const allText = section.innerText;
      let leftText = "N/A";
      if (allText.includes('WELCOME')) leftText = "WELCOME";
      else if (allText.includes('HOME')) leftText = "HOME";
      else if (allText.includes('QUICK ACTIONS')) leftText = "QUICK ACTIONS";
      else if (allText.includes('SCHEDULE')) leftText = "SCHEDULE";
      else if (allText.includes('DISCOVER')) leftText = "DISCOVER";
      
      // Check for video element
      const video = section.querySelector('video');
      const hasVideo = !!video;
      const videoPlaying = video ? !video.paused : false;
      const videoTime = video ? video.currentTime.toFixed(2) : "N/A";
      const videoDuration = video ? video.duration.toFixed(2) : "N/A";
      
      // Check phone frame structure
      const phoneFrame = section.querySelector('div[style*="aspectRatio"]') || 
                         section.querySelector('[class*="phone"]');
      const hasPhone = !!phoneFrame;
      
      return {
        leftText,
        hasVideo,
        videoPlaying,
        videoTime,
        videoDuration,
        hasPhone,
        scrollY: window.scrollY
      };
    });
    
    console.log(`\n${stepName}`);
    console.log(`  Scroll: ${info.scrollY}px`);
    console.log(`  Left text: ${info.leftText}`);
    console.log(`  Has video: ${info.hasVideo ? "✓ YES" : "✗ NO"}`);
    console.log(`  Video playing: ${info.videoPlaying ? "✓ YES" : "✗ NO"}`);
    console.log(`  Video time: ${info.videoTime}s / ${info.videoDuration}s`);
    console.log(`  Phone frame: ${info.hasPhone ? "✓ YES" : "✗ NO"}`);
    
    return info;
  };

  console.log("\n=== STEP 2: Initial state ===");
  let info = await analyzeState("Initial (after scroll to section)");
  await page.screenshot({ path: path.join(OUT, "01-initial.png"), fullPage: false });

  console.log("\n=== STEP 4: First scroll DOWN (should show WELCOME) ===");
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(2000);
  info = await analyzeState("After scroll #1");
  console.log(`  Expected: WELCOME`);
  console.log(`  Match: ${info.leftText === "WELCOME" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "02-welcome.png"), fullPage: false });

  console.log("\n=== STEP 5: Second scroll DOWN (should show HOME) ===");
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(2500);
  info = await analyzeState("After scroll #2");
  console.log(`  Expected: HOME`);
  console.log(`  Match: ${info.leftText === "HOME" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "03-home.png"), fullPage: false });

  console.log("\n=== STEP 6: Third scroll DOWN (should show QUICK ACTIONS) ===");
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(2000);
  info = await analyzeState("After scroll #3");
  console.log(`  Expected: QUICK ACTIONS`);
  console.log(`  Match: ${info.leftText === "QUICK ACTIONS" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "04-quick-actions.png"), fullPage: false });

  console.log("\n=== STEP 7: Fourth scroll DOWN (should show SCHEDULE) ===");
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(2500);
  info = await analyzeState("After scroll #4");
  console.log(`  Expected: SCHEDULE`);
  console.log(`  Match: ${info.leftText === "SCHEDULE" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "05-schedule.png"), fullPage: false });

  console.log("\n=== STEP 8: Fifth scroll DOWN (should show DISCOVER) ===");
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(2500);
  info = await analyzeState("After scroll #5");
  console.log(`  Expected: DISCOVER`);
  console.log(`  Match: ${info.leftText === "DISCOVER" ? "✓ YES" : "✗ NO"}`);
  await page.screenshot({ path: path.join(OUT, "06-discover.png"), fullPage: false });

  console.log("\n" + "=".repeat(70));
  console.log("VIDEO SHOWCASE TEST COMPLETE");
  console.log("=".repeat(70));
  console.log(`Screenshots saved to: ${OUT}`);
  console.log("\nKey findings:");
  console.log("  - Video element presence");
  console.log("  - Scroll-triggered playback");
  console.log("  - Left text synchronization");
  console.log("  - Phone frame integrity");
  
  await page.waitForTimeout(2000);
  await browser.close();
}

main().catch(console.error);
