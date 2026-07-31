/**
 * config.js — the dials for the game.
 *
 * The numbers worth tweaking while playtesting live here, so "make her faster"
 * is a one-number change instead of a hunt through the whole game.
 */

export const config = {
  // The game is drawn as if the screen were this many pixels, then scaled to
  // fit the player's actual screen.
  width: 960,
  height: 540,

  // Shown on the browser tab and on the opening screen.
  title: 'Giraffe Maze',
  tagline: 'Wander, nibble, find the heart of the maze',

  // --- The maze ---
  // How many walkable squares the maze is across and down. Odd numbers keep
  // the middle square walkable — that's where the fireworks wait.
  mazeCols: 21,
  mazeRows: 15,
  // Size of one maze square in pixels. Picked so the whole maze fits cosy on
  // screen with a little breathing room around it.
  cellSize: 24,

  // --- The giraffe ---
  // How fast she strolls, in pixels per second. Cozy, not rushed.
  giraffeSpeed: 150,
  // How quickly she eases up to full speed and back to a stop, 0–1.
  giraffeEase: 0.25,
  // How big she is compared to one maze square.
  giraffeScale: 0.62,

  // --- Eating leaves ---
  // How close a hedge must be before she can nibble its leaves, in pixels.
  eatRange: 34,
  // Shortest gap between munch sounds, in seconds, so it never gets noisy.
  munchGap: 0.12,

  // --- Fireworks ---
  // How long the celebration lasts before the "again?" prompt, in seconds.
  fireworksDuration: 5,
};
