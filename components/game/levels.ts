import { MEMORY_PHOTOS } from "@/components/photos";

export type Platform = { x: number; y: number; w: number; h: number };

export type MovingPlatform = {
  x: number; y: number; w: number; h: number;
  axis: "x" | "y";
  range: number; // px traveled from the start position before reversing
  speed: number; // px/sec
};

export type Hazard = { x: number; y: number; w: number; h: number };

export type Enemy = {
  x: number; y: number;
  patrolFrom: number; patrolTo: number; // world-space x bounds
  speed: number; // px/sec
};

export type BonusStar = { id: string; x: number; y: number };

export type Level = {
  width: number;
  platforms: Platform[];
  movingPlatforms?: MovingPlatform[];
  hazards?: Hazard[];
  enemies?: Enemy[];
  bonusStars?: BonusStar[];
  photoIds: number[];
  playerStart: { x: number; y: number };
  exit: { x: number; y: number };
};

// Canvas is 480x270. Ground sits at y=240. All coordinates are top-left,
// matching Kaplay's default pos() anchor unless overridden.
export const LEVELS: Level[] = [
  {
    // Level 1: flat ground, 1 moving platform, 1 enemy (elevated, avoidable),
    // 1 hazard on the ground path (jump over it), 2 bonus stars, 2 required photos.
    width: 900,
    platforms: [{ x: 0, y: 240, w: 900, h: 30 }],
    movingPlatforms: [
      { x: 300, y: 170, w: 60, h: 16, axis: "x", range: 120, speed: 60 },
    ],
    hazards: [{ x: 700, y: 232, w: 16, h: 8 }],
    enemies: [{ x: 500, y: 150, patrolFrom: 460, patrolTo: 560, speed: 40 }],
    bonusStars: [
      { id: "l1-star-1", x: 150, y: 210 },
      { id: "l1-star-2", x: 780, y: 210 },
    ],
    photoIds: [MEMORY_PHOTOS[0].id, MEMORY_PHOTOS[1].id],
    playerStart: { x: 20, y: 200 },
    exit: { x: 860, y: 200 },
  },
  {
    // Level 2: 3 platforms with 80px gaps (same proven-jumpable size as the
    // original game's gaps), a ground hazard on the first platform, an
    // elevated enemy, a decorative moving platform (optional bonus-star
    // detour, not required to cross), 3 bonus stars, 2 required photos.
    width: 1000,
    platforms: [
      { x: 0, y: 240, w: 260, h: 30 },
      { x: 340, y: 240, w: 240, h: 30 },
      { x: 660, y: 240, w: 340, h: 30 },
    ],
    movingPlatforms: [
      { x: 700, y: 180, w: 60, h: 16, axis: "x", range: 80, speed: 60 },
    ],
    hazards: [{ x: 90, y: 232, w: 16, h: 8 }],
    enemies: [{ x: 470, y: 150, patrolFrom: 420, patrolTo: 520, speed: 45 }],
    bonusStars: [
      { id: "l2-star-1", x: 190, y: 210 },
      { id: "l2-star-2", x: 450, y: 210 },
      { id: "l2-star-3", x: 760, y: 150 },
    ],
    photoIds: [MEMORY_PHOTOS[2].id, MEMORY_PHOTOS[3].id],
    playerStart: { x: 20, y: 200 },
    exit: { x: 940, y: 200 },
  },
  {
    // Level 3 (finale): 4 flat platforms with 80px gaps (same height
    // throughout — an earlier raised-platform variant caused jumps to
    // overshoot the next landing zone due to the extra fall-carry distance
    // from a higher launch point, so height stays uniform for reliable
    // landings), most varied entity mix — 2 moving platforms
    // (decorative/optional), 2 elevated enemies, 2 bonus stars, ends at
    // the cake. No hazard here (unlike levels 1-2): platform3 (540-720)
    // is too narrow to fit a hazard with safe recovery buffer on both
    // sides of the two gaps flanking it without the jump-landing-jump
    // sequence becoming unreliable — 4 gaps plus 2 enemies plus 2 moving
    // platforms already gives this level plenty of variety.
    width: 1100,
    platforms: [
      { x: 0, y: 240, w: 240, h: 30 },
      { x: 320, y: 240, w: 140, h: 30 },
      { x: 540, y: 240, w: 180, h: 30 },
      { x: 800, y: 240, w: 300, h: 30 },
    ],
    movingPlatforms: [
      // y=170 (not higher) — matches Level 1's already-verified reachable
      // height: max jump height is ~98px, so a platform's top surface
      // needs to sit no higher than roughly y=140-170 above y=240 ground
      // to actually be landable. An earlier revision raised these to 100
      // to clear a since-removed raised platform's head-height; after
      // flattening that platform, they were never lowered back down,
      // leaving them physically unreachable.
      { x: 380, y: 170, w: 60, h: 16, axis: "x", range: 60, speed: 55 },
      { x: 850, y: 140, w: 60, h: 16, axis: "y", range: 30, speed: 50 },
    ],
    enemies: [
      { x: 80, y: 150, patrolFrom: 40, patrolTo: 140, speed: 45 },
      { x: 950, y: 150, patrolFrom: 900, patrolTo: 1050, speed: 45 },
    ],
    bonusStars: [
      // y=160 — reachable via a direct jump from ground level (peak
      // height ~98px) without depending on catching a moving platform at
      // a specific point in its cycle, guaranteeing these are always
      // collectable.
      { id: "l3-star-1", x: 400, y: 160 },
      { id: "l3-star-2", x: 1000, y: 160 },
    ],
    photoIds: [MEMORY_PHOTOS[4].id, MEMORY_PHOTOS[5].id],
    playerStart: { x: 20, y: 200 },
    exit: { x: 1060, y: 200 },
  },
];
