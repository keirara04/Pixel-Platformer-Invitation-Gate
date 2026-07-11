// components/game/PixelGame.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { LEVELS } from "@/components/game/levels";
import type { MovingPlatform, Hazard, Enemy, BonusStar } from "@/components/game/levels";
import { MEMORY_PHOTOS } from "@/components/photos";
import QuestionGate from "@/components/game/QuestionGate";
import { pickGateQuestions } from "@/components/game/questions";
import { playJump, playCollect, playLevelComplete, playWin } from "@/components/game/sfx";
import { collectStar, getBestTime, recordTime } from "@/lib/gameStats";

const PIXEL_INK = [74, 59, 82] as const;
const BG_COLOR_HEX: Record<string, [number, number, number]> = {
  "bg-pixel-pink": [255, 214, 232],
  "bg-pixel-mint": [201, 242, 224],
  "bg-pixel-lavender": [224, 214, 255],
  "bg-pixel-butter": [255, 243, 196],
  "bg-pixel-peach": [255, 224, 194],
};

// One distinct sky per level so the 3 levels read as a little journey
// (morning -> hills -> dusk) instead of a repeated flat backdrop.
const SKY_COLORS: [number, number, number][] = [
  [214, 234, 255],
  [255, 224, 214],
  [232, 214, 255],
];

type KaplayCtx = Awaited<ReturnType<typeof import("kaplay").default>>;

function addScenery(k: KaplayCtx, levelIndex: number, levelWidth: number) {
  const [r, g, b] = SKY_COLORS[levelIndex] ?? SKY_COLORS[0];
  k.add([k.rect(levelWidth, 270), k.pos(0, 0), k.color(r, g, b), k.z(-100)]);

  // Drifting clouds for the two daytime levels.
  if (levelIndex < 2) {
    const cloudCount = Math.max(3, Math.round(levelWidth / 160));
    for (let i = 0; i < cloudCount; i++) {
      const cloud = k.add([
        k.rect(36, 14),
        k.pos(60 + i * 160, 24 + (i % 2) * 20),
        k.color(255, 255, 255),
        k.opacity(0.85),
        k.z(-90),
      ]);
      cloud.onUpdate(() => {
        cloud.pos.x += 6 * k.dt();
        if (cloud.pos.x > levelWidth) cloud.pos.x = -40;
      });
    }
  }

  // Soft hill silhouette for level 2.
  if (levelIndex === 1) {
    k.add([k.rect(levelWidth, 40), k.pos(0, 200), k.color(201, 242, 224), k.z(-80)]);
  }

  // Stars for the dusk-toned final level.
  if (levelIndex === 2) {
    const starCount = Math.max(12, Math.round(levelWidth / 40));
    for (let i = 0; i < starCount; i++) {
      k.add([
        k.rect(2, 2),
        k.pos(Math.random() * levelWidth, Math.random() * 150),
        k.color(255, 243, 196),
        k.z(-90),
      ]);
    }
  }
}

function addMovingPlatform(k: KaplayCtx, mp: MovingPlatform) {
  const startX = mp.x;
  const startY = mp.y;
  const plat = k.add([
    k.rect(mp.w, mp.h),
    k.pos(startX, startY),
    k.area(),
    k.body({ isStatic: true }),
    k.color(224, 214, 255),
    k.outline(2, k.rgb(...PIXEL_INK)),
    "movingPlatform",
    { dir: 1 },
  ]);

  // The player rides this via kaplay's native static-body carry behavior
  // (stickToPlatform) — no manual delta tracking/application needed here.
  plat.onUpdate(() => {
    const traveled = mp.axis === "x" ? plat.pos.x - startX : plat.pos.y - startY;
    if (Math.abs(traveled) >= mp.range) {
      plat.dir *= -1;
    }
    if (mp.axis === "x") {
      plat.pos.x += plat.dir * mp.speed * k.dt();
    } else {
      plat.pos.y += plat.dir * mp.speed * k.dt();
    }
  });
}

function addHazard(k: KaplayCtx, h: Hazard) {
  k.add([
    k.sprite("hazard", { width: h.w, height: h.h }),
    k.pos(h.x, h.y),
    k.area(),
    "hazard",
  ]);
}

function addEnemy(k: KaplayCtx, e: Enemy) {
  const enemy = k.add([
    k.sprite("enemy", { width: 16, height: 16 }),
    k.pos(e.x, e.y),
    k.area(),
    "enemy",
    { dir: 1 },
  ]);
  enemy.onUpdate(() => {
    if (enemy.pos.x >= e.patrolTo) enemy.dir = -1;
    if (enemy.pos.x <= e.patrolFrom) enemy.dir = 1;
    enemy.pos.x += enemy.dir * e.speed * k.dt();
    enemy.flipX = enemy.dir < 0;
  });
}

function addBonusStar(k: KaplayCtx, s: BonusStar) {
  k.add([
    k.sprite("star", { width: 10, height: 10 }),
    k.pos(s.x, s.y),
    k.area(),
    "bonusStar",
    { starId: s.id },
  ]);
}

export default function PixelGame({
  onWin,
  characterSrc,
}: {
  onWin: () => void;
  characterSrc: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pendingGate, setPendingGate] = useState<{
    afterLevelIndex: number;
    resume: () => void;
  } | null>(null);
  // Picked once when this component mounts (i.e. once per playthrough —
  // PixelGame remounts fresh each time she starts or replays), so the pair
  // of questions is randomized per session but stable during it.
  const [gateQuestions] = useState(() => pickGateQuestions());

  useEffect(() => {
    let destroyed = false;
    let kaplayInstance: { quit: () => void } | null = null;

    import("kaplay").then(({ default: kaplay }) => {
      if (destroyed || !canvasRef.current) return;

      const k = kaplay({
        canvas: canvasRef.current,
        width: 480,
        height: 270,
        background: [255, 250, 245],
        global: false,
        stretch: true,
        letterbox: true,
      });
      kaplayInstance = k;
      // Exposed only outside production so the e2e scripts (scripts/verify-*.mjs)
      // can read live player position/grounded state — real gameplay timing
      // (jump arcs, moving platforms) is too jitter-sensitive for fixed-delay
      // scripting, so those scripts poll this instead of guessing keypress timing.
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __debugK?: unknown }).__debugK = k;
      }
      k.setGravity(1600);

      // Kaplay renders sprites once their async load resolves — safe to
      // start the game immediately without awaiting these.
      MEMORY_PHOTOS.forEach((photo) => {
        k.loadSprite(`photo-${photo.id}`, photo.src);
      });
      k.loadSprite("player", characterSrc);
      k.loadSprite("hazard", "/images/hazard.png");
      k.loadSprite("enemy", "/images/enemy.png");
      k.loadSprite("star", "/images/star.png");

      LEVELS.forEach((level, index) => {
        k.scene(`level${index}`, () => {
          let collected = 0;
          let elapsed = 0;
          const photosNeeded = level.photoIds.length;

          addScenery(k, index, level.width);

          level.platforms.forEach((p) => {
            k.add([
              k.rect(p.w, p.h),
              k.pos(p.x, p.y),
              k.area(),
              k.body({ isStatic: true }),
              k.color(255, 224, 194),
              k.outline(2, k.rgb(...PIXEL_INK)),
            ]);
          });

          (level.movingPlatforms ?? []).forEach((mp) => addMovingPlatform(k, mp));

          (level.hazards ?? []).forEach((h) => addHazard(k, h));

          (level.enemies ?? []).forEach((e) => addEnemy(k, e));

          (level.bonusStars ?? []).forEach((s) => addBonusStar(k, s));

          const player = k.add([
            k.sprite("player", { width: 18, height: 30 }),
            k.pos(level.playerStart.x, level.playerStart.y),
            k.area(),
            k.body(),
            k.scale(1),
            "player",
          ]);

          player.onUpdate(() => {
            const halfScreen = 240;
            const camX = Math.min(
              Math.max(player.pos.x, halfScreen),
              Math.max(level.width - halfScreen, halfScreen)
            );
            k.camPos(camX, 135);
          });

          level.photoIds.forEach((photoId, i) => {
            const photo = MEMORY_PHOTOS.find((p) => p.id === photoId)!;
            const [r, g, b] = BG_COLOR_HEX[photo.bg];
            // Pastel backing square shows through while the sprite loads
            // and behind any transparent areas of the source image.
            k.add([
              k.rect(14, 20),
              k.pos(60 + i * 160, 214),
              k.color(r, g, b),
              k.outline(2, k.rgb(...PIXEL_INK)),
            ]);
            k.add([
              k.sprite(`photo-${photoId}`, { width: 14, height: 20 }),
              k.pos(60 + i * 160, 214),
              k.area(),
              "photo",
            ]);
          });

          const exit = k.add([
            k.rect(16, 40),
            k.pos(level.exit.x, level.exit.y),
            k.area(),
            k.color(255, 243, 196),
            k.outline(2, k.rgb(...PIXEL_INK)),
            "exit",
            { active: false },
          ]);

          k.add([
            k.text("🎂", { size: 16 }),
            k.pos(level.exit.x, level.exit.y - 4),
            k.anchor("topleft"),
          ]);

          k.onKeyDown("left", () => player.move(-200, 0));
          k.onKeyDown("a", () => player.move(-200, 0));
          k.onKeyDown("right", () => player.move(200, 0));
          k.onKeyDown("d", () => player.move(200, 0));
          k.onKeyPress("space", () => {
            if (player.isGrounded()) {
              player.jump(560);
              playJump();
              // Squash-and-stretch: a subtle stretch on takeoff, settling
              // back quickly — kept small so it doesn't meaningfully
              // distort the collision box mid-jump.
              k.tween(k.vec2(0.92, 1.08), k.vec2(1, 1), 0.15, (v) => {
                player.scale = v;
              });
            }
          });

          function respawnPlayer() {
            player.pos = k.vec2(level.playerStart.x, level.playerStart.y);
          }

          k.onUpdate(() => {
            elapsed += k.dt();
          });

          // Best time as of the start of this attempt — a static snapshot
          // (not live-updated mid-run) is enough to give the player a
          // target to beat without extra transition-screen work.
          const bestAtStart = getBestTime(index);
          const timerLabel = k.add([
            k.text("0.0s", { size: 10 }),
            k.pos(8, 8),
            k.fixed(),
            k.z(100),
            k.color(255, 250, 245),
          ]);
          timerLabel.onUpdate(() => {
            timerLabel.text =
              bestAtStart !== null
                ? `${elapsed.toFixed(1)}s (best ${bestAtStart.toFixed(1)}s)`
                : `${elapsed.toFixed(1)}s`;
          });

          player.onUpdate(() => {
            // Fell into a gap below the ground line — respawn at level start.
            if (player.pos.y > 300) {
              respawnPlayer();
            }
          });

          player.onCollide("photo", (photoObj) => {
            k.destroy(photoObj);
            k.addKaboom(photoObj.pos, { scale: 0.4 });
            playCollect();
            collected++;
            if (collected === photosNeeded) {
              exit.active = true;
              exit.color = k.rgb(201, 242, 224);
              k.shake(6);
              playLevelComplete();
            }
          });

          player.onCollide("exit", () => {
            if (!exit.active) return;
            recordTime(index, elapsed);
            if (index < LEVELS.length - 1) {
              const nextScene = `level${index + 1}`;
              setPendingGate({
                afterLevelIndex: index,
                resume: () => k.go(nextScene),
              });
            } else {
              k.shake(12);
              k.addKaboom(exit.pos, { scale: 1.2 });
              playWin();
              onWin();
            }
          });

          player.onCollide("hazard", () => {
            respawnPlayer();
          });

          player.onCollide("enemy", () => {
            respawnPlayer();
          });

          player.onCollide("bonusStar", (starObj) => {
            k.destroy(starObj);
            k.addKaboom(starObj.pos, { scale: 0.3 });
            playCollect();
            collectStar(starObj.starId);
          });
        });
      });

      k.go("level0");
      canvasRef.current?.focus();
    });

    return () => {
      destroyed = true;
      kaplayInstance?.quit();
    };
  }, [onWin, characterSrc]);

  return (
    <div className="fixed inset-0 flex flex-col bg-pixel-ink overflow-hidden">
      {pendingGate && (
        <QuestionGate
          question={gateQuestions[pendingGate.afterLevelIndex]}
          characterSrc={characterSrc}
          onCorrect={() => {
            pendingGate.resume();
            setPendingGate(null);
            // The question's text input held keyboard focus — reclaim it
            // for the canvas so movement keys work again without a click.
            canvasRef.current?.focus();
          }}
        />
      )}
      <p className="font-pixel text-[10px] sm:text-xs text-pixel-bg text-center px-4 py-3">
        Collect all the memory and reach the cake to unlock next checkpoint!
      </p>
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        tabIndex={-1}
        className="flex-1 w-full min-h-0 focus:outline-none"
        style={{ imageRendering: "pixelated" }}
      />
      <p className="font-body text-xs text-pixel-bg text-center py-3">
        Arrow keys / WASD to move · Space to jump
      </p>
    </div>
  );
}
