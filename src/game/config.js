/**
 * config.js — the dials for the game.
 *
 * These are the numbers most worth changing while playtesting: how fast
 * things move, how long a round lasts, how many points things are worth.
 * Keeping them together makes it easy to try "what if the player were
 * faster?" without hunting through the whole game.
 */

export const config = {
  // The game is drawn as if the screen were this many pixels, then scaled
  // to fit the player's actual screen.
  width: 960,
  height: 540,

  title: 'My Game',
  tagline: 'A game by me',

  player: {
    speed: 320,       // pixels per second
    size: 44,
    acceleration: 12, // higher = snappier turns
  },

  round: {
    seconds: 30,
    starPoints: 10,
  },

  star: {
    size: 26,
    count: 5,
  },
};
