// Shown after clearing a level, before the next one starts. Replace the
// `answer`/`hint` (and `question`, if you want a different question)
// with real ones — these are placeholders.
export type LevelQuestion = {
  question: string;
  answer: string;
  hint: string;
};

export const LEVEL_QUESTIONS: LevelQuestion[] = [
  // Shown after clearing level 1, before level 2.
  {
    question: "Where did we first meet?",
    answer: "PLACEHOLDER",
    hint: "Think back to the very first time...",
  },
  // Shown after clearing level 2, before level 3.
  {
    question: "What's my favorite nickname for you?",
    answer: "PLACEHOLDER",
    hint: "You know this one.",
  },
];
