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
    answer: "Gwangju",
    hint: "Literally the place you met me for the first time.",
  },
  {
    question: "Why did i came to Gwangju for the first time?",
    answer: "Kuih Raya",
    hint: "Special Occasion ahh makanan.",
  },
  {
    question: "What month i was born in",
    answer: "May",
    hint: "HMMM NI KALAU TAK TAUU.",
  },
  {
    question: "What food did i cook for you the first time?",
    answer: "Chicken Soup",
    hint: "YANG SEDAPP GILAA.",
  },
  {
    question: "What food do i usually eat on friday?",
    answer: "Maratang",
    hint: "MMMMMMM",
  },
  {
    question: "What's my favorite food?",
    answer: "Asam Pedas",
    hint: "You've watched me order it more than once.",
  },
  {
    question: "What do we eat together and sakit perut after?",
    answer: "Seafood",
    hint: "lol.",
  },
  {
    question: "What color are my eyes?",
    answer: "Brown",
    hint: "Look closer next time.",
  },
  {
    question: "What's the silliest nickname I called my cat?",
    answer: "Popo",
    hint: "You probably pretended to hate it.",
  },
  {
    question: "What movie did we watch for the first time in cinema?",
    answer: "Lee Cronin's The Mummy",
    hint: "Kena spelling betul and its 4 words.",
  },
  {
    question: "How tall am i?",
    answer: "170cm",
    hint: "Include cm too...",
  },
  {
    question: "Where did we went to watch animals for the first time?",
    answer: "우치동물원",
    hint: "한국어로 대답해주세요~.",
  },
  {
    question: "What's my biggest fear?",
    answer: "Spider",
    hint: "Eight legs and a lot of eyes.",
  },
  {
    question: "How long does it took for me to get to your house on my first visit?",
    answer: "30 minutes",
    hint: "60 divide by 3 plus 10.",
  },
  {
    question: "What pose did i do during our first selfie together?",
    answer: "Peace",
    hint: "two fingers.",
  },
  {
    question: "Our fav animal?",
    answer: "Cat",
    hint: "You know exactly which one.",
  },
  {
    question: "Where do do you always punch me?",
    answer: "Shoulder",
    hint: "I've mentioned this one a lot.",
  },
  {
    question: "What was the first gift I gave you?",
    answer: "Mofusand",
    hint: "Think back to early on.",
  },
  {
    question: "What's my favorite season?",
    answer: "Winter",
    hint: "i hate burning.",
  },
  {
    question: "The date i confessed my love to you?",
    answer: "26 April 2026",
    hint: "DD MM YYYY.",
  },
  {
    question: "What's my fav hobby?",
    answer: "Sleeping",
    hint: "On da bed or on da floor.",
  },
  {
    question: "What's the one thing that always makes me laugh?",
    answer: "Nurin",
    hint: "You",
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
