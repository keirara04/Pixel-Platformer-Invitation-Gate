import { totalStarsCollected } from "@/lib/gameStats";

// Character roster for the selection screen. Only the first entry is
// playable today — the other two unlock as bonus stars are collected
// across playthroughs (see lib/gameStats.ts). CharacterSelect shows "???"
// in place of the name while locked, regardless of the name here.
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
    { id: "nurin", name: "Me", src: "/images/character.png", locked: false },
    { id: "panda", name: "Panda", src: "/images/character-panda.png", locked: stars < UNLOCK_1_THRESHOLD },
    { id: "cat", name: "Cat", src: "/images/character-cat.png", locked: stars < UNLOCK_2_THRESHOLD },
  ];
}
