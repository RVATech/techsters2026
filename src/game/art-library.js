/**
 * art-library.js — what art is already in this project and how to load it.
 *
 * Everything here is free to use in any project, forever, with no credit
 * required (it is public domain art from kenney.nl).
 *
 * Each art pack comes in two shapes:
 *   Tiles/     — one small picture per file, e.g. Tiles/tile_0084.png
 *   Tilemap/   — every picture in one grid image (faster, fewer files)
 *
 * The settings below already match each pack's grid, so this works:
 *
 *   import { loadSheet } from '../engine/spritesheet.js';
 *   import { ART } from './art-library.js';
 *
 *   const dungeon = await loadSheet(ART.dungeon.sheet, ART.dungeon.grid);
 *   dungeon.draw(ctx, { index: 84, x: 100, y: 100, size: 48 });
 *
 * More packs are one command away — see docs/ART-AND-SOUND.md.
 */

export const ART = {
  /** Top-down dungeon: heroes, monsters, chests, walls, floors. */
  dungeon: {
    sheet: '/assets/art/tiny-dungeon/Tilemap/tilemap_packed.png',
    grid: { cellW: 16, cellH: 16, spacing: 0 },
    columns: 12,
    folder: '/assets/art/tiny-dungeon/Tiles/',
    preview: '/assets/art/tiny-dungeon/Preview.png',
  },

  /** Top-down town and countryside: houses, trees, paths, fences, people. */
  town: {
    sheet: '/assets/art/tiny-town/Tilemap/tilemap_packed.png',
    grid: { cellW: 16, cellH: 16, spacing: 0 },
    columns: 12,
    folder: '/assets/art/tiny-town/Tiles/',
    preview: '/assets/art/tiny-town/Preview.png',
  },

  /** Side-on platformer: ground blocks, coins, ladders, hazards. */
  platformerTiles: {
    sheet: '/assets/art/pixel-platformer/Tilemap/tilemap_packed.png',
    grid: { cellW: 18, cellH: 18, spacing: 0 },
    folder: '/assets/art/pixel-platformer/Tiles/',
    preview: '/assets/art/pixel-platformer/Preview.png',
  },

  /** Side-on platformer characters, with walking frames. */
  platformerCharacters: {
    sheet: '/assets/art/pixel-platformer/Tilemap/tilemap-characters_packed.png',
    grid: { cellW: 24, cellH: 24, spacing: 0 },
    folder: '/assets/art/pixel-platformer/Tiles/Characters/',
  },

  /** Space shooter: ships, lasers, asteroids, explosions. */
  space: {
    sheet: '/assets/art/pixel-shmup/Tilemap/tiles_packed.png',
    grid: { cellW: 16, cellH: 16, spacing: 0 },
    folder: '/assets/art/pixel-shmup/Tiles/',
    preview: '/assets/art/pixel-shmup/Preview.png',
  },

  spaceShips: {
    sheet: '/assets/art/pixel-shmup/Tilemap/ships_packed.png',
    grid: { cellW: 16, cellH: 16, spacing: 0 },
    folder: '/assets/art/pixel-shmup/Ships/',
  },

  /** Menu pieces: buttons, panels, sliders, checkboxes, hearts, stars. */
  ui: {
    sheet: '/assets/art/ui-pack-pixel-adventure/Tilesheets/Small tiles/Thick outline/tilemap_packed.png',
    grid: { cellW: 16, cellH: 16, spacing: 0 },
    folder: '/assets/art/ui-pack-pixel-adventure/Tiles/',
    preview: '/assets/art/ui-pack-pixel-adventure/Preview.png',
  },
};

/**
 * Ready-made sound effects, as file paths.
 * Play one with: sound.play(await loadClip(SOUNDS.click))
 */
export const SOUNDS = {
  folder: '/assets/art/interface-sounds/Audio/',
  click: '/assets/art/interface-sounds/Audio/click_001.ogg',
  confirm: '/assets/art/interface-sounds/Audio/confirmation_001.ogg',
  select: '/assets/art/interface-sounds/Audio/select_001.ogg',
  error: '/assets/art/interface-sounds/Audio/error_001.ogg',
  back: '/assets/art/interface-sounds/Audio/back_001.ogg',
  drop: '/assets/art/interface-sounds/Audio/drop_001.ogg',
};

/**
 * Icons already saved in this project, ready for loadIcons().
 * Add more with:  npm run icons -- search dragon
 */
export const ICONS = [
  'heart', 'star', 'play', 'pause', 'settings', 'volume-2', 'volume-x',
  'trophy', 'clock', 'coins', 'zap', 'arrow-right', 'rotate-ccw', 'x', 'check',
  'broadsword', 'health-potion', 'crown', 'shield', 'magic-swirl',
  'cat', 'sprout', 'musical-notes',
];
