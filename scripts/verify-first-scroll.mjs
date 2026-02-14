#!/usr/bin/env node
/** Verify: initial Welcome; first tiny scroll → login tap + transition to Home; no retrigger on jitter. */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";

async function getShowcaseH2(page) {
  return page.evaluate(() => {
    const section = document.querySelector('section:has(img[alt="Login with AniList"])');
    const h2 = section?.querySelector("h2");
    return h2?.textContent?.trim() || "";
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  let initialH2 = await getShowcaseH2(page);
  const initialWelcome = initialH2.includes("Your journey") || initialH2.includes("journey starts");

  const { sectionTop, range } = await page.evaluate(() => {
    const s = document.querySelector('section:has(img[alt="Login with AniList"])');
    const top = s ? s.getBoundingClientRect().top + window.scrollY : 0;
    const vh = window.innerHeight;
    return { sectionTop: top, range: vh * 8 };
  });

  await page.evaluate((y) => window.scrollTo(0, y), sectionTop);
  await page.waitForTimeout(500);
  const delta = 25;
  await page.evaluate(([y, d]) => window.scrollTo(0, y + d), [sectionTop, delta]);
  await page.waitForTimeout(700);

  const afterFirstH2 = await getShowcaseH2(page);
  const transitionedToHome = afterFirstH2.includes("Everything at a glance") || afterFirstH2.includes("glance");

  const scrollBase = sectionTop + delta;
  for (let i = 0; i < 5; i++) {
    const jitter = (i % 2 === 0 ? 1 : -1) * (5 + i * 2);
    await page.evaluate(([y, j]) => window.scrollTo(0, y + j), [scrollBase, jitter]);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(300);

  const afterJitterH2 = await getShowcaseH2(page);
  const noRetrigger = afterJitterH2.includes("Everything") || afterJitterH2.includes("glance") || afterJitterH2.includes("Update") || afterJitterH2.includes("Never") || afterJitterH2.includes("Discover");
  const backToWelcome = afterJitterH2.includes("Your journey");
  const jitterOk = noRetrigger && !backToWelcome;

  await browser.close();

  const pass = initialWelcome && transitionedToHome && jitterOk;
  console.log("--- First-scroll behavior ---");
  console.log("(1) Initial Welcome:", initialWelcome ? "yes" : "no", "-", initialH2.slice(0, 35));
  console.log("(2) After tiny scroll → Home:", transitionedToHome ? "yes" : "no", "-", afterFirstH2.slice(0, 35));
  console.log("(3) After jitter, no retrigger:", jitterOk ? "yes" : "no", "-", afterJitterH2.slice(0, 35));
  console.log("");
  console.log("RESULT:", pass ? "PASS" : "FAIL");
  if (!pass) {
    if (!initialWelcome) console.log("  - Initial state was not Welcome");
    if (!transitionedToHome) console.log("  - Did not transition to Home after first scroll");
    if (!jitterOk) console.log("  - Retriggered or regressed after jitter");
  }
}

main().catch(console.error);
