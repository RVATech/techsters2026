/**
 * particles.js — little bursts of colour: sparkles when you collect something,
 * dust when you land, confetti when you win.
 *
 * Small touches like this are what make a game feel good to play.
 *
 *   const sparkles = createParticles();
 *   sparkles.burst({ x: 100, y: 100, color: '#ffd166', count: 12 });
 *   // then in update:  sparkles.update(dt)
 *   // and in draw:     sparkles.draw(ctx)
 */

import { randomRange } from './utils.js';

export function createParticles({ max = 400 } = {}) {
  let items = [];

  return {
    burst({
      x,
      y,
      count = 10,
      color = '#ffffff',
      speed = 160,
      size = 4,
      life = 0.6,
      gravity = 240,
      spread = Math.PI * 2,
      direction = 0,
    }) {
      for (let i = 0; i < count; i += 1) {
        if (items.length >= max) break;
        const angle = direction + randomRange(-spread / 2, spread / 2);
        const power = randomRange(speed * 0.4, speed);
        items.push({
          x,
          y,
          vx: Math.cos(angle) * power,
          vy: Math.sin(angle) * power,
          size: randomRange(size * 0.6, size),
          color,
          gravity,
          life: randomRange(life * 0.6, life),
          maxLife: life,
        });
      }
    },

    update(dt) {
      for (const p of items) {
        p.life -= dt;
        p.vy += p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      items = items.filter((p) => p.life > 0);
    },

    draw(ctx) {
      ctx.save();
      for (const p of items) {
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.restore();
    },

    clear() {
      items = [];
    },

    get count() {
      return items.length;
    },
  };
}
