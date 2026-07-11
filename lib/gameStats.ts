// lib/gameStats.ts
// Same try/catch-around-localStorage pattern as lib/gameProgress.ts —
// localStorage can throw in some private-browsing modes; falling back to
// "no progress recorded" is always a safe default.

const STARS_KEY = "pixel-invite-collected-stars";

export function getCollectedStars(): Set<string> {
  try {
    const raw = localStorage.getItem(STARS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function collectStar(id: string): void {
  try {
    const stars = getCollectedStars();
    stars.add(id);
    localStorage.setItem(STARS_KEY, JSON.stringify([...stars]));
  } catch {
    // Ignore — see getCollectedStars comment above.
  }
}

export function totalStarsCollected(): number {
  return getCollectedStars().size;
}

const BEST_TIME_KEY_PREFIX = "pixel-invite-best-time-level-";

export function getBestTime(levelIndex: number): number | null {
  try {
    const raw = localStorage.getItem(BEST_TIME_KEY_PREFIX + levelIndex);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export function recordTime(levelIndex: number, seconds: number): void {
  try {
    const existing = getBestTime(levelIndex);
    if (existing === null || seconds < existing) {
      localStorage.setItem(BEST_TIME_KEY_PREFIX + levelIndex, String(seconds));
    }
  } catch {
    // Ignore — see getCollectedStars comment in this file.
  }
}
