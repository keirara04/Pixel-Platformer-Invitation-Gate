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

// Adaptive walker: holds right continuously and, on each ~120ms tick while
// grounded, jumps if a gap or hazard lies within a short lookahead window
// — same technique as scripts/verify-game-playthrough.mjs (blind
// fixed-cadence jumping proved unreliable against real animation-frame
// jitter once levels grew wider than a single screen; see that script's
// comments for the full rationale). DANGER ranges are each level's gaps
// plus its ground hazard, in world x-coordinates — see
// components/game/levels.ts for the source layout.
async function walkThroughDanger(danger, exitX, maxTicks) {
  await page.keyboard.down("ArrowRight");
  let reached = false;
  for (let i = 0; i < maxTicks; i++) {
    const state = await page.evaluate(() => {
      const k = window.__debugK;
      const p = k.get("player")[0];
      return { x: p.pos.x, grounded: p.isGrounded() };
    });
    if (state.grounded) {
      const aheadX = state.x + 55;
      if (danger.some(([s, e]) => aheadX >= s && state.x < e)) {
        await page.keyboard.press("Space");
      }
    }
    if (state.x > exitX) {
      reached = true;
      break;
    }
    await page.waitForTimeout(120);
  }
  await page.keyboard.up("ArrowRight");
  if (!reached) {
    throw new Error(`Did not reach exit zone (x > ${exitX}) within ${maxTicks} ticks`);
  }
}

// Same adaptive jump logic, but for the FINAL level: touching that
// level's exit fires onWin() and React unmounts the kaplay canvas
// immediately, so polling player position afterward would read a frozen
// pre-unmount snapshot forever. Hold right for a fixed, generously
// overprovisioned duration instead of watching for a position threshold.
async function walkToFinalExit(danger, totalTicks) {
  await page.keyboard.down("ArrowRight");
  for (let i = 0; i < totalTicks; i++) {
    const state = await page.evaluate(() => {
      const k = window.__debugK;
      const players = k && k.get ? k.get("player") : [];
      if (!players || !players.length) return null;
      const p = players[0];
      return { x: Math.round(p.pos.x), grounded: p.isGrounded() };
    });
    if (state === null) break;
    if (state.grounded) {
      const aheadX = state.x + 55;
      if (danger.some(([s, e]) => aheadX >= s && state.x < e)) {
        await page.keyboard.press("Space");
      }
    }
    await page.waitForTimeout(120);
  }
  await page.keyboard.up("ArrowRight").catch(() => {});
}

// Level 1 (900px, exit at x=860): flat ground, 1 ground hazard at
// x=700-716.
await walkThroughDanger([[700, 716]], 900, 60);
await answerGate();

// Level 2 (1000px, exit at x=940): 80px gaps at 260-340 and 580-660, plus
// a ground hazard at 90-106.
await walkThroughDanger([[90, 106], [260, 340], [580, 660]], 970, 100);
await answerGate();

// Level 3 (1100px, finale, exit at x=1060): 80px gaps at 240-320, 460-540,
// 720-800 (no hazard on this level). See verify-game-playthrough.mjs for
// why this budget is heavily overprovisioned.
await walkToFinalExit([[240, 320], [460, 540], [720, 800]], 220);
await page.waitForTimeout(1000);

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
