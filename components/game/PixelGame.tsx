// components/game/PixelGame.tsx
"use client";

import { useEffect, useRef } from "react";
import { LEVELS } from "@/components/game/levels";
import { MEMORY_PHOTOS } from "@/components/photos";

const PIXEL_INK = [74, 59, 82] as const;
const BG_COLOR_HEX: Record<string, [number, number, number]> = {
  "bg-pixel-pink": [255, 214, 232],
  "bg-pixel-mint": [201, 242, 224],
  "bg-pixel-lavender": [224, 214, 255],
  "bg-pixel-butter": [255, 243, 196],
  "bg-pixel-peach": [255, 224, 194],
};

export default function PixelGame({ onWin }: { onWin: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      k.setGravity(1600);

      // Kaplay renders sprites once their async load resolves — safe to
      // start the game immediately without awaiting these.
      MEMORY_PHOTOS.forEach((photo) => {
        k.loadSprite(`photo-${photo.id}`, photo.src);
      });
      k.loadSprite("player", "/images/character.png");

      LEVELS.forEach((level, index) => {
        k.scene(`level${index}`, () => {
          let collected = 0;
          const photosNeeded = level.photoIds.length;

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

          const player = k.add([
            k.sprite("player", { width: 18, height: 30 }),
            k.pos(level.playerStart.x, level.playerStart.y),
            k.area(),
            k.body(),
            "player",
          ]);

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
            if (player.isGrounded()) player.jump(560);
          });

          player.onUpdate(() => {
            // Fell into a gap below the ground line — respawn at level start.
            if (player.pos.y > 300) {
              player.pos = k.vec2(level.playerStart.x, level.playerStart.y);
            }
          });

          player.onCollide("photo", (photoObj) => {
            k.destroy(photoObj);
            collected++;
            if (collected === photosNeeded) {
              exit.active = true;
              exit.color = k.rgb(201, 242, 224);
            }
          });

          player.onCollide("exit", () => {
            if (!exit.active) return;
            if (index < LEVELS.length - 1) {
              k.go(`level${index + 1}`);
            } else {
              onWin();
            }
          });
        });
      });

      k.go("level0");
    });

    return () => {
      destroyed = true;
      kaplayInstance?.quit();
    };
  }, [onWin]);

  return (
    <div className="fixed inset-0 flex flex-col bg-pixel-ink overflow-hidden">
      <p className="font-pixel text-[10px] sm:text-xs text-pixel-bg text-center px-4 py-3">
        Collect all the memory and reach the cake to unlock next checkpoint!
      </p>
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        className="flex-1 w-full min-h-0"
        style={{ imageRendering: "pixelated" }}
      />
      <p className="font-body text-xs text-pixel-bg text-center py-3">
        Arrow keys / WASD to move · Space to jump
      </p>
    </div>
  );
}
