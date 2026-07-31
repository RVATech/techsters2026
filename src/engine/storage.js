/**
 * storage.js — remembers things after the player closes the tab.
 * Good for high scores, which levels are unlocked, and settings.
 *
 *   save('highScore', 120)
 *   load('highScore', 0)   // 0 is used the very first time
 */

const PREFIX = 'mygame:';

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Private browsing can block saving. Not a reason to crash the game.
  }
}

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

/** Save a score only if it beats the old best. Returns the best score. */
export function saveBest(key, value) {
  const best = Math.max(load(key, 0), value);
  save(key, best);
  return best;
}
