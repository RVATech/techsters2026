/**
 * giraffe.js — the star of the game, drawn from rounded shapes so she reads
 * as a giraffe at a glance: long neck, little horns, spotted coat.
 *
 * She moves smoothly along the maze paths, eases into turns, and faces the
 * way she's walking. A gentle bob while she walks makes her feel alive.
 */

import { clamp, lerp } from '../engine/utils.js';
import { theme } from './theme.js';

const c = theme.colors;

export function createGiraffe(maze, cellSize) {
  // She starts on the top-left path square, centred in it.
  const startCol = 1;
  const startRow = 1;

  const state = {
    // Position in pixels, measured from the maze's top-left corner.
    x: startCol * cellSize + cellSize / 2,
    y: startRow * cellSize + cellSize / 2,
    // Which maze square she currently occupies.
    col: startCol,
    row: startRow,
    // Smoothed movement, so she eases into walking and turning.
    vx: 0,
    vy: 0,
    facing: 1, // 1 = right, -1 = left
    bob: 0,    // a little hop while walking
    moving: false,
  };

  function update(dt, input, speed, ease) {
    // Read the player's direction as a four-way nudge.
    const ax = input.axis();
    let dx = ax.x;
    let dy = ax.y;

    // Make diagonal movement feel even by sticking to the stronger axis.
    if (Math.abs(dx) > 0 && Math.abs(dy) > 0) {
      if (Math.abs(dx) > Math.abs(dy)) dy = 0;
      else dx = 0;
    }

    // Ease the velocity toward the target so starts and stops feel soft.
    const targetVx = dx * speed;
    const targetVy = dy * speed;
    state.vx = lerp(state.vx, targetVx, ease);
    state.vy = lerp(state.vy, targetVy, ease);

    // Work out where she'd like to be, then nudge her there square by square
    // so she can't cut across a hedge.
    const wantX = state.x + state.vx * dt;
    const wantY = state.y + state.vy * dt;

    // Try moving horizontally first, then vertically. Each is only allowed if
    // the destination square (checked at her edges) is a path.
    const half = cellSize * 0.32;

    if (wantX !== state.x) {
      const nx = clamp(wantX, half, maze.cols * cellSize - half);
      const checkCol = Math.floor(nx / cellSize);
      const row = Math.floor(state.y / cellSize);
      if (maze.isPath(checkCol, row)) {
        state.x = nx;
        if (dx !== 0) state.facing = dx > 0 ? 1 : -1;
      } else {
        state.vx = 0;
      }
    }

    if (wantY !== state.y) {
      const ny = clamp(wantY, half, maze.rows * cellSize - half);
      const col = Math.floor(state.x / cellSize);
      const checkRow = Math.floor(ny / cellSize);
      if (maze.isPath(col, checkRow)) {
        state.y = ny;
      } else {
        state.vy = 0;
      }
    }

    // Track which square she's in and whether she's actually moving.
    state.col = Math.floor(state.x / cellSize);
    state.row = Math.floor(state.y / cellSize);
    const speedNow = Math.hypot(state.vx, state.vy);
    state.moving = speedNow > 8;

    // A gentle bob while she walks, frozen when she stands still.
    if (state.moving) {
      state.bob += dt * 9;
    } else {
      state.bob *= 0.9;
    }
  }

  function draw(ctx, ox, oy, scale) {
    // Draw her facing left or right; the whole shape mirrors for direction.
    const s = scale;
    const bobY = state.moving ? Math.sin(state.bob) * 1.4 : Math.sin(performance.now() / 700) * 0.8;
    const baseX = ox + state.x;
    const baseY = oy + state.y + bobY;
    const dir = state.facing;

    ctx.save();
    ctx.translate(baseX, baseY);
    ctx.scale(dir, 1);

    // Soft shadow on the ground.
    ctx.fillStyle = c.shadow;
    ctx.beginPath();
    ctx.ellipse(0, s * 0.34, s * 0.26, s * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body — a rounded tummy.
    ctx.fillStyle = c.accent;
    roundRect(ctx, -s * 0.22, -s * 0.02, s * 0.44, s * 0.28, s * 0.12);
    ctx.fill();

    // Legs — four little stumps.
    ctx.fillStyle = c.accentDeep;
    const legW = s * 0.07;
    const legH = s * 0.14;
    roundRect(ctx, -s * 0.17, s * 0.20, legW, legH, legW * 0.4); ctx.fill();
    roundRect(ctx, -s * 0.05, s * 0.20, legW, legH, legW * 0.4); ctx.fill();
    roundRect(ctx, s * 0.04, s * 0.20, legW, legH, legW * 0.4); ctx.fill();
    roundRect(ctx, s * 0.12, s * 0.20, legW, legH, legW * 0.4); ctx.fill();

    // Spots on the body — a few darker patches.
    ctx.fillStyle = c.accentDeep;
    spot(ctx, -s * 0.05, s * 0.08, s * 0.05);
    spot(ctx, s * 0.08, s * 0.04, s * 0.045);
    spot(ctx, s * 0.02, s * 0.16, s * 0.04);
    spot(ctx, -s * 0.14, s * 0.06, s * 0.035);

    // Neck — long and leaning forward.
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.moveTo(s * 0.06, s * 0.06);
    ctx.lineTo(s * 0.30, -s * 0.30);
    ctx.lineTo(s * 0.40, -s * 0.26);
    ctx.lineTo(s * 0.16, s * 0.10);
    ctx.closePath();
    ctx.fill();

    // A spot on the neck.
    ctx.fillStyle = c.accentDeep;
    spot(ctx, s * 0.18, -s * 0.08, s * 0.035);

    // Head — small oval up at the top of the neck.
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.ellipse(s * 0.36, -s * 0.30, s * 0.13, s * 0.10, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Snout — slightly darker tip of the face.
    ctx.fillStyle = c.accentDeep;
    ctx.beginPath();
    ctx.ellipse(s * 0.45, -s * 0.26, s * 0.06, s * 0.07, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Little horns (ossicones) on top of the head.
    ctx.strokeStyle = c.accentDeep;
    ctx.lineWidth = s * 0.03;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(s * 0.32, -s * 0.38); ctx.lineTo(s * 0.30, -s * 0.46);
    ctx.moveTo(s * 0.40, -s * 0.39); ctx.lineTo(s * 0.42, -s * 0.47);
    ctx.stroke();
    // Hairy tips.
    ctx.fillStyle = c.accentDeep;
    spot(ctx, s * 0.30, -s * 0.47, s * 0.022);
    spot(ctx, s * 0.42, -s * 0.48, s * 0.022);

    // Eye — a friendly dot looking forward.
    ctx.fillStyle = c.ink;
    spot(ctx, s * 0.40, -s * 0.32, s * 0.018);

    // Ear — a little leaf shape at the back of the head.
    ctx.fillStyle = c.leaf;
    ctx.beginPath();
    ctx.ellipse(s * 0.27, -s * 0.34, s * 0.05, s * 0.035, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Tail — a thin flick behind the body.
    ctx.strokeStyle = c.accentDeep;
    ctx.lineWidth = s * 0.025;
    ctx.beginPath();
    ctx.moveTo(-s * 0.22, s * 0.04);
    ctx.quadraticCurveTo(-s * 0.30, s * 0.12, -s * 0.28, s * 0.22);
    ctx.stroke();

    ctx.restore();
  }

  return {
    state,
    update,
    draw,
    get col() { return state.col; },
    get row() { return state.row; },
    get x() { return state.x; },
    get y() { return state.y; },
  };
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

function spot(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
