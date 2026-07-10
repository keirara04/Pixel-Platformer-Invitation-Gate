// The 6 "memory" photos collected during the game and shown in the invite's
// gallery. `bg` is the pastel fallback color shown behind the image (while
// it loads, or if it has transparent areas) and as the game collectible's
// outline background. `src` points to a file in /public/images.
export type MemoryPhoto = {
  id: number;
  bg: "bg-pixel-pink" | "bg-pixel-mint" | "bg-pixel-lavender" | "bg-pixel-butter" | "bg-pixel-peach";
  src: string;
  alt: string;
};

export const MEMORY_PHOTOS: MemoryPhoto[] = [
  { id: 1, bg: "bg-pixel-pink", src: "/images/photo-1.jpg", alt: "Memory photo 1" },
  { id: 2, bg: "bg-pixel-mint", src: "/images/photo-2.jpg", alt: "Memory photo 2" },
  { id: 3, bg: "bg-pixel-lavender", src: "/images/photo-3.jpg", alt: "Memory photo 3" },
  { id: 4, bg: "bg-pixel-butter", src: "/images/photo-4.jpg", alt: "Memory photo 4" },
  { id: 5, bg: "bg-pixel-peach", src: "/images/photo-5.jpg", alt: "Memory photo 5" },
  { id: 6, bg: "bg-pixel-pink", src: "/images/photo-6.jpg", alt: "Memory photo 6" },
];
