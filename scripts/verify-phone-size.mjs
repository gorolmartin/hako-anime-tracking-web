#!/usr/bin/env node
/** Verify phone mockup size (~280px mobile / ~320px large) and scroll-animation through segments. */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";

async function run(viewport = { width: 1280, height: 900 }) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const size = await page.evaluate(() => {
    const section = document.querySelector('section:has(img[alt="Login with AniList"])');
    if (!section) return null;
    const walk = (el) => {
      let best = null;
      for (const c of el.children || []) {
        const res = walk(c);
        if (res && (!best || res.width < best.width)) best = res;
      }
      const r = el.getBoundingClientRect();
      const w = r.width, h = r.height;
      if (w >= 260 && w <= 400 && h >= 500 && h <= 900) {
        const cur = { width: Math.round(w), height: Math.round(h) };
        return !best || cur.width <= best.width ? cur : best;
      }
      return best;
    };
    return walk(section);
  });

  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = viewport.height;
  const sectionTop = await page.evaluate(() => {
    const s = document.querySelector('section:has(img[alt="Login with AniList"])');
    return s ? s.getBoundingClientRect().top + window.scrollY : 0;
  });
  const showcaseRange = vh * 8;
  const segments = [
    { p: 0.05, label: "Welcome" },
    { p: 0.25, label: "Home" },
    { p: 0.45, label: "Drawer" },
    { p: 0.65, label: "Airing" },
    { p: 0.88, label: "Explore" },
  ];
  const h2s = [];
  for (const { p, label } of segments) {
    await page.evaluate((y) => window.scrollTo(0, y), sectionTop + showcaseRange * p);
    await page.waitForTimeout(600);
    const h2 = await page.evaluate(() => {
      const h2s = Array.from(document.querySelectorAll("h2"));
      const showcase = document.querySelector('section:has(img[alt="Login with AniList"])');
      const inShowcase = showcase ? (el) => showcase.contains(el) : () => true;
      const found = h2s.find((h) => inShowcase(h));
      return found?.textContent?.trim()?.slice(0, 50) || "";
    });
    h2s.push({ label, h2 });
  }

  await browser.close();
  return { size, viewport, h2s };
}

async function main() {
  const mobile = await run({ width: 390, height: 844 });
  const desktop = await run({ width: 1280, height: 900 });

  const mobileOk = mobile.size && mobile.size.width >= 250 && mobile.size.width <= 350;
  const desktopOk = desktop.size && desktop.size.width >= 280 && desktop.size.width <= 350;

  const uniqueH2s = [...new Set([...mobile.h2s, ...desktop.h2s].map((x) => x.h2).filter(Boolean))];
  const segmentsAnimate = uniqueH2s.length >= 2;

  console.log("--- Phone size & scroll verification ---");
  console.log("Mobile (390x844):  phone width:", mobile.size?.width ?? "N/A", mobileOk ? "OK" : "FAIL");
  console.log("Desktop (1280x900): phone width:", desktop.size?.width ?? "N/A", desktopOk ? "OK" : "FAIL");
  console.log("Segments (unique h2):", uniqueH2s.length, segmentsAnimate ? "OK" : "FAIL");
  console.log("");
  console.log("(1) Phone visible size:", mobileOk && desktopOk ? "PASS" : "FAIL", `- mobile ${mobile.size?.width}px, desktop ${desktop.size?.width}px`);
  console.log("(2) Scroll-animates segments:", segmentsAnimate ? "PASS" : "FAIL", `- ${uniqueH2s.length} unique segment titles`);
}

main().catch(console.error);
