// lib/gameProgress.ts

export const GAME_COMPLETED_KEY = "pixel-invite-game-completed";

// Wrapped in try/catch: localStorage can throw in some private-browsing
// modes. Falling back to "not completed" just means the game shows again,
// which is a safe default (never crashes the page).
export function isGameCompleted(): boolean {
  try {
    return localStorage.getItem(GAME_COMPLETED_KEY) === "true";
  } catch {
    return false;
  }
}

export function setGameCompleted(completed: boolean): void {
  try {
    if (completed) {
      localStorage.setItem(GAME_COMPLETED_KEY, "true");
    } else {
      localStorage.removeItem(GAME_COMPLETED_KEY);
    }
  } catch {
    // Ignore — see isGameCompleted comment above.
  }
}
