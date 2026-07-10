import { chromium } from "playwright-core";
import { execSync } from "child_process";

const browserPath = execSync(
  `ls -d ~/Library/Caches/ms-playwright/chromium-*/chrome-mac-arm64/"Google Chrome for Testing.app"/Contents/MacOS/"Google Chrome for Testing"`
).toString().trim();

const browser = await chromium.launch({ executablePath: browserPath });
const page = await browser.newPage({ viewport: { width: 480, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

const tiles = await page.locator('[aria-label^="Open photo"]').count();
if (tiles !== 6) throw new Error(`Expected 6 gallery tiles, found ${tiles}`);

await page.getByLabel("Open photo 1").click();
await page.waitForSelector('[role="dialog"]');
await page.keyboard.press("Escape");
await page.waitForSelector('[role="dialog"]', { state: "detached" });

console.log("PASS: gallery renders 6 tiles from shared photo data, lightbox opens/closes");
await browser.close();
