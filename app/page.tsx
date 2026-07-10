// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import InviteContent from "@/components/InviteContent";
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

  useEffect(() => {
    setCompleted(isGameCompleted());
  }, []);

  if (completed === null) {
    return null;
  }

  if (!completed) {
    return (
      <PixelGame
        onWin={() => {
          setGameCompleted(true);
          setCompleted(true);
        }}
      />
    );
  }

  return (
    <InviteContent
      onReplay={() => {
        setCompleted(false);
      }}
    />
  );
}
