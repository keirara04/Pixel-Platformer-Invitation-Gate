import { chromium } from "playwright-core";
import { execSync } from "child_process";
import { readFileSync } from "fs";

// Questions are picked randomly from the bank each playthrough, so instead
// of assuming which 2 appear, read the whole bank and look up whichever
// question is actually displayed.
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
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));

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
// grounded, jumps if a gap or hazard lies within a short lookahead window.
// This reads live player position from the debug hook exposed on
// window.__debugK (see components/game/PixelGame.tsx) rather than guessing
// fixed jump timing — blind periodic-jump timing proved unreliable against
// real animation-frame jitter (a jump could resonate with a hazard's exact
// position and fail nearly every attempt). DANGER ranges are each level's
// gaps between platforms plus its ground hazard, in world x-coordinates —
// see components/game/levels.ts for the source layout.
async function walkThroughDanger(danger, exitX, maxTicks) {
  await page.keyboard.down("ArrowRight");
  let reached = false;
  const log = [];
  for (let i = 0; i < maxTicks; i++) {
    const state = await page.evaluate(() => {
      const k = window.__debugK;
      const p = k.get("player")[0];
      return { x: Math.round(p.pos.x), y: Math.round(p.pos.y), grounded: p.isGrounded() };
    });
    log.push(state);
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
    if (process.env.DEBUG_PLAYTHROUGH) console.log("last 20 states:", JSON.stringify(log.slice(-20)));
    throw new Error(`Did not reach exit zone (x > ${exitX}) within ${maxTicks} ticks`);
  }
}

// Same adaptive jump logic as walkThroughDanger, but for the FINAL level:
// touching that level's exit fires onWin() and React unmounts the kaplay
// canvas immediately, so polling player position afterward would read a
// frozen pre-unmount snapshot forever (window.__debugK.get("player") stops
// updating once the instance is torn down). Instead of watching for a
// position threshold, hold right for a fixed duration long enough to
// cross the exit at full walking speed, and stop reading state as soon as
// the player object disappears (win already happened, canvas is gone).
async function walkToFinalExit(danger, totalTicks) {
  await page.keyboard.down("ArrowRight");
  const log = [];
  let wonEarly = false;
  for (let i = 0; i < totalTicks; i++) {
    const state = await page.evaluate(() => {
      const k = window.__debugK;
      const players = k && k.get ? k.get("player") : [];
      if (!players || !players.length) return null;
      const p = players[0];
      return { x: Math.round(p.pos.x), y: Math.round(p.pos.y), grounded: p.isGrounded() };
    });
    if (state === null) {
      wonEarly = true;
      break;
    }
    log.push(state);
    if (state.grounded) {
      const aheadX = state.x + 55;
      if (danger.some(([s, e]) => aheadX >= s && state.x < e)) {
        await page.keyboard.press("Space");
      }
    }
    await page.waitForTimeout(120);
  }
  await page.keyboard.up("ArrowRight").catch(() => {});
  if (process.env.DEBUG_PLAYTHROUGH) {
    console.log("walkToFinalExit wonEarly:", wonEarly, "last 15 states:", JSON.stringify(log.slice(-15)));
  }
}

// Exit thresholds are set past the exit hitbox's far edge (exit.x + 16),
// not just before it — stopping/releasing input too early can leave the
// player short of actually touching the exit collider.

// Level 1 (900px, exit at x=860): flat ground, 1 ground hazard at
// x=700-716. Enemy and moving platform are elevated off the ground path,
// not a danger zone.
await walkThroughDanger([[700, 716]], 900, 60);
await answerGate();

// Level 2 (1000px, exit at x=940): 80px gaps at 260-340 and 580-660, plus
// a ground hazard at 90-106.
await walkThroughDanger([[90, 106], [260, 340], [580, 660]], 970, 100);
await answerGate();

// Level 3 (1100px, finale, exit at x=1060): 80px gaps at 240-320, 460-540,
// 720-800 (no hazard on this level). 220 ticks * 120ms = 26.4s nominal —
// heavily overprovisioned, since per-tick Playwright/eval overhead has
// proven to eat noticeably more real time than the nominal budget alone
// would suggest, and this budget has needed repeated increases to reach
// consistent passes (observed progress well short of the ~5.3s of
// continuous walking that would otherwise be enough to cross from
// playerStart at x=20 to beyond the exit at full speed, 200px/s).
await walkToFinalExit([[240, 320], [460, 540], [720, 800]], 220);
await page.waitForTimeout(1000);

// Winning now leads to the love letter, not straight to the invite.
await page.waitForSelector("text=Click to open");
await page.getByLabel("Open the letter").click();
await page.waitForSelector("text=Continue", { timeout: 10000 });
await page.getByText("Continue").click();

const invited = await page.locator("text=ACHIEVEMENT UNLOCKED").count();
const flag = await page.evaluate(() => localStorage.getItem("pixel-invite-game-completed"));

if (errors.length > 0) {
  throw new Error(`Console/page errors during playthrough: ${JSON.stringify(errors)}`);
}
if (invited === 0 || flag !== "true") {
  throw new Error("Playthrough failed: did not reach the invite / win did not fire");
}

console.log("PASS: full playthrough completed, both question gates answered, letter opened, all 3 levels cleared, win fired");
await browser.close();
