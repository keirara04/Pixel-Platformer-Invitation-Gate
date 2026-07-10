// The 6 "memory" photos collected during the game and shown in the invite's
// gallery. Still placeholders — swap `emoji` for a real image path (and
// switch consumers to <img>) once real photos are available.
export type MemoryPhoto = {
  id: number;
  bg: "bg-pixel-pink" | "bg-pixel-mint" | "bg-pixel-lavender" | "bg-pixel-butter" | "bg-pixel-peach";
  emoji: string;
};

export const MEMORY_PHOTOS: MemoryPhoto[] = [
  { id: 1, bg: "bg-pixel-pink", emoji: "🎂" },
  { id: 2, bg: "bg-pixel-mint", emoji: "🎈" },
  { id: 3, bg: "bg-pixel-lavender", emoji: "🎁" },
  { id: 4, bg: "bg-pixel-butter", emoji: "⭐" },
  { id: 5, bg: "bg-pixel-peach", emoji: "🎉" },
  { id: 6, bg: "bg-pixel-pink", emoji: "🧁" },
];
