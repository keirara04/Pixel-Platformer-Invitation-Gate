"use client";

import { useEffect, useState } from "react";
import { playLevelComplete } from "@/components/game/sfx";

// Placeholder — replace with your real message. This is the moment she's
// been playing toward, so make it count.
const LETTER_MESSAGE =
  "PLACEHOLDER: write your real message here. This is the letter she opens after finishing the game — say whatever you want her to read in this moment.";

export default function LoveLetter({ onContinue }: { onContinue: () => void }) {
  const [opened, setOpened] = useState(false);
  const [revealedChars, setRevealedChars] = useState(0);

  useEffect(() => {
    if (!opened || revealedChars >= LETTER_MESSAGE.length) return;
    const timer = setTimeout(() => setRevealedChars((n) => n + 1), 20);
    return () => clearTimeout(timer);
  }, [opened, revealedChars]);

  const isTyping = opened && revealedChars < LETTER_MESSAGE.length;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-pixel-ink px-4 text-center">
      {!opened ? (
        <button
          onClick={() => {
            playLevelComplete();
            setOpened(true);
          }}
          className="flex flex-col items-center gap-3 cursor-pointer"
          aria-label="Open the letter"
        >
          <img
            src="/images/envelope-closed.png"
            alt=""
            width={192}
            height={160}
            style={{ imageRendering: "pixelated" }}
          />
          <span className="font-hud text-lg tracking-[0.2em] text-pixel-accent animate-blink">
            Click to open
          </span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-6 max-w-lg">
          <img
            src="/images/envelope-open.png"
            alt=""
            width={192}
            height={160}
            style={{ imageRendering: "pixelated" }}
          />
          <p className="font-body text-base text-pixel-bg min-h-[6rem]">
            {LETTER_MESSAGE.slice(0, revealedChars)}
            {isTyping && <span className="animate-blink">_</span>}
          </p>
          {!isTyping && (
            <button
              onClick={onContinue}
              className="pixel-btn bg-pixel-accent text-pixel-bg font-pixel text-xs px-6 py-3 cursor-pointer"
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}
