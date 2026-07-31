/**
 * The first screen the player sees.
 */

import { text, rect, circle } from '../../engine/draw.js';
import { theme } from '../theme.js';
import { config } from '../config.js';
import { load } from '../../engine/storage.js';
import { wobble } from '../../engine/utils.js';

export const titleScene = {
  enter() {
    this.time = 0;
    this.best = load('bestScore', 0);
  },

  update(dt, { scenes, input, sound }) {
    this.time += dt;

    if (input.anyPressed()) {
      sound.beep({ from: 440, to: 880, seconds: 0.15, shape: 'triangle' });
      scenes.go('play');
    }
  },

  draw(ctx) {
    const { width, height } = config;
    const c = theme.colors;

    // A few floating dots so the screen isn't completely still.
    for (let i = 0; i < 24; i += 1) {
      const x = ((i * 137) % width);
      const y = ((i * 89) % height) + wobble(this.time + i, 0.8, 10);
      circle(ctx, { x, y, r: 2 + (i % 3), color: c.surface, alpha: 0.9 });
    }

    text(ctx, {
      value: config.title,
      x: width / 2,
      y: height / 2 - 40 + wobble(this.time, 1.4, 6),
      size: theme.sizes.title,
      color: c.accent,
      font: theme.fonts.display,
      align: 'center',
      shadow: c.shadow,
    });

    text(ctx, {
      value: config.tagline,
      x: width / 2,
      y: height / 2 + 6,
      size: theme.sizes.body,
      color: c.inkSoft,
      font: theme.fonts.body,
      align: 'center',
      weight: '400',
    });

    // A gently pulsing "press to start" so it draws the eye.
    const pulse = 0.6 + Math.abs(Math.sin(this.time * 2)) * 0.4;
    rect(ctx, {
      x: width / 2 - 150,
      y: height / 2 + 70,
      w: 300,
      h: 56,
      color: c.surface,
      radius: 28,
      alpha: pulse,
    });
    text(ctx, {
      value: 'Press any key or tap',
      x: width / 2,
      y: height / 2 + 106,
      size: theme.sizes.body,
      color: c.ink,
      font: theme.fonts.body,
      align: 'center',
    });

    if (this.best > 0) {
      text(ctx, {
        value: `Best score: ${this.best}`,
        x: width / 2,
        y: height - 40,
        size: theme.sizes.small,
        color: c.inkSoft,
        font: theme.fonts.body,
        align: 'center',
        weight: '400',
      });
    }
  },
};
