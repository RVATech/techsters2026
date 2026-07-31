/**
 * fireworks.js — the celebration when the giraffe reaches the heart of the maze.
 *
 * Coloured bursts pop one after another around the heart, using the shared
 * particle helper. A little screen-shake makes each pop feel like a real
 * firework.
 */

import { randomRange } from '../engine/utils.js';
import { theme } from './theme.js';

const c = theme.colors;
const COLORS = [c.accent, c.highlight, c.leaf, c.leafBright, c.heart, c.accentDeep];

export function createFireworks() {
  const pops = [];
  let shake = 0;

  function launch(originX, originY, particles) {
    pops.push({
      x: originX + randomRange(-120, 120),
      y: originY + randomRange(-90, 30),
      delay: randomRange(0, 0.15),
      age: 0,
      done: false,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
    void particles;
  }

  function update(dt, particles) {
    shake = Math.max(0, shake - dt * 18);
    for (const pop of pops) {
      if (pop.done) continue;
      pop.age += dt;
      if (pop.age >= pop.delay && !pop.done) {
        pop.done = true;
        particles.burst({
          x: pop.x,
          y: pop.y,
          count: 26,
          color: pop.color,
          speed: 240,
          size: 5,
          life: 0.9,
          gravity: 120,
        });
        shake = 3;
      }
    }
  }

  function drawDecorations(ctx, time, heartX, heartY) {
    // A warm glow behind the heart that pulses gently.
    const pulse = 0.5 + Math.sin(time * 3) * 0.5;
    ctx.save();
    ctx.globalAlpha = 0.35 + pulse * 0.3;
    ctx.fillStyle = c.heartGlow;
    ctx.beginPath();
    ctx.arc(heartX, heartY, 16 + pulse * 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // The heart itself.
    drawHeart(ctx, heartX, heartY, 10, c.heart);
  }

  function getShake() {
    if (shake <= 0) return { x: 0, y: 0 };
    return { x: randomRange(-shake, shake), y: randomRange(-shake, shake) };
  }

  return { launch, update, drawDecorations, getShake };
}

function drawHeart(ctx, x, y, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + r * 0.7);
  ctx.bezierCurveTo(x - r * 1.4, y - r * 0.3, x - r * 0.5, y - r * 1.2, x, y - r * 0.3);
  ctx.bezierCurveTo(x + r * 0.5, y - r * 1.2, x + r * 1.4, y - r * 0.3, x, y + r * 0.7);
  ctx.fill();
  ctx.restore();
}
