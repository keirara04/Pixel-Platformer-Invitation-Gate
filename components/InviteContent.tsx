"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import PhotoGallery from "@/components/PhotoGallery";
import HudPanel from "@/components/HudPanel";
import TiltCard from "@/components/TiltCard";
import PixelSprite from "@/components/icons/PixelSprite";
import CharacterSprite from "@/components/icons/CharacterSprite";
import ReplayIcon from "@/components/icons/ReplayIcon";
import { setGameCompleted } from "@/lib/gameProgress";
import { totalStarsCollected } from "@/lib/gameStats";
import { useParallaxScroll } from "@/lib/useParallaxScroll";

// Parallax speed multipliers — background layers drift slower than
// foreground ones as the page scrolls, giving a sense of depth.
const PARALLAX_BACKGROUND = 0.05;
const PARALLAX_FOREGROUND = 0.15;
const PARALLAX_HERO_TEXT = 0.03;
const PARALLAX_CHARACTER = 0.02;

// Placeholder invite details — swap these for the real party info.
const GUEST_OF_HONOR = "Nurin";
const AGE_TURNING = 22;
const PARTY_DATE = new Date("2026-07-25T11:00:00");
const PARTY_DATE_ISO = PARTY_DATE.toISOString();
const PARTY_DATE_LABEL = PARTY_DATE.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});
const PARTY_TIME_LABEL = "11:00 AM";
const PARTY_LOCATION = "???";
const DRESS_CODE = "Dark Blue";
const TOTAL_BONUS_STARS = 7;

// Placeholder schedule — swap these for the real run-of-show.
const SCHEDULE: Array<{ time: string; label: string }> = [
  { time: "11:00 AM", label: "Me Pick You Up" },
  { time: "11:30 AM", label: "We go eat brunch" },
  { time: "12:30 PM", label: "Lunch" },
  { time: "1:30 PM", label: "Secret Activity" },
  { time: "8:00 PM", label: "Dinner & Send You Home" },
];

function ordinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0]}`;
}

const HERO_SPRITES: Array<{
  kind: "balloon" | "star" | "spark";
  color: string;
  className: string;
}> = [
  { kind: "balloon", color: "#ff5d8f", className: "top-[8%] left-[6%] animate-float-slow" },
  { kind: "star", color: "#e0d6ff", className: "top-[12%] right-[8%] animate-float-slower" },
  { kind: "spark", color: "#fff3c4", className: "top-[22%] right-[22%] animate-twinkle" },
  { kind: "balloon", color: "#c9f2e0", className: "top-[16%] right-[38%] animate-float-slower" },
  { kind: "star", color: "#ffe0c2", className: "bottom-[18%] left-[10%] animate-float-slow" },
  { kind: "spark", color: "#ff5d8f", className: "bottom-[26%] right-[14%] animate-twinkle" },
  { kind: "star", color: "#fff3c4", className: "top-[30%] left-[20%] animate-float-slower" },
  { kind: "spark", color: "#c9f2e0", className: "bottom-[34%] left-[30%] animate-twinkle" },
];

const AMBIENT_SPARKS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  delay: `${(i % 5) * 0.5}s`,
  color: [
    "#ff5d8f",
    "#e0d6ff",
    "#fff3c4",
    "#c9f2e0",
    "#ffe0c2",
  ][i % 5],
}));

function SectionDivider() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-pixel-ink-soft/40"
          style={{ opacity: i % 2 === 0 ? 1 : 0.4 }}
        />
      ))}
    </div>
  );
}

type RsvpState = "initial" | "confirmNo" | "forcedYes" | "confirmed";

const NO_BUTTON_LABEL: Record<Exclude<RsvpState, "confirmed">, string> = {
  initial: "No",
  confirmNo: "Are you sure?",
  forcedYes: "Yes I'm sure I will come!",
};

export default function InviteContent({ onReplay }: { onReplay: () => void }) {
  const [starsFound, setStarsFound] = useState(0);
  const [rsvp, setRsvp] = useState<RsvpState>("initial");
  const scrollY = useParallaxScroll();

  useEffect(() => {
    setStarsFound(totalStarsCollected());
  }, []);

  function handleNoClick() {
    setRsvp((current) =>
      current === "initial" ? "confirmNo" : current === "confirmNo" ? "forcedYes" : "confirmed"
    );
  }

  return (
    <main className="relative flex-1">
      {/* Ambient sparkle layer — spans the whole page behind every section */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
        style={{ transform: `translateY(${-scrollY * PARALLAX_BACKGROUND}px)` }}
        aria-hidden
      >
        {AMBIENT_SPARKS.map((spark) => (
          <span
            key={spark.id}
            className="absolute animate-twinkle"
            style={{ left: spark.left, top: spark.top, animationDelay: spark.delay }}
          >
            <PixelSprite kind="spark" color={spark.color} size={14} />
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-12 px-4 pb-16 text-center">
        {/* Hero — fills the viewport for a big entrance */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center gap-5">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ transform: `translateY(${-scrollY * PARALLAX_FOREGROUND}px)` }}
            aria-hidden
          >
            {HERO_SPRITES.map((sprite, i) => (
              <span
                key={i}
                className={`pointer-events-none absolute select-none ${sprite.className}`}
              >
                <PixelSprite kind={sprite.kind} color={sprite.color} size={32} />
              </span>
            ))}
          </div>

          <div
            style={{ transform: `translateY(${-scrollY * PARALLAX_CHARACTER}px)` }}
          >
            <TiltCard maxTilt={12}>
              <CharacterSprite size={104} />
            </TiltCard>
          </div>

          <div
            className="flex flex-col items-center gap-5"
            style={{ transform: `translateY(${-scrollY * PARALLAX_HERO_TEXT}px)` }}
          >
            <p className="font-hud text-lg sm:text-2xl tracking-[0.3em] text-pixel-accent drop-shadow-[0_0_10px_rgba(255,93,143,0.5)]">
              &gt;&gt; ACHIEVEMENT UNLOCKED
              <span className="animate-blink">_</span>
            </p>
            <h1 className="font-pixel text-3xl sm:text-5xl leading-relaxed text-pixel-ink">
              {GUEST_OF_HONOR}&apos;s
              <br />
              {ordinal(AGE_TURNING)} Birthday
            </h1>
            <p className="font-body text-sm sm:text-base text-pixel-ink-soft max-w-xs">
              You&apos;ve been selected for a very important quest. Scroll down for your mission briefing.
            </p>
          </div>

          <span className="absolute bottom-10 flex flex-col items-center gap-2 animate-float-slow">
            <span className="font-pixel text-[10px] text-pixel-ink-soft tracking-widest">
              SCROLL
            </span>
            <PixelSprite kind="spark" color="#7a6b82" size={18} className="rotate-180" />
          </span>
        </section>

        <TiltCard className="w-full">
          <HudPanel bg="peach" className="w-full">
            <p className="font-hud text-sm tracking-[0.2em] text-pixel-ink-soft mb-3">
              MISSION BRIEFING
            </p>
            <div className="flex flex-col gap-3 font-body text-sm sm:text-base">
              <p className="flex items-baseline gap-2">
                <span className="font-pixel text-[10px] text-pixel-ink-soft whitespace-nowrap">
                  DATE
                </span>
                <span>{PARTY_DATE_LABEL}</span>
              </p>
              <p className="flex items-baseline gap-2">
                <span className="font-pixel text-[10px] text-pixel-ink-soft whitespace-nowrap">
                  TIME
                </span>
                <span>{PARTY_TIME_LABEL}</span>
              </p>
              <p className="flex items-baseline gap-2">
                <span className="font-pixel text-[10px] text-pixel-ink-soft whitespace-nowrap">
                  LOC
                </span>
                <span>{PARTY_LOCATION}</span>
              </p>
              <p className="flex items-baseline gap-2">
                <span className="font-pixel text-[10px] text-pixel-ink-soft whitespace-nowrap">
                  GEAR
                </span>
                <span>{DRESS_CODE}</span>
              </p>
            </div>
          </HudPanel>
        </TiltCard>

        <SectionDivider />

        <TiltCard className="w-full">
          <HudPanel bg="lavender" className="w-full">
            <p className="font-hud text-sm tracking-[0.2em] text-pixel-ink-soft mb-3">
              QUEST SCHEDULE
            </p>
            <div className="flex flex-col gap-2 font-body text-sm sm:text-base">
              {SCHEDULE.map((item) => (
                <div key={item.label} className="flex items-baseline justify-between gap-4">
                  <span className="font-pixel text-[10px] text-pixel-ink-soft whitespace-nowrap">
                    {item.time}
                  </span>
                  <span className="flex-1 text-right">{item.label}</span>
                </div>
              ))}
            </div>
          </HudPanel>
        </TiltCard>

        <SectionDivider />

        <TiltCard className="w-full">
          <HudPanel bg="mint" className="w-full">
            <p className="font-hud text-sm tracking-[0.2em] text-pixel-ink-soft mb-3">
              WILL YOU JOIN THE QUEST?
            </p>
            {rsvp === "confirmed" ? (
              <p className="font-pixel text-sm text-pixel-ink">
                Yay! Can&apos;t wait to see you there!
              </p>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setRsvp("confirmed")}
                  className="pixel-btn bg-pixel-accent font-pixel text-xs text-pixel-bg px-4 py-2 cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={handleNoClick}
                  className="pixel-btn bg-white font-pixel text-xs text-pixel-ink px-4 py-2 cursor-pointer"
                >
                  {NO_BUTTON_LABEL[rsvp]}
                </button>
              </div>
            )}
          </HudPanel>
        </TiltCard>

        <SectionDivider />

        <section className="w-full flex flex-col items-center gap-4">
          <h2 className="font-pixel text-base sm:text-lg text-pixel-ink">
            Next Level Starts In
          </h2>
          <TiltCard className="w-full">
            <HudPanel bg="white" className="w-full">
              <CountdownTimer targetDate={PARTY_DATE_ISO} />
            </HudPanel>
          </TiltCard>
        </section>

        <SectionDivider />

        <section className="w-full flex flex-col items-center gap-4">
          <h2 className="font-pixel text-base sm:text-lg text-pixel-ink">
            Collected Memories
          </h2>
          <TiltCard className="w-full">
            <div className="pixel-border bg-white w-full p-4 sm:p-5">
              <PhotoGallery />
            </div>
          </TiltCard>
        </section>

        <section className="w-full flex flex-col items-center gap-2">
          <p className="font-pixel text-[10px] sm:text-xs text-pixel-ink-soft tracking-wide">
            BONUS STARS
          </p>
          <div className="flex gap-1.5" aria-label={`${starsFound} of ${TOTAL_BONUS_STARS} stars found`}>
            {Array.from({ length: TOTAL_BONUS_STARS }).map((_, i) => (
              <PixelSprite
                key={i}
                kind="star"
                color={i < starsFound ? "#ff5d8f" : "#e6dfe8"}
                size={18}
              />
            ))}
          </div>
          <p className="font-body text-xs text-pixel-ink-soft">
            {starsFound}/{TOTAL_BONUS_STARS} found
          </p>
        </section>

        <button
          onClick={() => {
            setGameCompleted(false);
            onReplay();
          }}
          className="pixel-btn bg-pixel-butter font-body text-xs text-pixel-ink px-4 py-2 flex items-center gap-2 cursor-pointer"
        >
          <ReplayIcon size={14} />
          Replay Level 1
        </button>
      </div>
    </main>
  );
}
