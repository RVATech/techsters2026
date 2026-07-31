/**
 * get-icons.mjs — pulls single icons out of the big icon libraries and saves
 * them as small .svg files in public/assets/icons/.
 *
 * Two libraries are installed:
 *   game-icons  — 4,100+ game pictures: swords, potions, monsters, hearts,
 *                 crowns, spells (from game-icons.net, CC BY 3.0)
 *   lucide      — 1,800+ clean interface pictures: play, pause, settings,
 *                 arrows, stars (ISC licence)
 *
 *   npm run icons                        -> how to use this
 *   npm run icons -- search potion       -> find icons with "potion" in the name
 *   npm run icons -- game-icons:beer-stein lucide:play
 *
 * Icons are saved with the colour left open, so the game can tint them to any
 * colour later without needing a second file.
 */

import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'assets', 'icons');

const LIBRARIES = {
  'game-icons': '@iconify-json/game-icons/icons.json',
  lucide: '@iconify-json/lucide/icons.json',
};

function loadLibrary(prefix) {
  const path = LIBRARIES[prefix];
  if (!path) throw new Error(`Unknown icon library "${prefix}". Try: ${Object.keys(LIBRARIES).join(', ')}`);
  return require(path);
}

function toSvg(library, name) {
  const icon = library.icons[name];
  if (!icon) return null;

  const width = icon.width ?? library.width ?? 24;
  const height = icon.height ?? library.height ?? 24;
  const left = icon.left ?? library.left ?? 0;
  const top = icon.top ?? library.top ?? 0;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left} ${top} ${width} ${height}"`,
    ` width="${width}" height="${height}">`,
    icon.body,
    '</svg>',
  ].join('');
}

function search(term) {
  const needle = term.toLowerCase();
  let total = 0;

  for (const prefix of Object.keys(LIBRARIES)) {
    const library = loadLibrary(prefix);
    const hits = Object.keys(library.icons).filter((n) => n.includes(needle));
    total += hits.length;

    console.log(`\n  ${prefix} — ${hits.length} match${hits.length === 1 ? '' : 'es'}`);
    for (const name of hits.slice(0, 40)) console.log(`    ${prefix}:${name}`);
    if (hits.length > 40) console.log(`    ...and ${hits.length - 40} more`);
  }

  if (total === 0) console.log(`\n  Nothing matched "${term}". Try a simpler word.`);
  console.log('');
}

async function extract(fullNames) {
  await mkdir(OUT_DIR, { recursive: true });
  const cache = new Map();
  let saved = 0;

  for (const fullName of fullNames) {
    const [prefix, name] = fullName.includes(':') ? fullName.split(':') : ['game-icons', fullName];

    try {
      if (!cache.has(prefix)) cache.set(prefix, loadLibrary(prefix));
      const svg = toSvg(cache.get(prefix), name);

      if (!svg) {
        console.log(`  ?  ${fullName} — no icon with that name (try: npm run icons -- search ${name.split('-')[0]})`);
        continue;
      }

      await writeFile(join(OUT_DIR, `${name}.svg`), svg);
      console.log(`  +  ${name}.svg`);
      saved += 1;
    } catch (error) {
      console.log(`  !  ${fullName} — ${error.message}`);
    }
  }

  console.log(`\n  ${saved} icon${saved === 1 ? '' : 's'} saved to public/assets/icons/\n`);
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));

  if (args[0] === 'search') {
    if (!args[1]) return console.log('\n  Say what to search for:  npm run icons -- search sword\n');
    return search(args.slice(1).join('-'));
  }

  if (args.length === 0) {
    console.log(`
  Find an icon:      npm run icons -- search sword
  Save some icons:   npm run icons -- game-icons:broadsword lucide:heart

  Libraries: game-icons (game art), lucide (buttons and menus)
`);
    if (existsSync(OUT_DIR)) {
      const have = (await readdir(OUT_DIR)).filter((f) => f.endsWith('.svg'));
      if (have.length) {
        console.log(`  Already saved (${have.length}): ${have.map((f) => f.replace('.svg', '')).join(', ')}\n`);
      }
    }
    return;
  }

  await extract(args);
}

main();
