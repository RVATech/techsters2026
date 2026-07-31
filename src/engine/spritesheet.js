/**
 * spritesheet.js — makes it easy to use art packs that come as one big grid
 * picture (a "tilesheet"), like the ones in public/assets/art/.
 *
 * A tilesheet is dozens of small pictures arranged in rows and columns. This
 * helper lets you say "draw square number 84" instead of doing the maths.
 *
 *   const tiles = await loadSheet('/assets/art/tiny-dungeon/Tilemap/tilemap.png', {
 *     cellW: 16, cellH: 16, spacing: 1,
 *   });
 *   tiles.draw(ctx, { index: 84, x: 100, y: 100, size: 48 });
 *
 * You can also give squares nicknames, which makes the game much easier to read:
 *   tiles.name({ hero: 84, chest: 89, wall: 40 });
 *   tiles.draw(ctx, { name: 'hero', x: 100, y: 100, size: 48 });
 */

export async function loadSheet(url, { cellW = 16, cellH = 16, spacing = 0, margin = 0 } = {}) {
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${url}`));
    // encodeURI so folder names containing spaces still work.
    image.src = encodeURI(url);
  });

  const columns = Math.floor((img.width - margin * 2 + spacing) / (cellW + spacing));
  const rows = Math.floor((img.height - margin * 2 + spacing) / (cellH + spacing));
  const names = {};

  return {
    image: img,
    cellW,
    cellH,
    columns,
    rows,
    get count() {
      return columns * rows;
    },

    /** Give squares nicknames: sheet.name({ hero: 84, slime: 108 }) */
    name(map) {
      Object.assign(names, map);
      return this;
    },

    /** Which square number is at a given column and row. */
    at(column, row) {
      return row * columns + column;
    },

    draw(ctx, { index, name, x, y, size, width, height, flipX = false, alpha = 1 }) {
      const cell = name !== undefined ? names[name] : index;
      if (cell === undefined || cell < 0) return;

      const sx = margin + (cell % columns) * (cellW + spacing);
      const sy = margin + Math.floor(cell / columns) * (cellH + spacing);
      const w = width ?? size ?? cellW;
      const h = height ?? size ?? cellH;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.imageSmoothingEnabled = false; // keeps pixel art crisp
      if (flipX) {
        ctx.translate(x + w, y);
        ctx.scale(-1, 1);
        ctx.drawImage(img, sx, sy, cellW, cellH, 0, 0, w, h);
      } else {
        ctx.drawImage(img, sx, sy, cellW, cellH, x, y, w, h);
      }
      ctx.restore();
    },
  };
}

/**
 * Flips between pictures over time to make something look alive — a walking
 * character, a flickering torch, a spinning coin.
 *
 *   const walk = createAnimation({ frames: [84, 85, 86], fps: 8 });
 *   walk.update(dt);
 *   tiles.draw(ctx, { index: walk.frame, x, y, size: 48 });
 */
export function createAnimation({ frames, fps = 8, loop = true }) {
  let time = 0;
  let index = 0;

  return {
    update(dt) {
      time += dt;
      const step = 1 / fps;
      while (time >= step) {
        time -= step;
        index += 1;
        if (index >= frames.length) index = loop ? 0 : frames.length - 1;
      }
    },
    reset() {
      time = 0;
      index = 0;
    },
    get frame() {
      return frames[index];
    },
    get finished() {
      return !loop && index >= frames.length - 1;
    },
  };
}
