/**
 * hedges.js — the leafy walls of the maze.
 *
 * Each hedge square starts out bushy with leaves. When the giraffe walks past,
 * she nibbles the leaves off that hedge — they fade and fall away, leaving a
 * bare trunk behind. That makes it easy to see where she has already been.
 *
 * The leaves are scattered randomly per hedge, so every wall looks a little
 * different, and they bob gently as if in a breeze.
 */

import { randomRange } from '../engine/utils.js';
import { theme } from './theme.js';

const c = theme.colors;

export function createHedges(maze, cellSize) {
  // One entry per hedge square, holding its leaves and how eaten it is.
  const hedges = new Map();

  for (let row = 0; row < maze.rows; row += 1) {
    for (let col = 0; col < maze.cols; col += 1) {
      if (maze.grid[row][col] !== 1) continue;
      const leaves = [];
      // How bushy each hedge is — more leaves on hedges beside a path.
      const count = 5 + Math.floor(randomRange(0, 4));
      for (let i = 0; i < count; i += 1) {
        leaves.push({
          // Position of the leaf within the hedge square.
          ox: randomRange(0.18, 0.82),
          oy: randomRange(0.10, 0.70),
          r: randomRange(0.18, 0.30),
          shade: Math.random() < 0.5 ? c.leaf : c.leafBright,
          phase: randomRange(0, Math.PI * 2),
          eaten: false,
          // Falls away when eaten.
          fall: 0,
        });
      }
      hedges.set(`${col},${row}`, { col, row, leaves });
    }
  }

  let munchTimer = 0;

  function update(dt, giraffe, eatRange, onMunch) {
    munchTimer -= dt;
    const gx = giraffe.x;
    const gy = giraffe.y;

    // Update any falling leaves.
    for (const hedge of hedges.values()) {
      for (const leaf of hedge.leaves) {
        if (leaf.eaten && leaf.fall < 1) {
          leaf.fall += dt * 3;
        }
      }
    }

    // Find hedges near the giraffe and nibble their nearest leaf.
    for (const hedge of hedges.values()) {
      const hx = hedge.col * cellSize + cellSize / 2;
      const hy = hedge.row * cellSize + cellSize / 2;
      const d = Math.hypot(hx - gx, hy - gy);
      if (d > eatRange) continue;

      // Find the closest uneaten leaf.
      let nearest = null;
      let nearestD = Infinity;
      for (const leaf of hedge.leaves) {
        if (leaf.eaten) continue;
        const lx = hedge.col * cellSize + leaf.ox * cellSize;
        const ly = hedge.row * cellSize + leaf.oy * cellSize;
        const ld = Math.hypot(lx - gx, ly - gy);
        if (ld < nearestD) {
          nearestD = ld;
          nearest = leaf;
        }
      }

      if (nearest && munchTimer <= 0) {
        nearest.eaten = true;
        munchTimer = 0.12;
        if (onMunch) {
          onMunch(
            hedge.col * cellSize + nearest.ox * cellSize,
            hedge.row * cellSize + nearest.oy * cellSize,
            nearest.shade,
          );
        }
      }
    }
  }

  function draw(ctx, ox, oy, time) {
    for (const hedge of hedges.values()) {
      const x = ox + hedge.col * cellSize;
      const y = oy + hedge.row * cellSize;

      // Trunk — always there, so a bare hedge still looks like a wall.
      ctx.fillStyle = c.hedgeTrunk;
      ctx.fillRect(x + cellSize * 0.42, y + cellSize * 0.55, cellSize * 0.16, cellSize * 0.40);

      // Deep hedge base behind the leaves.
      ctx.fillStyle = c.hedgeDeep;
      roundRect(ctx, x + 1, y + 1, cellSize - 2, cellSize - 2, cellSize * 0.25);
      ctx.fill();

      // Leaves — only the uneaten ones sit on the hedge; eaten ones fall.
      for (const leaf of hedge.leaves) {
        if (leaf.eaten && leaf.fall >= 1) continue;
        const sway = Math.sin(time * 1.5 + leaf.phase) * 1.2;
        const lx = x + leaf.ox * cellSize + sway;
        let ly = y + leaf.oy * cellSize;
        let alpha = 1;
        if (leaf.eaten) {
          ly += leaf.fall * cellSize * 1.5;
          alpha = 1 - leaf.fall;
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = leaf.shade;
        ctx.beginPath();
        ctx.arc(lx, ly, leaf.r * cellSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  return { update, draw };
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
