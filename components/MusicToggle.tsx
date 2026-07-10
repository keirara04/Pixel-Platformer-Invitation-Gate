"use client";

import { useRef, useState } from "react";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Playback can fail until a real audio file is added at
          // /public/audio/theme.mp3 — leave the icon in its "off" state.
        });
      return;
    }
    setPlaying(false);
  };

  return (
    <>
      {/* Placeholder track — drop your own royalty-free chiptune file at
          public/audio/theme.mp3 to enable playback. */}
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="none" />
      <button
        onClick={toggle}
        className="pixel-btn bg-pixel-lavender fixed bottom-5 right-5 z-40 w-12 h-12 flex items-center justify-center text-xl cursor-pointer"
        aria-label={playing ? "Mute music" : "Play music"}
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
}
