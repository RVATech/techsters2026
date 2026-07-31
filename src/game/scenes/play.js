/**
 * The playing screen.
 *
 * This starter round is a placeholder: move around, collect stars before the
 * timer runs out. It exists so there is something playable on day one — it is
 * meant to be replaced by the real game.
 */

import { rect, circle, text } from '../../engine/draw.js';
import { theme } from '../theme.js';
import { config } from '../config.js';
import { clamp, lerp, randomInt, circlesOverlap, formatTime } from '../../engine/utils.js';

export const playScene = {
  enter(data, { particles }) {
    const { width, height } = config;

    this.score = 0;
    this.timeLeft = config.round.seconds;

    this.player = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      size: config.player.size,
    };

    this.stars = [];
    for (let i = 0; i < config.star.count; i += 1) this.stars.push(this.makeStar());

    particles.clear();
  },

  makeStar() {
    const margin = 60;
    return {
      x: randomInt(margin, config.width - margin),
      y: randomInt(margin + 60, config.height - margin),
      r: config.star.size / 2,
      spin: Math.random() * Math.PI,
    };
  },

  update(dt, { input, scenes, sound, particles }) {
    const p = this.player;
    const half = p.size / 2;

    // --- Move the player ---
    const push = input.axis();

    // If the player is touching the screen, head toward their finger instead.
    if (input.pointer.down) {
      const dx = input.pointer.x - p.x;
      const dy = input.pointer.y - p.y;
      const length = Math.hypot(dx, dy) || 1;
      if (length > 8) {
        push.x = dx / length;
        push.y = dy / length;
      }
    }

    // Ease toward the target speed so movement feels smooth, not robotic.
    const target = { x: push.x * config.player.speed, y: push.y * config.player.speed };
    p.vx = lerp(p.vx, target.x, Math.min(1, config.player.acceleration * dt));
    p.vy = lerp(p.vy, target.y, Math.min(1, config.player.acceleration * dt));

    p.x = clamp(p.x + p.vx * dt, half, config.width - half);
    p.y = clamp(p.y + p.vy * dt, half + 50, config.height - half);

    // --- Collect stars ---
    const playerCircle = { x: p.x, y: p.y, r: half };
    for (let i = this.stars.length - 1; i >= 0; i -= 1) {
      const star = this.stars[i];
      star.spin += dt * 2;

      if (circlesOverlap(playerCircle, star)) {
        this.score += config.round.starPoints;
        sound.beep({ from: 700, to: 1200, seconds: 0.1, shape: 'square', volume: 0.35 });
        particles.burst({
          x: star.x,
          y: star.y,
          color: theme.colors.highlight,
          count: 14,
          speed: 200,
        });
        this.stars[i] = this.makeStar();
      }
    }

    // --- Countdown ---
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      sound.beep({ from: 400, to: 160, seconds: 0.4, shape: 'sawtooth', volume: 0.4 });
      scenes.go('gameover', { score: this.score });
    }
  },

  draw(ctx, { particles }) {
    const c = theme.colors;
    const p = this.player;

    // Stars
    for (const star of this.stars) {
      circle(ctx, { x: star.x, y: star.y, r: star.r + Math.sin(star.spin) * 2, color: c.highlight });
      circle(ctx, { x: star.x, y: star.y, r: star.r * 0.45, color: c.background, alpha: 0.35 });
    }

    particles.draw(ctx);

    // Player
    rect(ctx, {
      x: p.x - p.size / 2,
      y: p.y - p.size / 2,
      w: p.size,
      h: p.size,
      color: c.accent,
      radius: 12,
    });

    // --- The bar across the top: score on the left, time on the right ---
    rect(ctx, { x: 0, y: 0, w: config.width, h: 50, color: c.backgroundSoft, alpha: 0.92 });

    text(ctx, {
      value: `Score ${this.score}`,
      x: 24,
      y: 33,
      size: theme.sizes.body,
      color: c.ink,
      font: theme.fonts.body,
    });

    const lowOnTime = this.timeLeft <= 5;
    text(ctx, {
      value: formatTime(this.timeLeft),
      x: config.width - 24,
      y: 33,
      size: theme.sizes.body,
      color: lowOnTime ? c.danger : c.ink,
      font: theme.fonts.body,
      align: 'right',
    });
  },
};
