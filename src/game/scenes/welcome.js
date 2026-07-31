/**
 * welcome.js — the opening screen.
 *
 * A cozy title card that invites the player in. The giraffe peeks up over the
 * bottom edge, leaves drift across the sky, and any tap or key starts the
 * game. It sets the gentle, sunny mood before the maze begins.
 */

import { text, circle } from '../../engine/draw.js';
import { theme } from '../theme.js';
import { config } from '../config.js';

const c = theme.colors;

export const welcomeScene = {
  enter(ctx) {
    this.time = 0;
    // A few drifting leaves for atmosphere.
    this.leaves = Array.from({ length: 10 }, () => ({
      x: Math.random() * config.width,
      y: Math.random() * config.height,
      r: 4 + Math.random() * 5,
      drift: 12 + Math.random() * 18,
      sway: Math.random() * Math.PI * 2,
      shade: Math.random() < 0.5 ? c.leaf : c.leafBright,
    }));
    this.sound = ctx?.sound;
  },

  update(dt, ctx) {
    this.time += dt;
    for (const l of this.leaves) {
      l.y += l.drift * dt;
      l.sway += dt * 1.5;
      l.x += Math.sin(l.sway) * 14 * dt;
      if (l.y > config.height + 12) {
        l.y = -12;
        l.x = Math.random() * config.width;
      }
    }
    if (ctx.input.anyPressed()) {
      ctx.sound?.beep({ from: 520, to: 720, seconds: 0.18, shape: 'sine' });
      ctx.scenes.go('play');
    }
  },

  draw(ctx) {
    const { width, height } = config;

    // Soft sky.
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, c.background);
    g.addColorStop(1, c.backgroundSoft);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // Drifting leaves.
    for (const l of this.leaves) {
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = l.shade;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // A row of little hedges along the bottom, like a garden bed.
    const hedgeY = height - 60;
    for (let i = 0; i < Math.ceil(width / 36) + 1; i += 1) {
      const hx = i * 36 - 8;
      ctx.fillStyle = c.hedgeDeep;
      ctx.beginPath();
      ctx.arc(hx + 18, hedgeY + 10, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.hedge;
      ctx.beginPath();
      ctx.arc(hx + 18, hedgeY + 6, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.leaf;
      ctx.beginPath();
      ctx.arc(hx + 12, hedgeY + 2, 7, 0, Math.PI * 2);
      ctx.arc(hx + 24, hedgeY + 4, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // The giraffe peeking up from behind the hedge.
    this.drawGiraffe(ctx, width / 2 - 60, hedgeY - 40);

    // Title and tagline.
    text(ctx, {
      value: config.title,
      x: width / 2,
      y: height / 2 - 50,
      size: theme.sizes.title,
      color: c.ink,
      font: theme.fonts.display,
      align: 'center',
      shadow: c.shadow,
    });

    const breathe = 0.6 + Math.abs(Math.sin(this.time * 1.1)) * 0.4;
    text(ctx, {
      value: config.tagline,
      x: width / 2,
      y: height / 2 + 10,
      size: theme.sizes.body,
      color: c.inkSoft,
      font: theme.fonts.body,
      align: 'center',
      weight: '400',
      alpha: breathe,
    });

    text(ctx, {
      value: 'Press any key or tap to begin',
      x: width / 2,
      y: height - 28,
      size: theme.sizes.small,
      color: c.inkSoft,
      font: theme.fonts.body,
      align: 'center',
      weight: '400',
      alpha: 0.7 + breathe * 0.3,
    });
  },

  drawGiraffe(ctx, x, y) {
    // A small, simple giraffe head peeking over the hedge.
    ctx.save();
    ctx.translate(x, y);
    // Neck.
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.moveTo(-6, 40);
    ctx.lineTo(2, 0);
    ctx.lineTo(16, 2);
    ctx.lineTo(10, 40);
    ctx.closePath();
    ctx.fill();
    // Head.
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.ellipse(8, -4, 12, 9, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Snout.
    ctx.fillStyle = c.accentDeep;
    ctx.beginPath();
    ctx.ellipse(16, -1, 5, 6, -0.1, 0, Math.PI * 2);
    ctx.fill();
    // Horns.
    ctx.strokeStyle = c.accentDeep;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(4, -12); ctx.lineTo(2, -20);
    ctx.moveTo(12, -13); ctx.lineTo(14, -21);
    ctx.stroke();
    // Eye.
    ctx.fillStyle = c.ink;
    ctx.beginPath();
    ctx.arc(12, -5, 1.8, 0, Math.PI * 2);
    ctx.fill();
    // Spots.
    ctx.fillStyle = c.accentDeep;
    ctx.beginPath();
    ctx.arc(4, 10, 3, 0, Math.PI * 2);
    ctx.arc(-2, 24, 2.5, 0, Math.PI * 2);
    ctx.arc(8, 26, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
