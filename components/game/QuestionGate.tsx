"use client";

import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import type { LevelQuestion } from "@/components/game/questions";
import { playWrongAnswer, playCorrectAnswer } from "@/components/game/sfx";

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function QuestionGate({
  question,
  characterSrc,
  onCorrect,
}: {
  question: LevelQuestion;
  characterSrc: string;
  onCorrect: () => void;
}) {
  const fullText = question.question;
  const [revealedChars, setRevealedChars] = useState(0);
  const [skipTypewriter, setSkipTypewriter] = useState(false);
  const [input, setInput] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    setRevealedChars(0);
    setSkipTypewriter(false);
  }, [fullText]);

  useEffect(() => {
    if (skipTypewriter || revealedChars >= fullText.length) return;
    const timer = setTimeout(() => setRevealedChars((n) => n + 1), 25);
    return () => clearTimeout(timer);
  }, [revealedChars, skipTypewriter, fullText]);

  const isTyping = !skipTypewriter && revealedChars < fullText.length;
  const displayedText = skipTypewriter ? fullText : fullText.slice(0, revealedChars);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (normalize(input) === normalize(question.answer)) {
      playCorrectAnswer();
      onCorrect();
      return;
    }
    playWrongAnswer();
    setWrongAttempts((n) => n + 1);
    setFeedback("Not quite, try again \u{1F495}");
    setInput("");
    setShaking(true);
    setTimeout(() => setShaking(false), 350);
  }

  // Prevents typing here from also triggering other document-level key
  // handlers (kaplay itself listens on the canvas element directly, so
  // this doesn't affect it, but other listeners may bubble via window).
  function stopGameKeys(e: KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center gap-3 bg-pixel-ink/40 pb-6 px-4">
      <img
        src={characterSrc}
        alt=""
        className="hidden sm:block w-16 h-auto self-end mb-2"
        style={{ imageRendering: "pixelated" }}
      />
      <div
        className={`hud-panel relative w-full max-w-lg bg-pixel-ink p-5 cursor-pointer ${
          shaking ? "animate-shake" : ""
        }`}
        onClick={() => setSkipTypewriter(true)}
      >
        <span className="hud-corner hud-corner-tl" />
        <span className="hud-corner hud-corner-tr" />
        <span className="hud-corner hud-corner-bl" />
        <span className="hud-corner hud-corner-br" />

        <p data-testid="question-text" className="font-body text-base text-pixel-bg min-h-[4.5rem]">
          {displayedText}
          {isTyping && <span className="animate-blink">_</span>}
        </p>

        {!isTyping && (
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="mt-4 flex flex-col gap-2"
          >
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={stopGameKeys}
              onKeyUp={stopGameKeys}
              placeholder="Type your answer..."
              className="font-body text-sm bg-pixel-bg text-pixel-ink px-3 py-2 pixel-border-sm outline-none"
            />
            <button
              type="submit"
              className="pixel-btn bg-pixel-accent text-pixel-bg font-pixel text-xs px-4 py-2 self-start cursor-pointer"
            >
              Submit
            </button>
            {feedback && <p className="font-body text-xs text-pixel-accent">{feedback}</p>}
            {wrongAttempts >= 2 && (
              <p className="font-body text-xs text-pixel-bg/70 italic">Hint: {question.hint}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
