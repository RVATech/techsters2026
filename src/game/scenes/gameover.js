/**
 * The screen after a round ends.
 */

import { text, rect } from '../../engine/draw.js';
import { theme } from '../theme.js';
import { config } from '../config.js';
import { saveBest } from '../../engine/storage.js';

export const gameOverScene = {
  enter({ score = 0 }, { particles }) {
    this.score = score;
    this.best = saveBest('bestScore', score);
    this.isNewBest = score > 0 && score >= this.best;
    this.time = 0;
    this.canContinue = false;

    if (this.isNewBest) {
      // Confetti, but only for something worth celebrating.
      particles.burst({
        x: config.width / 2,
        y: config.height / 2,
        color: theme.colors.highlight,
        count: 40,
        speed: 420,
        life: 1.4,
        size: 7,
      });
    }
  },

  update(dt, { input, scenes }) {
    this.time += dt;

    // A short pause stops an accidental button press from skipping the screen.
    if (this.time > 0.6) this.canContinue = true;

    if (this.canContinue && input.anyPressed()) scenes.go('play');
  },

  draw(ctx, { particles }) {
    const { width, height } = config;
    const c = theme.colors;

    rect(ctx, { x: 0, y: 0, w: width, h: height, color: c.background, alpha: 0.75 });
    particles.draw(ctx);

    text(ctx, {
      value: this.isNewBest ? 'New best!' : 'Time!',
      x: width / 2,
      y: height / 2 - 60,
      size: theme.sizes.title,
      color: this.isNewBest ? c.highlight : c.accent,
      font: theme.fonts.display,
      align: 'center',
      shadow: c.shadow,
    });

    text(ctx, {
      value: `You scored ${this.score}`,
      x: width / 2,
      y: height / 2,
      size: theme.sizes.heading,
      color: c.ink,
      font: theme.fonts.body,
      align: 'center',
    });

    text(ctx, {
      value: `Best: ${this.best}`,
      x: width / 2,
      y: height / 2 + 40,
      size: theme.sizes.body,
      color: c.inkSoft,
      font: theme.fonts.body,
      align: 'center',
      weight: '400',
    });

    if (this.canContinue) {
      const pulse = 0.55 + Math.abs(Math.sin(this.time * 2)) * 0.45;
      text(ctx, {
        value: 'Press anything to play again',
        x: width / 2,
        y: height / 2 + 120,
        size: theme.sizes.body,
        color: c.ink,
        font: theme.fonts.body,
        align: 'center',
        alpha: pulse,
      });
    }
  },
};
