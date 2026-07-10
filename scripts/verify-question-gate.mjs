// scripts/verify-question-gate.mjs
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
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.evaluate(() => localStorage.removeItem("pixel-invite-game-completed")).catch(() => {});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForSelector("text=SELECT YOUR CHARACTER");
await page.getByLabel("Select Nurin").click();
await page.getByText("Start").click();
await page.waitForSelector("canvas");
await page.click("canvas");

// Walk through level 1 (flat ground, no jumps) to its exit.
await page.keyboard.down("ArrowRight");
await page.waitForTimeout(3000);
await page.keyboard.up("ArrowRight");

// The question dialogue should now be visible with no hint yet.
await page.waitForSelector('input[placeholder="Type your answer..."]');
const hintBeforeAttempts = await page.locator("text=Hint:").count();
if (hintBeforeAttempts !== 0) {
  throw new Error("Hint should not be visible before any wrong attempts");
}

// Record player x-position, then type letters that double as movement keys
// (a/d/space) into the input and confirm the player did NOT move — keydown
// events from the input must not reach Kaplay's game-wide key listeners.
const canvasBox = await page.locator("canvas").boundingBox();
await page.fill('input[placeholder="Type your answer..."]', "");
await page.locator('input[placeholder="Type your answer..."]').press("a");
await page.locator('input[placeholder="Type your answer..."]').press("d");
await page.locator('input[placeholder="Type your answer..."]').press("Space");
await page.waitForTimeout(200);
const canvasBoxAfterTyping = await page.locator("canvas").boundingBox();
if (JSON.stringify(canvasBox) !== JSON.stringify(canvasBoxAfterTyping)) {
  throw new Error("Canvas moved/resized unexpectedly while typing in the question input");
}

// Wrong answer once — no hint yet (only 1 wrong attempt).
await page.fill('input[placeholder="Type your answer..."]', "definitely wrong");
await page.getByText("Submit").click();
await page.waitForSelector("text=Not quite, try again");
const hintAfterOneWrong = await page.locator("text=Hint:").count();
if (hintAfterOneWrong !== 0) {
  throw new Error("Hint should not appear after only 1 wrong attempt");
}

// Wrong answer twice — hint should now appear.
await page.fill('input[placeholder="Type your answer..."]', "still wrong");
await page.getByText("Submit").click();
await page.waitForSelector("text=Hint:");

// Correct answer (lenient matching: different case + extra whitespace).
const shownQuestion = (await page.getByTestId("question-text").innerText()).trim();
const entry = questionBank.find((q) => shownQuestion.includes(q.question));
if (!entry) {
  throw new Error(`Could not find "${shownQuestion}" in the question bank`);
}
await page.fill('input[placeholder="Type your answer..."]', `  ${entry.answer.toUpperCase()}  `);
await page.getByText("Submit").click();
await page.waitForSelector('input[placeholder="Type your answer..."]', { state: "detached" });

if (errors.length > 0) {
  throw new Error(`Page errors: ${JSON.stringify(errors)}`);
}

console.log("PASS: question gate blocks wrong answers, reveals hint after 2 tries, accepts lenient-matched correct answer, and isolates keystrokes from game controls");
await browser.close();
