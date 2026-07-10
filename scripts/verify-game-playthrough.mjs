import { chromium } from "playwright-core";
import { execSync } from "child_process";

const browserPath = execSync(
  `ls -d ~/Library/Caches/ms-playwright/chromium-*/chrome-mac-arm64/"Google Chrome for Testing.app"/Contents/MacOS/"Google Chrome for Testing"`
).toString().trim();

const browser = await chromium.launch({ executablePath: browserPath });
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));

await page.evaluate(() => localStorage.removeItem("pixel-invite-game-completed")).catch(() => {});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForSelector("canvas");
await page.click("canvas");

async function jump() {
  await page.keyboard.press("Space");
}

// Hold right continuously for the whole playthrough; tap Space periodically
// to jump without ever releasing horizontal movement (matches how a real
// player would hold right + tap jump — releasing right mid-air kills
// horizontal momentum and the player can't clear any gap).
await page.keyboard.down("ArrowRight");

// Level 1: flat ground, no jumps needed.
await page.waitForTimeout(3000);

// Level 2: gaps — tap jump periodically while still holding right.
for (let i = 0; i < 8; i++) {
  await jump();
  await page.waitForTimeout(400);
}

// Level 3: gaps + raised platform — same technique, more attempts.
for (let i = 0; i < 12; i++) {
  await jump();
  await page.waitForTimeout(400);
}
await page.keyboard.up("ArrowRight");
await page.waitForTimeout(500);

const invited = await page.locator("text=ACHIEVEMENT UNLOCKED").count();
const flag = await page.evaluate(() => localStorage.getItem("pixel-invite-game-completed"));

if (errors.length > 0) {
  throw new Error(`Console/page errors during playthrough: ${JSON.stringify(errors)}`);
}
if (invited === 0 || flag !== "true") {
  throw new Error("Playthrough failed: did not reach the invite / win did not fire");
}

console.log("PASS: full playthrough completed, all 3 levels cleared, win fired");
await browser.close();
