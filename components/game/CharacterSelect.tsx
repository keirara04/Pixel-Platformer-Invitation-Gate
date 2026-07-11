"use client";

import { useState } from "react";
import { getCharacters } from "@/components/characters";
import LockIcon from "@/components/icons/LockIcon";

export default function CharacterSelect({
  onStart,
}: {
  onStart: (characterSrc: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [characters] = useState(() => getCharacters());
  const selected = characters.find((c) => c.id === selectedId);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-pixel-ink px-4">
      <p className="font-hud text-lg sm:text-xl tracking-[0.3em] text-pixel-accent">
        SELECT YOUR CHARACTER
      </p>

      <div className="flex gap-4 sm:gap-6">
        {characters.map((c) => {
          const isSelected = c.id === selectedId;
          return (
            <button
              key={c.id}
              disabled={c.locked}
              onClick={() => setSelectedId(c.id)}
              aria-label={c.locked ? "Locked character slot" : `Select ${c.name}`}
              aria-pressed={isSelected}
              className={`hud-panel relative flex w-20 sm:w-28 aspect-[3/5] flex-col items-center justify-end gap-2 p-2 bg-pixel-bg ${
                c.locked ? "cursor-not-allowed" : "cursor-pointer"
              } ${isSelected ? "outline outline-4 outline-pixel-accent -outline-offset-4" : ""}`}
            >
              <span className="hud-corner hud-corner-tl" />
              <span className="hud-corner hud-corner-tr" />
              <span className="hud-corner hud-corner-bl" />
              <span className="hud-corner hud-corner-br" />

              <img
                src={c.src}
                alt=""
                className={`w-3/4 flex-1 object-contain ${c.locked ? "grayscale brightness-50" : ""}`}
                style={{ imageRendering: "pixelated" }}
              />

              {c.locked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-pixel-ink/60 text-pixel-bg">
                  <LockIcon size={20} />
                  <span className="font-hud text-xs tracking-widest">SOON</span>
                </div>
              )}

              <span className="font-body text-[10px] sm:text-xs text-pixel-ink">
                {c.locked ? "???" : c.name}
              </span>
            </button>
          );
        })}
      </div>

      <button
        disabled={!selected}
        onClick={() => selected && onStart(selected.src)}
        className={`pixel-btn font-pixel text-xs px-6 py-3 ${
          selected
            ? "bg-pixel-accent text-pixel-bg cursor-pointer"
            : "bg-pixel-ink-soft text-pixel-bg/50 cursor-not-allowed"
        }`}
      >
        Start
      </button>
    </div>
  );
}
