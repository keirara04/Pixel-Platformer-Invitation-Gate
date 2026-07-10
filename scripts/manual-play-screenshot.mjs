// scripts/manual-play-screenshot.mjs
import { chromium } from "playwright-core";
import { execSync } from "child_process";

const browserPath = execSync(
  `ls -d ~/Library/Caches/ms-playwright/chromium-*/chrome-mac-arm64/"Google Chrome for Testing.app"/Contents/MacOS/"Google Chrome for Testing"`
).toString().trim();
const browser = await chromium.launch({ executablePath: browserPath });
const page = await browser.newPage({ viewport: { width: 600, height: 500 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForSelector("canvas");
await page.click("canvas");
await page.screenshot({ path: "/tmp/game-start.png" });

for (let i = 0; i < 20; i++) {
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(100);
  if (i % 5 === 0) {
    await page.keyboard.press("Space");
  }
}
await page.keyboard.up("ArrowRight");
await page.screenshot({ path: "/tmp/game-after-play.png" });
await browser.close();
