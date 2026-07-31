/**
 * icons.js — draws icons (hearts, swords, stars, play buttons…) in the game.
 *
 * Icons live in public/assets/icons/ as .svg files. Add more with:
 *   npm run icons -- search sword
 *   npm run icons -- game-icons:broadsword lucide:heart
 *
 * Because they are drawings rather than photos, they stay perfectly sharp at
 * any size, and any icon can be painted in any colour.
 *
 *   const icons = await loadIcons(['heart', 'broadsword'], { color: '#ff6b8b' });
 *   drawIcon(ctx, { icon: icons.heart, x: 20, y: 20, size: 32 });
 */

const cache = new Map();

/** Load one icon, tinted to a colour. Returns a picture ready to draw. */
export function loadIcon(name, { color = '#ffffff', size = 128 } = {}) {
  const key = `${name}|${color}|${size}`;
  if (cache.has(key)) return cache.get(key);

  const promise = fetch(`/assets/icons/${name}.svg`)
    .then((res) => {
      if (!res.ok) throw new Error(`No icon called "${name}"`);
      return res.text();
    })
    .then((svgText) => {
      // The saved icons leave their colour open, so swapping it is just a
      // find-and-replace before the picture is drawn.
      const tinted = svgText
        .replaceAll('currentColor', color)
        .replace('<svg', `<svg width="${size}" height="${size}"`);

      return toImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(tinted)}`);
    })
    .catch((error) => {
      console.warn(error.message);
      return null;
    });

  cache.set(key, promise);
  return promise;
}

/** Load several icons at once. Returns an object like { heart, star }. */
export async function loadIcons(names, options = {}) {
  const loaded = await Promise.all(names.map((name) => loadIcon(name, options)));
  const result = {};
  names.forEach((name, i) => {
    result[name] = loaded[i];
  });
  return result;
}

/** Paint an icon. `x`,`y` is the top-left corner. */
export function drawIcon(ctx, { icon, x, y, size = 32, alpha = 1 }) {
  if (!icon) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(icon, x, y, size, size);
  ctx.restore();
}

/** Paint an icon centred on a point — handy for things that move. */
export function drawIconCentered(ctx, { icon, x, y, size = 32, alpha = 1 }) {
  drawIcon(ctx, { icon, x: x - size / 2, y: y - size / 2, size, alpha });
}

/** Draw a row of icons, like three hearts for three lives. */
export function drawIconRow(ctx, { icon, count, x, y, size = 32, gap = 6, alpha = 1 }) {
  for (let i = 0; i < count; i += 1) {
    drawIcon(ctx, { icon, x: x + i * (size + gap), y, size, alpha });
  }
}

function toImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
