// scripts/verify-game-gate.mjs
import { chromium } from "playwright-core";
import { execSync } from "child_process";

const browserPath = execSync(
  `ls -d ~/Library/Caches/ms-playwright/chromium-*/chrome-mac-arm64/"Google Chrome for Testing.app"/Contents/MacOS/"Google Chrome for Testing"`
).toString().trim();

const browser = await chromium.launch({ executablePath: browserPath });
const page = await browser.newPage({ viewport: { width: 600, height: 500 } });

// Fresh visit (no localStorage) shows character select, not the invite.
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForSelector("text=SELECT YOUR CHARACTER");
const inviteVisibleBeforeWin = await page.locator("text=ACHIEVEMENT UNLOCKED").count();
if (inviteVisibleBeforeWin !== 0) {
  throw new Error("Invite content should not be visible before the game is won");
}

// Picking a character and starting shows the game canvas.
await page.getByLabel("Select Nurin").click();
await page.getByText("Start").click();
await page.waitForSelector("canvas");

// Simulate setting the completion flag directly (exercising the same
// contract PixelGame's onWin uses) and reload — invite should show immediately.
await page.evaluate(() => localStorage.setItem("pixel-invite-game-completed", "true"));
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("text=ACHIEVEMENT UNLOCKED");
const gameVisibleAfterCompletion = await page.locator("canvas").count();
if (gameVisibleAfterCompletion !== 0) {
  throw new Error("Game canvas should not render once completion flag is set");
}

// Replay link clears the flag and shows character select again.
await page.getByText("Replay Level 1").click();
await page.waitForSelector("text=SELECT YOUR CHARACTER");
const flagAfterReplay = await page.evaluate(() =>
  localStorage.getItem("pixel-invite-game-completed")
);
if (flagAfterReplay !== null) {
  throw new Error("Expected completion flag to be cleared after clicking replay");
}

console.log("PASS: game gate shows game first, invite after completion, replay resets it");
await browser.close();
