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
      });
      kaplayInstance = k;
      k.setGravity(1600);

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
            k.rect(16, 16),
            k.pos(level.playerStart.x, level.playerStart.y),
            k.area(),
            k.body(),
            k.color(...PIXEL_INK),
            "player",
          ]);

          level.photoIds.forEach((photoId, i) => {
            const photo = MEMORY_PHOTOS.find((p) => p.id === photoId)!;
            const [r, g, b] = BG_COLOR_HEX[photo.bg];
            k.add([
              k.rect(14, 14),
              k.pos(60 + i * 160, 210),
              k.area(),
              k.color(r, g, b),
              k.outline(2, k.rgb(...PIXEL_INK)),
              "photo",
            ]);
          });

          const exit = k.add([
            k.rect(16, 24),
            k.pos(level.exit.x, level.exit.y),
            k.area(),
            k.color(255, 243, 196),
            k.outline(2, k.rgb(...PIXEL_INK)),
            "exit",
            { active: false },
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
    <div className="flex flex-col items-center gap-3 py-10">
      <p className="font-pixel text-xs sm:text-sm text-pixel-ink text-center px-4">
        Collect all the memory photos and reach the cake to unlock the invite!
      </p>
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        className="pixel-border-sm"
      />
      <p className="font-body text-xs text-pixel-ink-soft">
        Arrow keys / WASD to move · Space to jump
      </p>
    </div>
  );
}
