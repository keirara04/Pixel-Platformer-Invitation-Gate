"use client";

import CharacterSprite from "@/components/icons/CharacterSprite";
import PixelSprite from "@/components/icons/PixelSprite";

const SPRITES: Array<{
  kind: "balloon" | "star" | "spark";
  color: string;
  className: string;
}> = [
  { kind: "balloon", color: "#ff5d8f", className: "top-[10%] left-[8%] animate-float-slow" },
  { kind: "star", color: "#e0d6ff", className: "top-[14%] right-[10%] animate-float-slower" },
  { kind: "spark", color: "#fff3c4", className: "bottom-[16%] left-[16%] animate-twinkle" },
  { kind: "spark", color: "#c9f2e0", className: "bottom-[20%] right-[14%] animate-twinkle" },
];

export default function WelcomeContent({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-pixel-ink px-4 text-center overflow-hidden">
      {SPRITES.map((sprite, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute select-none ${sprite.className}`}
        >
          <PixelSprite kind={sprite.kind} color={sprite.color} size={28} />
        </span>
      ))}

      <p className="font-hud text-lg sm:text-xl tracking-[0.3em] text-pixel-accent">
        &gt;&gt; YOU HAVE BEEN INVITED
      </p>

      <CharacterSprite size={88} />

      <h1 className="font-pixel text-xl sm:text-3xl leading-relaxed text-pixel-bg max-w-sm">
        A special quest awaits
      </h1>

      <p className="font-body text-sm sm:text-base text-pixel-bg/70 max-w-xs">
        Pick a character, play a short level, and unlock a special invitation.
      </p>

      <button
        onClick={onStart}
        className="pixel-btn font-pixel text-xs px-6 py-3 bg-pixel-accent text-pixel-bg cursor-pointer"
      >
        Start
      </button>
    </div>
  );
}
