# Art, icons, and sound

> Reference for the assistant and for mentors — not something a student needs
> to read.

Everything here is free to use in any project, including one that is shared
publicly.

## What's already in the project

Bundled under `public/assets/art/`. All from [kenney.nl](https://kenney.nl),
released under **CC0 (public domain)** — no attribution required.

| Folder | Grid | Contents |
| --- | --- | --- |
| `tiny-dungeon/` | 16×16 | Top-down heroes, monsters, chests, walls, floors |
| `tiny-town/` | 16×16 | Top-down houses, trees, paths, fences, townspeople |
| `pixel-platformer/` | 18×18 tiles, 24×24 characters | Side-on ground, blocks, coins, ladders, hazards, walk cycles |
| `pixel-shmup/` | 16×16 | Ships, lasers, asteroids, explosions |
| `ui-pack-pixel-adventure/` | 16×16 | Buttons, panels, sliders, checkboxes, hearts, stars |
| `interface-sounds/` | — | 101 `.ogg` clips: clicks, confirms, errors, toggles |

Each art pack contains:

- `Preview.png` — a picture of everything in the pack
- `Tilemap/tilemap_packed.png` — every tile in one grid, no spacing
- `Tilemap/tilemap.png` — same grid, with 1px spacing between tiles
- `Tiles/` — every tile as its own file, when that's easier
- `License.txt`

Paths and grid settings are already set up in `src/game/art-library.js`:

```js
import { loadSheet } from '../engine/spritesheet.js';
import { ART, SOUNDS, ICONS } from './art-library.js';

const dungeon = await loadSheet(ART.dungeon.sheet, ART.dungeon.grid);
dungeon.name({ hero: 84, chest: 89, wall: 40 });
dungeon.draw(ctx, { name: 'hero', x: 100, y: 100, size: 48 });
```

## Icons

`public/assets/icons/` holds 23 pre-saved SVG icons. They stay sharp at any
size and can be tinted to any colour:

```js
import { loadIcons, drawIconRow } from '../engine/icons.js';

const icons = await loadIcons(['heart', 'star'], { color: '#ff6b8b' });
drawIconRow(ctx, { icon: icons.heart, count: 3, x: 20, y: 20, size: 28 });
```

Pre-saved: `heart star play pause settings volume-2 volume-x trophy clock
coins zap arrow-right rotate-ccw x check broadsword health-potion crown
shield magic-swirl cat sprout musical-notes`

## Adding more

### More art packs

```bash
npm run art                    # list the shortlist, marking what's installed
npm run art -- tiny-battle     # add one
npm run art -- tiny-farm micro-roguelike   # add several
```

Any slug from `https://kenney.nl/assets/<slug>` works, not only the shortlist.
The script scrapes the pack page for its download link, unzips it, and writes
to `public/assets/art/<slug>/`.

Verified 2D packs worth knowing about:

| Slug | Size | Contents |
| --- | --- | --- |
| `tiny-battle` | 128 KB | Top-down units, tanks, terrain |
| `tiny-farm` | 186 KB | Crops, animals, farm buildings |
| `micro-roguelike` | 177 KB | Tiny dungeon crawl set |
| `roguelike-characters` | 61 KB | Character sprites |
| `monochrome-rpg` | 378 KB | Single-colour RPG set |
| `pixel-line-platformer` | 158 KB | Outline-style platformer |
| `pixel-vehicle-pack` | 58 KB | Cars, trucks, bikes |
| `scribble-platformer` | 908 KB | Hand-drawn platformer |
| `scribble-dungeons` | 1.5 MB | Hand-drawn dungeon |
| `shape-characters` | 533 KB | Simple shape characters |
| `monster-builder-pack` | 1.2 MB | Mix-and-match monster parts |
| `googly-eyes` | 195 KB | Eyes to stick on anything |
| `foliage-sprites` | 2.4 MB | Trees, bushes, grass |
| `planets` | 7.2 MB | Planets and space backgrounds |
| `rpg-urban-pack` | 299 KB | Modern town tiles |
| `playing-cards-pack` | 187 KB | Full deck |
| `board-game-icons` | 1.0 MB | Board-game symbols |
| `cursor-pack` | 729 KB | Mouse cursors |
| `minimap-pack` | 83 KB | Minimap symbols |
| `mobile-controls` | 3.1 MB | On-screen touch buttons and sticks |
| `ui-pack-adventure` | 563 KB | Larger fantasy menu set |
| `fantasy-ui-borders` | 350 KB | Ornate frames and borders |
| `input-prompts-pixel` | 319 KB | Key and button pictures for tutorials |
| `impact-sounds` | 782 KB | Hits, bumps, breaks |
| `sci-fi-sounds` | 5.7 MB | Lasers, engines, computers |

3D kits, if a game uses `three`: `space-kit`, `nature-kit`, `platformer-kit`,
`castle-kit`, `city-kit-suburban`, `blocky-characters`, `prototype-kit`,
`holiday-kit`.

Browse everything at <https://kenney.nl/assets>.

### More icons

Two libraries are installed as dependencies — **game-icons** (4,134 game
pictures, CC BY 3.0) and **lucide** (1,817 interface pictures, ISC).

```bash
npm run icons -- search dragon
npm run icons -- game-icons:dragon-head lucide:swords
```

The full libraries are ~6 MB of JSON, so they stay out of the browser bundle —
`npm run icons` extracts only the chosen icons as small `.svg` files.

## Student-made art

Drop image files anywhere under `public/assets/` and load them by path. A game
containing a student's own drawing is worth far more to her than a polished
one that isn't hers — encourage it.

## Licences

- **kenney.nl packs** — CC0 1.0, public domain. No attribution required.
- **game-icons** — CC BY 3.0. Attribution required if the game is published;
  a line in the credits screen or README covers it.
- **lucide** — ISC. No attribution required.
