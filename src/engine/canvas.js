/**
 * canvas.js — sets up the drawing surface for the game.
 *
 * The game is always drawn as if the screen were exactly `width` x `height`
 * pixels (the "design size"). This file stretches that to fit whatever screen
 * the player is on — phone, tablet, or laptop — without squishing anything.
 */

export function createCanvas({
  parent,
  width = 960,
  height = 540,
  background = '#12101f',
  pixelArt = false,
} = {}) {
  const canvas = document.createElement('canvas');
  canvas.id = 'game-canvas';
  const ctx = canvas.getContext('2d', { alpha: false });

  parent.appendChild(canvas);

  // How much the design size is scaled up or down to fit the window.
  let scale = 1;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const box = parent.getBoundingClientRect();

    // Fit the design size inside the available space, keeping the shape.
    scale = Math.min(box.width / width, box.height / height) || 1;

    canvas.style.width = `${Math.floor(width * scale)}px`;
    canvas.style.height = `${Math.floor(height * scale)}px`;
    canvas.width = Math.floor(width * scale * dpr);
    canvas.height = Math.floor(height * scale * dpr);

    // From now on, drawing at (0,0)-(width,height) fills the canvas.
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    ctx.imageSmoothingEnabled = !pixelArt;
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);

  /** Turn a screen position (like a mouse click) into a game position. */
  function toGamePoint(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / (rect.width / width),
      y: (clientY - rect.top) / (rect.height / height),
    };
  }

  /** Paint over everything from last frame. Call this at the top of draw(). */
  function clear(color = background) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }

  return { canvas, ctx, width, height, clear, toGamePoint, resize };
}
