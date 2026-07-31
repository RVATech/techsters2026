/**
 * loop.js — runs the game over and over, about 60 times a second.
 *
 * Each time around it does two things:
 *   1. update(dt) — move everything a tiny bit. `dt` is how many seconds
 *      passed since the last frame, so the game runs at the same speed on
 *      a fast computer and a slow one.
 *   2. draw() — paint the new picture.
 */

export function startLoop({ update, draw, onFrameEnd }) {
  let last = performance.now();
  let running = true;
  let rafId = 0;

  function frame(now) {
    if (!running) return;

    // Seconds since the last frame, capped so a hiccup doesn't teleport
    // everything across the screen.
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;

    update(dt);
    draw();
    onFrameEnd?.();

    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);

  return {
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
    resume() {
      if (running) return;
      running = true;
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    },
  };
}
