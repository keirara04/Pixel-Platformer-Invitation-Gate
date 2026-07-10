// A bank of relationship questions. Two of these are picked at random each
// time a playthrough starts (see pickGateQuestions below) — one for the
// level 1→2 gate, one for level 2→3 — so replaying shows a different pair.
// Replace the `answer`/`hint` (and `question`, if you want different ones)
// with real ones — these are placeholders.
export type LevelQuestion = {
  question: string;
  answer: string;
  hint: string;
};

export const QUESTION_BANK: LevelQuestion[] = [
  {
    question: "Where did we first meet?",
    answer: "123",
    hint: "Think back to the very first time...",
  },
  {
    question: "What's my favorite nickname for you?",
    answer: "123",
    hint: "You know this one.",
  },
  {
    question: "What was the first thing I said to you?",
    answer: "123",
    hint: "Think back to that very first moment.",
  },
  {
    question: "What's our song?",
    answer: "123",
    hint: "You'd know it the second it started playing.",
  },
  {
    question: "Where was our first date?",
    answer: "123",
    hint: "Where did it all start?",
  },
  {
    question: "What's my favorite food?",
    answer: "123",
    hint: "You've watched me order it more than once.",
  },
  {
    question: "What's your favorite memory of us?",
    answer: "123",
    hint: "There's no wrong answer here.",
  },
  {
    question: "What color are my eyes?",
    answer: "123",
    hint: "Look closer next time.",
  },
  {
    question: "What's the silliest nickname I've called you?",
    answer: "123",
    hint: "You probably pretended to hate it.",
  },
  {
    question: "What movie did we watch on our first date?",
    answer: "123",
    hint: "Think back to that night.",
  },
  {
    question: "What's my go-to order at our favorite restaurant?",
    answer: "123",
    hint: "I basically always get the same thing.",
  },
  {
    question: "Where did we first hold hands?",
    answer: "123",
    hint: "It was a bigger deal than either of us admitted.",
  },
  {
    question: "What's my biggest fear?",
    answer: "123",
    hint: "I've probably brought this up more than once.",
  },
  {
    question: "What's your favorite thing about me?",
    answer: "123",
    hint: "Just be honest.",
  },
  {
    question: "What was I wearing the day we met?",
    answer: "123",
    hint: "Picture that day.",
  },
  {
    question: "What's our inside joke?",
    answer: "123",
    hint: "You know exactly which one.",
  },
  {
    question: "Where do I want to travel to most?",
    answer: "123",
    hint: "I've mentioned this one a lot.",
  },
  {
    question: "What was the first gift I gave you?",
    answer: "123",
    hint: "Think back to early on.",
  },
  {
    question: "What's my favorite season?",
    answer: "123",
    hint: "Think about what I always look forward to.",
  },
  {
    question: "What's something we argued about and laughed about later?",
    answer: "123",
    hint: "It was probably something small.",
  },
  {
    question: "What's my dream job?",
    answer: "123",
    hint: "Something I've talked about wanting to do.",
  },
  {
    question: "What's the one thing that always makes me laugh?",
    answer: "123",
    hint: "You've used this one before, probably on purpose.",
  },
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Picks 2 distinct random questions from the bank — one per gate — so each
// playthrough (including replays) sees a different pair.
export function pickGateQuestions(): [LevelQuestion, LevelQuestion] {
  const [first, second] = shuffle(QUESTION_BANK);
  return [first, second];
}
