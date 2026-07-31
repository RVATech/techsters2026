/**
 * input.js — keeps track of what the player is pressing or touching.
 *
 * Works the same for keyboard, mouse, and touch, so a game built with this
 * runs on a laptop and a phone without extra work.
 *
 *   input.held('left')      -> true while the key is down
 *   input.pressed('jump')   -> true only on the frame it was first pushed
 *   input.pointer.x / .y    -> where the finger or mouse is, in game pixels
 *   input.pointer.pressed   -> true on the frame of a tap or click
 */

// Which real keys count as which action. Add your own actions here.
const DEFAULT_BINDINGS = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  jump: ['Space', 'ArrowUp', 'KeyW'],
  action: ['Space', 'Enter', 'KeyZ'],
  pause: ['Escape', 'KeyP'],
};

export function createInput({ canvasHelper, bindings = DEFAULT_BINDINGS } = {}) {
  const down = new Set();       // keys currently held
  const justDown = new Set();   // keys first pushed this frame
  const justUp = new Set();     // keys released this frame

  const pointer = {
    x: 0,
    y: 0,
    down: false,
    pressed: false,   // tap started this frame
    released: false,  // tap ended this frame
  };

  let anyPressedThisFrame = false;

  function keysFor(action) {
    return bindings[action] || [action];
  }

  window.addEventListener('keydown', (e) => {
    // Stop the page from scrolling when arrows or space are used to play.
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
    if (e.repeat) return;
    down.add(e.code);
    justDown.add(e.code);
    anyPressedThisFrame = true;
  });

  window.addEventListener('keyup', (e) => {
    down.delete(e.code);
    justUp.add(e.code);
  });

  // If the player switches tabs, forget everything so keys don't get "stuck".
  window.addEventListener('blur', () => {
    down.clear();
    pointer.down = false;
  });

  function movePointer(clientX, clientY) {
    const p = canvasHelper.toGamePoint(clientX, clientY);
    pointer.x = p.x;
    pointer.y = p.y;
  }

  const el = canvasHelper.canvas;

  el.addEventListener('pointerdown', (e) => {
    el.setPointerCapture?.(e.pointerId);
    movePointer(e.clientX, e.clientY);
    pointer.down = true;
    pointer.pressed = true;
    anyPressedThisFrame = true;
  });

  el.addEventListener('pointermove', (e) => movePointer(e.clientX, e.clientY));

  el.addEventListener('pointerup', (e) => {
    movePointer(e.clientX, e.clientY);
    pointer.down = false;
    pointer.released = true;
  });

  el.addEventListener('pointercancel', () => {
    pointer.down = false;
    pointer.released = true;
  });

  // Don't let a long press pop up the browser's own menu mid-game.
  el.addEventListener('contextmenu', (e) => e.preventDefault());

  return {
    pointer,

    /** True the whole time the action is being held. */
    held(action) {
      return keysFor(action).some((code) => down.has(code));
    },

    /** True only on the single frame the action started. */
    pressed(action) {
      return keysFor(action).some((code) => justDown.has(code));
    },

    /** True only on the single frame the action was let go. */
    released(action) {
      return keysFor(action).some((code) => justUp.has(code));
    },

    /** Handy for "press anything to start" screens. */
    anyPressed() {
      return anyPressedThisFrame || pointer.pressed;
    },

    /** How far left/right and up/down the player is pushing, from -1 to 1. */
    axis() {
      const x = (this.held('right') ? 1 : 0) - (this.held('left') ? 1 : 0);
      const y = (this.held('down') ? 1 : 0) - (this.held('up') ? 1 : 0);
      return { x, y };
    },

    /** Called automatically at the end of every frame. */
    endFrame() {
      justDown.clear();
      justUp.clear();
      pointer.pressed = false;
      pointer.released = false;
      anyPressedThisFrame = false;
    },
  };
}
