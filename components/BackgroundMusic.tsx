"use client";

import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Browsers block audio-with-sound until a user gesture — the
          // pointerdown/keydown listeners below retry on the first one.
        });
    };

    tryPlay();

    window.addEventListener("pointerdown", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });

    return () => {
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      {/* Placeholder track — drop your own royalty-free chiptune file at
          public/audio/theme.mp3 to enable playback. */}
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="auto" />
      <button
        onClick={toggle}
        className="pixel-btn bg-pixel-lavender fixed bottom-5 right-5 z-50 w-12 h-12 flex items-center justify-center text-xl cursor-pointer"
        aria-label={playing ? "Mute music" : "Play music"}
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
}
