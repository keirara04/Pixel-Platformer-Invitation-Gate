// Character roster for the selection screen. Only the first entry is
// playable today — the other two are placeholders for characters not
// built yet. Add a real entry (locked: false, its own sprite) to unlock one.
export type CharacterOption = {
  id: string;
  name: string;
  src: string;
  locked: boolean;
};

export const CHARACTERS: CharacterOption[] = [
  { id: "nurin", name: "Nurin", src: "/images/character.png", locked: false },
  { id: "locked-1", name: "???", src: "/images/character.png", locked: true },
  { id: "locked-2", name: "???", src: "/images/character.png", locked: true },
];
