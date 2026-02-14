#!/usr/bin/env node
/** Verify alignment and overlay positioning after aspect-ratio fix. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/alignment-verification";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log("1. Navigating to http://localhost:3000...");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  fs.mkdirSync(OUT, { recursive: true });

  console.log("2. Finding features section and scrolling to it...");
  const { sectionTop, range } = await page.evaluate(() => {
    const s = document.querySelector('section[style*="500vh"]');
    const top = s ? s.getBoundingClientRect().top + window.scrollY : 800;
    const vh = window.innerHeight;
    return { sectionTop: top, range: vh * 4 };
  });
  
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop);
  await page.waitForTimeout(800);

  console.log("\n3. Screen 1 (Welcome/Login) - Checking button alignment...");
  await page.screenshot({ path: path.join(OUT, "01-screen1-login.png"), fullPage: false });
  
  const loginCheck = await page.evaluate(() => {
    const phone = document.querySelector('div[style*="aspectRatio"]');
    if (!phone) return { error: "Phone not found" };
    
    // Find login button(s)
    const buttons = Array.from(phone.querySelectorAll('button, [role="button"]'))
      .filter(b => b.innerText?.toLowerCase().includes('login'));
    
    // Check for duplicate buttons
    const loginButtons = buttons.filter(b => 
      b.innerText?.toLowerCase().includes('anilist')
    );
    
    // Get phone dimensions
    const phoneRect = phone.getBoundingClientRect();
    
    return {
      phoneWidth: phoneRect.width,
      phoneHeight: phoneRect.height,
      buttonCount: loginButtons.length,
      buttonPositions: loginButtons.map(b => {
        const rect = b.getBoundingClientRect();
        return {
          top: rect.top - phoneRect.top,
          left: rect.left - phoneRect.left,
          width: rect.width,
          height: rect.height,
          text: b.innerText
        };
      }),
      hasGapAtBottom: phoneRect.height > 0 ? (phoneRect.height % 1 !== 0) : false
    };
  });
  
  console.log("Login screen analysis:");
  console.log("- Phone dimensions:", loginCheck.phoneWidth, "x", loginCheck.phoneHeight);
  console.log("- Login buttons found:", loginCheck.buttonCount);
  console.log("- Button positions:", JSON.stringify(loginCheck.buttonPositions, null, 2));
  console.log("- Issue: Duplicate button?", loginCheck.buttonCount > 1 ? "YES ⚠️" : "NO ✓");

  console.log("\n4. Screen 2 (Home) - Checking card alignment...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.3);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, "02-screen2-home.png"), fullPage: false });
  
  const homeCheck = await page.evaluate(() => {
    const phone = document.querySelector('div[style*="aspectRatio"]');
    if (!phone) return { error: "Phone not found" };
    
    // Find Frieren cards (by alt text or title)
    const frierenElements = Array.from(phone.querySelectorAll('*'))
      .filter(el => {
        const text = el.innerText?.toLowerCase() || '';
        const alt = el.getAttribute('alt')?.toLowerCase() || '';
        return text.includes('frieren') || alt.includes('frieren');
      });
    
    // Check for images with Frieren
    const frierenImages = Array.from(phone.querySelectorAll('img'))
      .filter(img => img.alt?.toLowerCase().includes('frieren'));
    
    const phoneRect = phone.getBoundingClientRect();
    
    return {
      frierenElementCount: frierenElements.length,
      frierenImageCount: frierenImages.length,
      imagePositions: frierenImages.slice(0, 3).map(img => {
        const rect = img.getBoundingClientRect();
        return {
          top: rect.top - phoneRect.top,
          left: rect.left - phoneRect.left,
          width: rect.width,
          height: rect.height,
          alt: img.alt
        };
      })
    };
  });
  
  console.log("Home screen analysis:");
  console.log("- Frieren elements found:", homeCheck.frierenElementCount);
  console.log("- Frieren images found:", homeCheck.frierenImageCount);
  console.log("- Image positions:", JSON.stringify(homeCheck.imagePositions, null, 2));
  console.log("- Issue: Duplicate card?", homeCheck.frierenImageCount > 1 ? "POSSIBLE ⚠️" : "NO ✓");

  console.log("\n5. Screen 3 (Drawer)...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.5);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, "03-screen3-drawer.png"), fullPage: false });

  console.log("\n6. Screen 4 (Airing) - Checking element positions...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.7);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, "04-screen4-airing.png"), fullPage: false });
  
  const airingCheck = await page.evaluate(() => {
    const phone = document.querySelector('div[style*="aspectRatio"]');
    if (!phone) return { error: "Phone not found" };
    
    const phoneRect = phone.getBoundingClientRect();
    const allElements = Array.from(phone.querySelectorAll('*'));
    
    // Check for overlapping elements by finding elements at same position
    const positions = allElements.map(el => {
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        top: Math.round(rect.top - phoneRect.top),
        left: Math.round(rect.left - phoneRect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    }).filter(p => p.width > 0 && p.height > 0);
    
    return {
      elementCount: positions.length,
      phoneHeight: phoneRect.height
    };
  });
  
  console.log("Airing screen analysis:");
  console.log("- Elements in phone:", airingCheck.elementCount);
  console.log("- Phone height:", airingCheck.phoneHeight);

  console.log("\n7. Screen 5 (Explore) - Checking search bar and section spacing...");
  await page.evaluate((y) => window.scrollTo(0, y), sectionTop + range * 0.85);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, "05-screen5-explore.png"), fullPage: false });
  
  const exploreCheck = await page.evaluate(() => {
    const phone = document.querySelector('div[style*="aspectRatio"]');
    if (!phone) return { error: "Phone not found" };
    
    const phoneRect = phone.getBoundingClientRect();
    const text = phone.innerText;
    
    // Find sections
    const hasPopular = text.includes('Popular');
    const hasTrending = text.includes('Trending');
    const hasUpcoming = text.includes('Upcoming');
    
    // Check for search input
    const searchInputs = phone.querySelectorAll('input[type="text"], input[placeholder*="search" i]');
    
    // Get all section headers
    const headers = Array.from(phone.querySelectorAll('*'))
      .filter(el => {
        const t = el.innerText?.trim() || '';
        return t === 'Popular this season' || t === 'Trending now' || t === 'Upcoming next season';
      })
      .map(el => {
        const rect = el.getBoundingClientRect();
        return {
          text: el.innerText,
          top: rect.top - phoneRect.top,
          height: rect.height
        };
      });
    
    return {
      hasPopular,
      hasTrending,
      hasUpcoming,
      searchInputCount: searchInputs.length,
      sectionHeaders: headers,
      phoneHeight: phoneRect.height
    };
  });
  
  console.log("Explore screen analysis:");
  console.log("- Popular section:", exploreCheck.hasPopular ? "YES ✓" : "NO");
  console.log("- Trending section:", exploreCheck.hasTrending ? "YES ✓" : "NO");
  console.log("- Upcoming section:", exploreCheck.hasUpcoming ? "YES ✓" : "NO");
  console.log("- Search inputs found:", exploreCheck.searchInputCount);
  console.log("- Section headers:", JSON.stringify(exploreCheck.sectionHeaders, null, 2));
  console.log("- Phone height:", exploreCheck.phoneHeight);

  await browser.close();
  console.log("\n✓ Screenshots saved to:", OUT);
  console.log("\nPlease review screenshots for visual alignment issues.");
}

main().catch(console.error);
