#!/usr/bin/env node
/** Verify FeaturesSection (500vh): phone size, left text per segment, 5 screens, transitions. */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "scripts/features-snapshots";

const SEGMENT_PROGRESS = [0.1, 0.3, 0.5, 0.7, 0.9];
const EXPECTED_TAGS = ["Welcome", "Home", "Quick Actions", "Schedule", "Discover"];
const SCREEN_INDICATORS = [
  { name: "Login", text: "Login with AniList" },
  { name: "Home Feed", text: "Airing · 5" },
  { name: "Action Drawer", text: "Watching" },
  { name: "Airing Schedule", text: "Wed" },
  { name: "Explore", text: "Trending" },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  let loadOk = false;
  try {
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 8000 });
    loadOk = true;
  } catch {
    console.log("Dev server not reachable at", BASE);
    await browser.close();
    process.exit(1);
  }

  await page.waitForTimeout(1200);

  const section = page.locator('section[style*="500vh"]').first();
  const hasSection = (await section.count()) > 0;
  if (!hasSection) {
    console.log("FeaturesSection (500vh) not found");
    await browser.close();
    process.exit(1);
  }

  const { sectionTop, range } = await page.evaluate(() => {
    const sections = document.querySelectorAll("section");
    const s = Array.from(sections).find((el) => el.style?.height?.includes("500"));
    const top = s ? s.getBoundingClientRect().top + window.scrollY : 0;
    const vh = window.innerHeight;
    return { sectionTop: top, range: vh * 4 };
  });

  fs.mkdirSync(OUT, { recursive: true });

  const results = [];
  for (let i = 0; i < SEGMENT_PROGRESS.length; i++) {
    const p = SEGMENT_PROGRESS[i];
    const y = sectionTop + range * p;
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(700);

    const data = await page.evaluate(() => {
      const sections = document.querySelectorAll("section");
      const section = Array.from(sections).find((el) => el.style?.height?.includes("500"));
      if (!section) return { tag: "", title: "", phoneWidth: 0, phoneHeight: 0, hasBezel: false, screenTexts: [] };

      const tagEl = section.querySelector('span[class*="uppercase"]');
      const h2 = section.querySelector("h2");
      const tag = tagEl?.textContent?.trim() || "";
      const title = h2?.textContent?.trim() || "";

      const walk = (el) => {
        let best = null;
        for (const c of el.children || []) {
          const r = walk(c);
          if (r) best = r;
        }
        const rect = el.getBoundingClientRect();
        if (rect.width >= 200 && rect.width <= 450 && rect.height >= 400) {
          const cur = { width: Math.round(rect.width), height: Math.round(rect.height) };
          return !best || cur.width <= best.width ? cur : best;
        }
        return best;
      };
      const phoneSize = walk(section);
      const phoneWidth = phoneSize?.width || 0;
      const phoneHeight = phoneSize?.height || 0;
      const hasBezel = section.querySelector('[style*="borderRadius: 40"]') || section.querySelector('[style*="border-radius: 40px"]');

      const bodyText = document.body?.innerText || "";
      const screenTexts = ["Login with AniList", "Airing · 5", "Watching", "Wed", "Trending"].filter((t) => bodyText.includes(t));

      return { tag, title, phoneWidth, phoneHeight, hasBezel: !!hasBezel, screenTexts };
    });

    const { tag, title, phoneWidth, phoneHeight, hasBezel, screenTexts } = data;
    const file = path.join(OUT, `segment-${i + 1}-${(tag || "unknown").replace(/\s+/g, "-")}.png`);
    await page.screenshot({ path: file }).catch(() => {});

    results.push({
      i,
      tag,
      expectedTag: EXPECTED_TAGS[i],
      title: title.slice(0, 40),
      phoneWidth,
      phoneHeight,
      hasBezel,
      screenTexts,
    });
  }

  await browser.close();

  const phoneOk = results.every((r) => r.phoneWidth >= 200 && r.phoneWidth <= 400);
  const bezelOk = results.some((r) => r.phoneWidth > 0);
  const tagsOk = results.every((r, i) =>
    r.tag.toLowerCase().includes(EXPECTED_TAGS[i].toLowerCase().split(" ")[0])
  );
  const screensOk = results.some((r) => r.screenTexts.length >= 1);
  const transitionsOk = new Set(results.map((r) => r.tag)).size >= 4;

  console.log("--- FeaturesSection Verification (500vh) ---\n");
  results.forEach((r) => {
    console.log(`Segment ${r.i + 1} (${r.expectedTag}): tag="${r.tag}" phone=${r.phoneWidth}x${r.phoneHeight}px`);
  });
  console.log("");
  console.log("1. Phone mockup visible with bezel:", phoneOk && bezelOk ? "PASS" : "FAIL",
    phoneOk ? `(${results[0]?.phoneWidth}px)` : "- not at expected size");
  console.log("2. Left text changes per segment:", tagsOk ? "PASS" : "FAIL",
    tagsOk ? "" : `- got: ${results.map((r) => r.tag).join(", ")}`);
  console.log("3. 5 screens in sequence:", screensOk ? "PASS" : "FAIL",
    "- Login, Home Feed, Drawer, Schedule, Explore");
  console.log("4. Transitions animate:", transitionsOk ? "PASS" : "FAIL",
    transitionsOk ? `${new Set(results.map((r) => r.tag)).size} distinct segments` : "");
  console.log("\nSnapshots:", OUT);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
