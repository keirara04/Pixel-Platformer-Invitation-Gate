// scripts/verify-love-letter.mjs
import { chromium } from "playwright-core";
import { execSync } from "child_process";
import { readFileSync } from "fs";

function getQuestionBank() {
  const src = readFileSync(
    new URL("../components/game/questions.ts", import.meta.url),
    "utf8"
  );
  return [...src.matchAll(/\{\s*question:\s*"([^"]*)",\s*answer:\s*"([^"]*)"/g)].map((m) => ({
    question: m[1],
    answer: m[2],
  }));
}
const questionBank = getQuestionBank();

const browserPath = execSync(
  `ls -d ~/Library/Caches/ms-playwright/chromium-*/chrome-mac-arm64/"Google Chrome for Testing.app"/Contents/MacOS/"Google Chrome for Testing"`
).toString().trim();

const browser = await chromium.launch({ executablePath: browserPath });
const page = await browser.newPage({ viewport: { width: 900, height: 700 } });

// LoveLetter only becomes reachable by actually winning the game (there's
// no shortcut flag for it, unlike the invite's completion flag), so this
// script plays through all 3 levels for real — same technique as
// scripts/verify-game-playthrough.mjs — then verifies the letter's own
// click-to-open + continue behavior once it's reached.
await page.evaluate(() => localStorage.removeItem("pixel-invite-game-completed")).catch(() => {});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForSelector("text=SELECT YOUR CHARACTER");
await page.getByLabel("Select Nurin").click();
await page.getByText("Start").click();
await page.waitForSelector("canvas");
await page.click("canvas");

async function answerGate() {
  await page.waitForSelector('input[placeholder="Type your answer..."]');
  const shownQuestion = (await page.getByTestId("question-text").innerText()).trim();
  const entry = questionBank.find((q) => shownQuestion.includes(q.question));
  if (!entry) {
    throw new Error(`Could not find "${shownQuestion}" in the question bank`);
  }
  await page.fill('input[placeholder="Type your answer..."]', entry.answer);
  await page.getByText("Submit").click();
  await page.waitForSelector('input[placeholder="Type your answer..."]', { state: "detached" });
}

async function jump() {
  await page.keyboard.press("Space");
}

await page.keyboard.down("ArrowRight");
await page.waitForTimeout(3000);
await page.keyboard.up("ArrowRight");
await answerGate();
await page.keyboard.down("ArrowRight");

for (let i = 0; i < 8; i++) {
  await jump();
  await page.waitForTimeout(400);
}
await page.keyboard.up("ArrowRight");
await answerGate();
await page.keyboard.down("ArrowRight");

for (let i = 0; i < 12; i++) {
  await jump();
  await page.waitForTimeout(400);
}
await page.keyboard.up("ArrowRight");
await page.waitForTimeout(500);

// Should now be on the closed-envelope letter screen, not the invite yet.
await page.waitForSelector("text=Click to open");
const inviteVisibleBeforeOpening = await page.locator("text=ACHIEVEMENT UNLOCKED").count();
if (inviteVisibleBeforeOpening !== 0) {
  throw new Error("Invite should not be visible before the envelope is opened");
}

await page.getByLabel("Open the letter").click();
await page.waitForSelector("text=Continue", { timeout: 10000 });

await page.getByText("Continue").click();
await page.waitForSelector("text=ACHIEVEMENT UNLOCKED");
const flag = await page.evaluate(() => localStorage.getItem("pixel-invite-game-completed"));
if (flag !== "true") {
  throw new Error("Expected completion flag to be set after continuing past the letter");
}

console.log("PASS: love letter shows closed envelope after winning, opens on click, and continue reveals the invite");
await browser.close();
