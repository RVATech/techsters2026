/**
 * utils.js — small maths helpers that come up in nearly every game.
 */

/** Keep a number between a low and a high value. */
export const clamp = (value, low, high) => Math.min(Math.max(value, low), high);

/** A random whole number from low to high, including both. */
export const randomInt = (low, high) => Math.floor(Math.random() * (high - low + 1)) + low;

/** A random decimal number between low and high. */
export const randomRange = (low, high) => Math.random() * (high - low) + low;

/** Pick one random thing out of a list. */
export const randomPick = (list) => list[Math.floor(Math.random() * list.length)];

/** Happens `chance` of the time. randomChance(0.25) is true a quarter of the time. */
export const randomChance = (chance) => Math.random() < chance;

/** Slide smoothly from one number toward another. `amount` is 0 to 1. */
export const lerp = (from, to, amount) => from + (to - from) * amount;

/** How far apart two points are. */
export const distance = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);

/** Do two rectangles overlap? Each needs x, y, w, h. */
export function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/** Do two circles overlap? Each needs x, y, r. */
export function circlesOverlap(a, b) {
  return distance(a.x, a.y, b.x, b.y) < a.r + b.r;
}

/** Is a point inside a rectangle? Useful for buttons. */
export function pointInRect(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
}

/** Turn 75 into "75", and 1500 into "1,500". */
export const formatNumber = (n) => Math.round(n).toLocaleString();

/** Turn 95 seconds into "1:35". */
export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** A gentle back-and-forth wobble. Great for floating or pulsing things. */
export const wobble = (time, speed = 2, size = 1) => Math.sin(time * speed) * size;
