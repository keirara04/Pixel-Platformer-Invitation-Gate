// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import InviteContent from "@/components/InviteContent";
import BackgroundMusic from "@/components/BackgroundMusic";
import CharacterSelect from "@/components/game/CharacterSelect";
import LoveLetter from "@/components/game/LoveLetter";
import { isGameCompleted, setGameCompleted } from "@/lib/gameProgress";

const PixelGame = dynamic(() => import("@/components/game/PixelGame"), {
  ssr: false,
  loading: () => (
    <p className="font-pixel text-xs text-pixel-ink text-center py-20">
      Loading game...
    </p>
  ),
});

type Stage = "select" | "playing" | "letter" | "invite";

export default function Home() {
  const [stage, setStage] = useState<Stage | null>(null);
  const [characterSrc, setCharacterSrc] = useState<string | null>(null);

  useEffect(() => {
    setStage(isGameCompleted() ? "invite" : "select");
  }, []);

  if (stage === null) {
    return null;
  }

  return (
    <>
      <BackgroundMusic />
      {stage === "select" && (
        <CharacterSelect
          onStart={(src) => {
            setCharacterSrc(src);
            setStage("playing");
          }}
        />
      )}
      {stage === "playing" && characterSrc !== null && (
        <PixelGame characterSrc={characterSrc} onWin={() => setStage("letter")} />
      )}
      {stage === "letter" && (
        <LoveLetter
          onContinue={() => {
            setGameCompleted(true);
            setStage("invite");
          }}
        />
      )}
      {stage === "invite" && (
        <InviteContent
          onReplay={() => {
            setStage("select");
            setCharacterSrc(null);
          }}
        />
      )}
    </>
  );
}
