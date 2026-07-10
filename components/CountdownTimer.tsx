"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft?.days },
    { label: "Hours", value: timeLeft?.hours },
    { label: "Min", value: timeLeft?.minutes },
    { label: "Sec", value: timeLeft?.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="hud-panel bg-pixel-ink flex flex-col items-center justify-center py-3 sm:py-4"
        >
          <span className="hud-corner hud-corner-tl" />
          <span className="hud-corner hud-corner-tr" />
          <span className="hud-corner hud-corner-bl" />
          <span className="hud-corner hud-corner-br" />
          <span className="font-hud text-3xl sm:text-5xl leading-none text-pixel-accent">
            {unit.value !== undefined ? String(unit.value).padStart(2, "0") : "--"}
          </span>
          <span className="font-body text-[10px] sm:text-xs uppercase tracking-wider text-pixel-bg mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
