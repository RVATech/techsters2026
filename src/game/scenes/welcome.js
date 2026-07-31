/**
 * The blank slate.
 *
 * This is the only screen in the project, and it is deliberately not a game.
 * There is no character, no score, no timer, and no way to win or lose —
 * nothing that would suggest what kind of game this is supposed to become.
 *
 * It exists for one reason: to show that everything is working and ready.
 *
 * Replace it. The first real screen of the game goes here, built from the
 * decisions in GAME-PLAN.md.
 */

import { text } from '../../engine/draw.js';
import { theme } from '../theme.js';
import { config } from '../config.js';

export const welcomeScene = {
  enter() {
    this.time = 0;
  },

  update(dt) {
    this.time += dt;
  },

  draw(ctx) {
    const { width, height } = config;
    const c = theme.colors;

    text(ctx, {
      value: config.title,
      x: width / 2,
      y: height / 2 - 10,
      size: theme.sizes.title,
      color: c.ink,
      font: theme.fonts.display,
      align: 'center',
    });

    // A slow fade in and out, so it is obvious the screen is live and not
    // a frozen picture.
    const breathe = 0.45 + Math.abs(Math.sin(this.time * 0.9)) * 0.55;

    text(ctx, {
      value: config.tagline,
      x: width / 2,
      y: height / 2 + 40,
      size: theme.sizes.body,
      color: c.inkSoft,
      font: theme.fonts.body,
      align: 'center',
      weight: '400',
      alpha: breathe,
    });
  },
};
