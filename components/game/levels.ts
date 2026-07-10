import { MEMORY_PHOTOS } from "@/components/photos";

export type Platform = { x: number; y: number; w: number; h: number };
export type Level = {
  platforms: Platform[];
  photoIds: number[];
  playerStart: { x: number; y: number };
  exit: { x: number; y: number };
};

// Canvas is 480x270. Ground sits at y=240. All coordinates are top-left,
// matching Kaplay's default pos() anchor unless overridden.
export const LEVELS: Level[] = [
  {
    // Level 1: flat ground, no gaps, walk + collect 2 photos.
    platforms: [{ x: 0, y: 240, w: 480, h: 30 }],
    photoIds: [MEMORY_PHOTOS[0].id, MEMORY_PHOTOS[1].id],
    playerStart: { x: 20, y: 200 },
    exit: { x: 450, y: 200 },
  },
  {
    // Level 2: two gaps to jump, collect 2 more photos.
    platforms: [
      { x: 0, y: 240, w: 140, h: 30 },
      { x: 200, y: 240, w: 100, h: 30 },
      { x: 360, y: 240, w: 120, h: 30 },
    ],
    photoIds: [MEMORY_PHOTOS[2].id, MEMORY_PHOTOS[3].id],
    playerStart: { x: 20, y: 200 },
    exit: { x: 440, y: 200 },
  },
  {
    // Level 3: combines gaps + a raised platform, ends at the cake.
    platforms: [
      { x: 0, y: 240, w: 100, h: 30 },
      { x: 160, y: 240, w: 80, h: 30 },
      { x: 300, y: 190, w: 60, h: 20 },
      { x: 400, y: 240, w: 80, h: 30 },
    ],
    photoIds: [MEMORY_PHOTOS[4].id, MEMORY_PHOTOS[5].id],
    playerStart: { x: 20, y: 200 },
    exit: { x: 430, y: 200 },
  },
];
