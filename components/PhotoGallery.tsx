"use client";

import { useEffect, useState } from "react";
import { MEMORY_PHOTOS } from "@/components/photos";

export default function PhotoGallery() {
  const [openId, setOpenId] = useState<number | null>(null);
  const openTile = MEMORY_PHOTOS.find((t) => t.id === openId);

  useEffect(() => {
    if (openId === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openId]);

  return (
    <>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {MEMORY_PHOTOS.map((tile) => (
          <button
            key={tile.id}
            onClick={() => setOpenId(tile.id)}
            className={`pixel-border-sm ${tile.bg} aspect-square overflow-hidden cursor-pointer hover:brightness-95`}
            aria-label={`Open photo ${tile.id}`}
          >
            <img src={tile.src} alt={tile.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {openTile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${openTile.id} enlarged`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-pixel-ink/70 p-6"
          onClick={() => setOpenId(null)}
        >
          <div
            className={`pixel-border ${openTile.bg} w-full max-w-sm aspect-square overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={openTile.src} alt={openTile.alt} className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => setOpenId(null)}
            aria-label="Close photo"
            className="pixel-btn bg-pixel-butter fixed top-5 right-5 w-10 h-10 flex items-center justify-center text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
