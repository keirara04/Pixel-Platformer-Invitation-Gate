"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import PhotoGallery from "@/components/PhotoGallery";
import HudPanel from "@/components/HudPanel";
import PixelSprite from "@/components/icons/PixelSprite";
import CharacterSprite from "@/components/icons/CharacterSprite";
import ReplayIcon from "@/components/icons/ReplayIcon";
import { setGameCompleted } from "@/lib/gameProgress";
import { totalStarsCollected } from "@/lib/gameStats";

// Placeholder invite details — swap these for the real party info.
const GUEST_OF_HONOR = "Nurin";
const AGE_TURNING = 22;
const PARTY_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
const PARTY_DATE_ISO = PARTY_DATE.toISOString();
const PARTY_DATE_LABEL = PARTY_DATE.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});
const PARTY_TIME_LABEL = "11:00 AM";
const PARTY_LOCATION = "MRT Bandar Tun Hussein Onn (SBK29) Station, Cheras, Kuala Lumpur, Malaysia";
const TOTAL_BONUS_STARS = 7;

function ordinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0]}`;
}

const SPRITES: Array<{
  kind: "balloon" | "star" | "spark";
  color: string;
  className: string;
}> = [
  { kind: "balloon", color: "#ff5d8f", className: "-top-4 left-0 animate-float-slow" },
  { kind: "star", color: "#e0d6ff", className: "-top-4 right-0 animate-float-slower" },
  { kind: "spark", color: "#fff3c4", className: "-top-8 right-1/3 animate-twinkle" },
];

export default function InviteContent({ onReplay }: { onReplay: () => void }) {
  const [starsFound, setStarsFound] = useState(0);

  useEffect(() => {
    setStarsFound(totalStarsCollected());
  }, []);

  return (
    <main className="relative flex-1 px-4 py-12 sm:py-16">
      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-10 text-center">
        <section className="relative w-full flex flex-col items-center gap-4 pt-2">
          {SPRITES.map((sprite, i) => (
            <span
              key={i}
              className={`pointer-events-none absolute select-none ${sprite.className}`}
            >
              <PixelSprite kind={sprite.kind} color={sprite.color} size={28} />
            </span>
          ))}
          <CharacterSprite size={72} />
          <p className="font-hud text-lg sm:text-xl tracking-[0.3em] text-pixel-accent">
            &gt;&gt; ACHIEVEMENT UNLOCKED
            <span className="animate-blink">_</span>
          </p>
          <h1 className="font-pixel text-2xl sm:text-4xl leading-relaxed text-pixel-ink">
            {GUEST_OF_HONOR}&apos;s
            <br />
            {ordinal(AGE_TURNING)} Birthday
          </h1>
        </section>

        <HudPanel bg="peach" className="w-full">
          <p className="font-hud text-sm tracking-[0.2em] text-pixel-ink-soft mb-3">
            MISSION BRIEFING
          </p>
          <div className="flex flex-col gap-2 font-body text-sm sm:text-base">
            <p>
              <span className="font-pixel text-[10px] block mb-1 text-pixel-ink-soft">
                DATE
              </span>
              {PARTY_DATE_LABEL}
            </p>
            <p>
              <span className="font-pixel text-[10px] block mb-1 text-pixel-ink-soft">
                TIME
              </span>
              {PARTY_TIME_LABEL}
            </p>
            <p>
              <span className="font-pixel text-[10px] block mb-1 text-pixel-ink-soft">
                LOCATION
              </span>
              {PARTY_LOCATION}
            </p>
          </div>
        </HudPanel>

        <section className="w-full flex flex-col items-center gap-3">
          <h2 className="font-pixel text-sm sm:text-base">Next Level Starts In</h2>
          <CountdownTimer targetDate={PARTY_DATE_ISO} />
        </section>

        <section className="w-full flex flex-col items-center gap-3">
          <h2 className="font-pixel text-sm sm:text-base">Collected Memories</h2>
          <PhotoGallery />
        </section>

        <section className="w-full flex flex-col items-center gap-2">
          <p className="font-pixel text-[10px] sm:text-xs text-pixel-ink-soft">
            ⭐ {starsFound}/{TOTAL_BONUS_STARS} stars found
          </p>
        </section>

        <button
          onClick={() => {
            setGameCompleted(false);
            onReplay();
          }}
          className="font-body text-xs text-pixel-ink-soft underline cursor-pointer"
        >
          <ReplayIcon size={14} />
          Replay Level 1
        </button>
      </div>
    </main>
  );
}
