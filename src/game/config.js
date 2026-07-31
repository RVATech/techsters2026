/**
 * config.js — the dials for the game.
 *
 * This is where the numbers worth changing during playtesting live: how fast
 * things move, how long a round lasts, how much things are worth, how many
 * lives you get.
 *
 * Keeping them together means "make her faster" is a one-number change
 * instead of a hunt through the whole game.
 *
 * It starts almost empty on purpose. Add settings as the game decides what it
 * needs — there is no assumption here about what kind of game this will be.
 */

export const config = {
  // The game is drawn as if the screen were this many pixels, then scaled to
  // fit the player's actual screen. 960x540 is a good widescreen default,
  // but any size works — try 540x960 for a game meant to be held upright.
  width: 960,
  height: 540,

  // Shown on the browser tab and on the opening screen.
  title: 'Untitled',
  tagline: 'Your game starts here',
};
