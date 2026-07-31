/**
 * draw.js — shortcuts for painting shapes, text, and pictures.
 *
 * Everything here takes `ctx` (the paintbrush) as the first thing, and uses
 * plain words for the options, so you can read a line of code and know what
 * it will look like.
 */

/** A filled rectangle. */
export function rect(ctx, { x, y, w, h, color = '#fff', radius = 0, alpha = 1 }) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  if (radius > 0) {
    roundedPath(ctx, x, y, w, h, radius);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
}

/** A rectangle outline. */
export function strokeRect(ctx, { x, y, w, h, color = '#fff', width = 2, radius = 0 }) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (radius > 0) {
    roundedPath(ctx, x, y, w, h, radius);
    ctx.stroke();
  } else {
    ctx.strokeRect(x, y, w, h);
  }
  ctx.restore();
}

/** A filled circle. `x`,`y` is the middle. */
export function circle(ctx, { x, y, r, color = '#fff', alpha = 1 }) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** A line between two points. */
export function line(ctx, { x1, y1, x2, y2, color = '#fff', width = 2 }) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Words on the screen.
 * `align` can be 'left', 'center' or 'right'.
 */
export function text(ctx, {
  value,
  x,
  y,
  size = 24,
  color = '#fff',
  font = 'system-ui, sans-serif',
  align = 'left',
  baseline = 'alphabetic',
  weight = '600',
  alpha = 1,
  shadow = null,
}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  if (shadow) {
    ctx.fillStyle = shadow;
    ctx.fillText(String(value), x + 2, y + 2);
  }
  ctx.fillStyle = color;
  ctx.fillText(String(value), x, y);
  ctx.restore();
}

/** A whole picture, drawn at a position and size. */
export function image(ctx, { img, x, y, w, h, alpha = 1, flipX = false }) {
  if (!img || !img.width) return;
  const width = w ?? img.width;
  const height = h ?? img.height;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (flipX) {
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    ctx.drawImage(img, x, y, width, height);
  }
  ctx.restore();
}

/**
 * One square out of a sprite sheet (a big picture made of many small ones,
 * all the same size, laid out in a grid).
 */
export function sprite(ctx, { sheet, index, cellW, cellH, x, y, w, h, flipX = false }) {
  if (!sheet || !sheet.width) return;
  const perRow = Math.floor(sheet.width / cellW);
  const sx = (index % perRow) * cellW;
  const sy = Math.floor(index / perRow) * cellH;
  const width = w ?? cellW;
  const height = h ?? cellH;
  ctx.save();
  if (flipX) {
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(sheet, sx, sy, cellW, cellH, 0, 0, width, height);
  } else {
    ctx.drawImage(sheet, sx, sy, cellW, cellH, x, y, width, height);
  }
  ctx.restore();
}

/** A top-to-bottom colour fade, good for skies and backgrounds. */
export function verticalGradient(ctx, { x, y, w, h, from, to }) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, from);
  g.addColorStop(1, to);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

function roundedPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
