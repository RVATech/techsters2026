/**
 * scenes.js — a "scene" is one screen of the game: the title screen, the
 * playing screen, the you-won screen, the shop, the level select…
 *
 * Each scene is an object that can have:
 *   enter(data)  — runs once when the scene starts (set up, reset the score)
 *   update(dt)   — runs every frame (move things, check for collisions)
 *   draw(ctx)    — runs every frame (paint the picture)
 *   exit()       — runs once when leaving the scene (clean up)
 *
 * Switching screens is then just:  scenes.go('play', { level: 2 })
 */

export function createScenes(context) {
  const registry = new Map();
  let current = null;
  let currentName = null;

  const scenes = {
    /** Give a scene a name so it can be switched to later. */
    add(name, scene) {
      registry.set(name, scene);
      return scenes;
    },

    /** Switch to another scene. `data` is passed to that scene's enter(). */
    go(name, data = {}) {
      const next = registry.get(name);
      if (!next) {
        console.warn(`There is no scene called "${name}".`);
        return;
      }
      current?.exit?.(context);
      current = next;
      currentName = name;
      current.enter?.(data, context);
    },

    get name() {
      return currentName;
    },

    update(dt) {
      current?.update?.(dt, context);
    },

    draw(ctx) {
      current?.draw?.(ctx, context);
    },
  };

  return scenes;
}
