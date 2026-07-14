// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import InviteContent from "@/components/InviteContent";
import BackgroundMusic from "@/components/BackgroundMusic";
import CharacterSelect from "@/components/game/CharacterSelect";
import LoveLetter from "@/components/game/LoveLetter";
import PasswordGate from "@/components/PasswordGate";
import WelcomeContent from "@/components/WelcomeContent";
import { isGameCompleted, setGameCompleted } from "@/lib/gameProgress";

const PixelGame = dynamic(() => import("@/components/game/PixelGame"), {
  ssr: false,
  loading: () => (
    <p className="font-pixel text-xs text-pixel-ink text-center py-20">
      Loading game...
    </p>
  ),
});

type Stage = "welcome" | "select" | "playing" | "letter" | "invite";

export default function Home() {
  const [stage, setStage] = useState<Stage | null>(null);
  const [characterSrc, setCharacterSrc] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setStage(isGameCompleted() ? "invite" : "welcome");
  }, []);

  if (stage === null) {
    return null;
  }

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <>
      <BackgroundMusic />
      {stage === "welcome" && <WelcomeContent onStart={() => setStage("select")} />}
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
