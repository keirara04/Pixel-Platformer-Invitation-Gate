// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import InviteContent from "@/components/InviteContent";
import BackgroundMusic from "@/components/BackgroundMusic";
import CharacterSelect from "@/components/game/CharacterSelect";
import { isGameCompleted, setGameCompleted } from "@/lib/gameProgress";

const PixelGame = dynamic(() => import("@/components/game/PixelGame"), {
  ssr: false,
  loading: () => (
    <p className="font-pixel text-xs text-pixel-ink text-center py-20">
      Loading game...
    </p>
  ),
});

export default function Home() {
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [characterSrc, setCharacterSrc] = useState<string | null>(null);

  useEffect(() => {
    setCompleted(isGameCompleted());
  }, []);

  return (
    <>
      <BackgroundMusic />
      {completed === null ? null : completed ? (
        <InviteContent
          onReplay={() => {
            setCompleted(false);
            setCharacterSrc(null);
          }}
        />
      ) : characterSrc === null ? (
        <CharacterSelect onStart={(src) => setCharacterSrc(src)} />
      ) : (
        <PixelGame
          characterSrc={characterSrc}
          onWin={() => {
            setGameCompleted(true);
            setCompleted(true);
          }}
        />
      )}
    </>
  );
}
