"use client";

import CountdownTimer from "@/components/CountdownTimer";
import PhotoGallery from "@/components/PhotoGallery";
import MusicToggle from "@/components/MusicToggle";
import PixelCard from "@/components/PixelCard";
import { setGameCompleted } from "@/lib/gameProgress";

// Placeholder invite details — swap these for the real party info.
const GUEST_OF_HONOR = "Alex";
const AGE_TURNING = 10;
const PARTY_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
const PARTY_DATE_ISO = PARTY_DATE.toISOString();
const PARTY_DATE_LABEL = PARTY_DATE.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});
const PARTY_TIME_LABEL = "3:00 PM";
const PARTY_LOCATION = "123 Party Lane, Funtown";

const SPRITES = [
  { emoji: "🎈", className: "top-10 left-6 text-4xl animate-float-slow" },
  { emoji: "🎉", className: "top-24 right-8 text-4xl animate-float-slower" },
  { emoji: "⭐", className: "top-4 right-1/3 text-2xl animate-twinkle" },
  { emoji: "🎁", className: "bottom-24 left-10 text-4xl animate-float-slower" },
  { emoji: "✨", className: "bottom-40 right-12 text-2xl animate-twinkle" },
  { emoji: "🧁", className: "top-1/2 left-4 text-3xl animate-float-slow" },
];

export default function InviteContent({ onReplay }: { onReplay: () => void }) {
  return (
    <main className="relative flex-1 overflow-hidden px-4 py-12 sm:py-16">
      {SPRITES.map((sprite, i) => (
        <span
          key={i}
          aria-hidden
          className={`pointer-events-none absolute select-none ${sprite.className}`}
        >
          {sprite.emoji}
        </span>
      ))}

      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-10 text-center">
        <section className="flex flex-col items-center gap-4">
          <p className="font-pixel text-xs sm:text-sm text-pixel-ink-soft">
            ✦ You&apos;re Invited ✦
          </p>
          <h1 className="font-pixel text-2xl sm:text-4xl leading-relaxed text-pixel-ink">
            {GUEST_OF_HONOR}&apos;s
            <br />
            {AGE_TURNING}th Birthday!
          </h1>
        </section>

        <PixelCard bg="peach" className="w-full">
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
        </PixelCard>

        <section className="w-full flex flex-col items-center gap-3">
          <h2 className="font-pixel text-sm sm:text-base">Countdown to the Party</h2>
          <CountdownTimer targetDate={PARTY_DATE_ISO} />
        </section>

        <section className="w-full flex flex-col items-center gap-3">
          <h2 className="font-pixel text-sm sm:text-base">Photo Gallery</h2>
          <PhotoGallery />
        </section>

        <button
          onClick={() => {
            setGameCompleted(false);
            onReplay();
          }}
          className="font-body text-xs text-pixel-ink-soft underline cursor-pointer"
        >
          🔁 replay game
        </button>
      </div>

      <MusicToggle />
    </main>
  );
}
