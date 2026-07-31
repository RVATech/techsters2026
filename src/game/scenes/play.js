/**
 * play.js — the heart of the game: the maze, the giraffe, the nibbling, and the
 * fireworks when she reaches the middle.
 *
 * Everything below is about what the player sees and feels. The numbers that
 * tune how fast she walks, how far she can nibble, and how long the fireworks
 * last all live in config.js.
 */

import { rect, text, verticalGradient } from '../../engine/draw.js';
import { config } from '../config.js';
import { theme } from '../theme.js';
import { createMaze } from '../maze.js';
import { createGiraffe } from '../giraffe.js';
import { createHedges } from '../hedges.js';
import { createFireworks } from '../fireworks.js';

const c = theme.colors;

export const playScene = {
  enter() {
    this.time = 0;
    this.won = false;
    this.winTimer = 0;
    this.fireworksCount = 0;

    // Build a fresh maze every time.
    this.maze = createMaze(config.mazeCols, config.mazeRows);
    this.cellSize = config.cellSize;

    // Centre the maze on screen.
    this.ox = Math.floor((config.width - this.maze.cols * this.cellSize) / 2);
    this.oy = Math.floor((config.height - this.maze.rows * this.cellSize) / 2);

    // The heart of the maze, in screen coordinates.
    this.heartX = this.ox + this.maze.midX * this.cellSize + this.cellSize / 2;
    this.heartY = this.oy + this.maze.midY * this.cellSize + this.cellSize / 2;

    this.giraffe = createGiraffe(this.maze, this.cellSize);
    this.hedges = createHedges(this.maze, this.cellSize);
    this.fireworks = createFireworks();
  },

  update(dt, ctx) {
    this.time += dt;

    if (!this.won) {
      this.giraffe.update(dt, ctx.input, config.giraffeSpeed, config.giraffeEase);

      // Nibble leaves as she walks past hedges.
      this.hedges.update(dt, this.giraffe, config.eatRange, (lx, ly, shade) => {
        ctx.particles.burst({
          x: lx, y: ly, count: 5, color: shade, speed: 70, size: 4, life: 0.5, gravity: 200,
        });
        // A soft little munch sound.
        ctx.sound.beep({ from: 300 + Math.random() * 120, to: 180, seconds: 0.08, shape: 'sine', volume: 0.3 });
      });

      // Has she reached the heart?
      if (this.giraffe.col === this.maze.midX && this.giraffe.row === this.maze.midY) {
        this.won = true;
        this.winTimer = 0;
        // Launch the first firework straight away.
        this.fireworks.launch(this.heartX, this.heartY, ctx.particles);
        ctx.sound.beep({ from: 440, to: 880, seconds: 0.4, shape: 'sine', volume: 0.6 });
      }
    } else {
      this.winTimer += dt;
      this.fireworks.update(dt, ctx.particles);
      // Keep launching fireworks through the celebration.
      if (this.winTimer < config.fireworksDuration && this.winTimer > this.fireworksCount * 0.35) {
        this.fireworks.launch(this.heartX, this.heartY, ctx.particles);
        this.fireworksCount += 1;
        ctx.sound.beep({ from: 500 + Math.random() * 200, to: 1200, seconds: 0.3, shape: 'triangle', volume: 0.5 });
      }

      // After the show, let the player go again or return to the title.
      if (this.winTimer > config.fireworksDuration + 0.5) {
        if (ctx.input.anyPressed()) {
          if (ctx.input.held('action') || ctx.input.pressed('jump') || ctx.input.pressed('action')) {
            // New maze.
            ctx.scenes.go('play');
          } else {
            ctx.scenes.go('welcome');
          }
        }
      }
    }
  },

  draw(ctx) {
    const { width, height } = config;

    // Soft sky behind the maze.
    verticalGradient(ctx, { x: 0, y: 0, w: width, h: height, from: c.background, to: c.backgroundSoft });

    // A gentle screen shake during fireworks.
    const shake = this.won ? this.fireworks.getShake() : { x: 0, y: 0 };
    ctx.save();
    ctx.translate(shake.x, shake.y);

    // Paths and hedges.
    this.drawPaths(ctx);
    this.hedges.draw(ctx, this.ox, this.oy, this.time);

    // The heart of the maze, glowing.
    this.fireworks.drawDecorations(ctx, this.time, this.heartX, this.heartY);

    // The giraffe, drawn on top so she's always visible.
    const scale = this.cellSize * config.giraffeScale;
    this.giraffe.draw(ctx, this.ox, this.oy, scale);

    ctx.restore();

    // On-screen hints and the win banner (drawn over the shake so text stays steady).
    this.drawHints(ctx, width, height);
  },

  drawPaths(ctx) {
    // Lay down soft earth on every path square.
    for (let row = 0; row < this.maze.rows; row += 1) {
      for (let col = 0; col < this.maze.cols; col += 1) {
        if (!this.maze.isPath(col, row)) continue;
        const x = this.ox + col * this.cellSize;
        const y = this.oy + row * this.cellSize;
        rect(ctx, { x, y, w: this.cellSize, h: this.cellSize, color: c.path });
        // A faint checker for texture.
        if ((col + row) % 2 === 0) {
          rect(ctx, { x, y, w: this.cellSize, h: this.cellSize, color: c.pathShade, alpha: 0.35 });
        }
      }
    }
  },

  drawHints(ctx, width, height) {
    if (!this.won) {
      text(ctx, {
        value: 'Use the arrow keys or WASD to wander',
        x: width / 2,
        y: 26,
        size: theme.sizes.small,
        color: c.inkSoft,
        font: theme.fonts.body,
        align: 'center',
        weight: '400',
        alpha: 0.8,
      });
      return;
    }

    const showPrompt = this.winTimer > config.fireworksDuration + 0.5;
    const breathe = 0.6 + Math.abs(Math.sin(this.time * 1.2)) * 0.4;

    text(ctx, {
      value: 'You found the heart!',
      x: width / 2,
      y: height / 2 - 120,
      size: theme.sizes.heading,
      color: c.ink,
      font: theme.fonts.display,
      align: 'center',
      shadow: c.shadow,
    });

    if (showPrompt) {
      text(ctx, {
        value: 'Press space for a new maze — any other key for the title',
        x: width / 2,
        y: height - 40,
        size: theme.sizes.small,
        color: c.inkSoft,
        font: theme.fonts.body,
        align: 'center',
        weight: '400',
        alpha: breathe,
      });
    }
  },
};
