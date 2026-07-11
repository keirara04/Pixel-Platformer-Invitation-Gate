import { totalStarsCollected } from "@/lib/gameStats";

// Character roster for the selection screen. Only the first entry is
// playable today — the other two unlock as bonus stars are collected
// across playthroughs (see lib/gameStats.ts). Real sprite art for the
// unlocked slots is a follow-up; they show the same placeholder sprite
// once unlocked.
export type CharacterOption = {
  id: string;
  name: string;
  src: string;
  locked: boolean;
};

const UNLOCK_1_THRESHOLD = 3;
const UNLOCK_2_THRESHOLD = 7;

export function getCharacters(): CharacterOption[] {
  const stars = totalStarsCollected();
  return [
    { id: "nurin", name: "Nurin", src: "/images/character.png", locked: false },
    { id: "locked-1", name: "???", src: "/images/character.png", locked: stars < UNLOCK_1_THRESHOLD },
    { id: "locked-2", name: "???", src: "/images/character.png", locked: stars < UNLOCK_2_THRESHOLD },
  ];
}
