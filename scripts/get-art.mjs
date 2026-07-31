/**
 * get-art.mjs — downloads free art packs from kenney.nl into public/assets/art/.
 *
 * Kenney's packs are CC0 (public domain): free to use in anything, including
 * things you share or sell, with no attribution required.
 *
 *   npm run art                 -> list the packs in the catalog
 *   npm run art -- tiny-town    -> download one pack
 *   npm run art -- ui-pack puzzle-pack   -> download several
 *
 * Any slug from a kenney.nl/assets/<slug> page works, not just the catalog.
 */

import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'assets', 'art');

/** A starting shortlist. Any other kenney.nl slug works too. */
const CATALOG = {
  'tiny-dungeon': 'Top-down dungeon: heroes, monsters, chests, walls (16px)',
  'tiny-town': 'Top-down town and countryside: houses, trees, paths (16px)',
  'pixel-platformer': 'Side-on platformer: ground, blocks, characters, coins',
  'ui-pack': 'Buttons, panels, sliders, checkboxes for menus',
  'puzzle-pack': 'Gems, tiles and blocks for match-3 and puzzle games',
  'space-shooter-redux': 'Ships, lasers, asteroids, explosions',
  'emotes-pack': 'Speech bubbles and emotion icons for characters',
  'input-prompts': 'Keyboard, mouse and controller button pictures',
  'animal-pack-redux': 'Simple friendly animal characters',
  'food-kit': 'Food items, good for cooking and cafe games',
  'racing-pack': 'Top-down cars and track pieces',
  'fish-pack': 'Fish and underwater creatures',
};

async function findZipUrl(slug) {
  const pageUrl = `https://kenney.nl/assets/${slug}`;
  const res = await fetch(pageUrl, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Could not open ${pageUrl} (${res.status})`);
  const html = await res.text();

  const match = html.match(/https:\/\/kenney\.nl\/media\/pages\/assets\/[^'"]+\.zip/);
  if (!match) throw new Error(`No download link found on ${pageUrl}`);
  return match[0];
}

/** Reads a standard .zip file. Enough for the packs on kenney.nl. */
function unzip(buffer) {
  const files = [];

  // The table of contents lives at the very end of a zip file.
  let end = -1;
  for (let i = buffer.length - 22; i >= 0 && i > buffer.length - 66000; i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      end = i;
      break;
    }
  }
  if (end === -1) throw new Error('Not a readable zip file');

  const count = buffer.readUInt16LE(end + 10);
  let pos = buffer.readUInt32LE(end + 16);

  for (let i = 0; i < count; i += 1) {
    if (buffer.readUInt32LE(pos) !== 0x02014b50) break;

    const method = buffer.readUInt16LE(pos + 10);
    const compressedSize = buffer.readUInt32LE(pos + 20);
    const nameLength = buffer.readUInt16LE(pos + 28);
    const extraLength = buffer.readUInt16LE(pos + 30);
    const commentLength = buffer.readUInt16LE(pos + 32);
    const localOffset = buffer.readUInt32LE(pos + 42);
    const name = buffer.toString('utf8', pos + 46, pos + 46 + nameLength);

    pos += 46 + nameLength + extraLength + commentLength;

    if (name.endsWith('/')) continue; // a folder, not a file

    // Jump to the file's own header to find where its data really starts.
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const raw = buffer.subarray(dataStart, dataStart + compressedSize);

    try {
      files.push({ name, data: method === 0 ? raw : inflateRawSync(raw) });
    } catch {
      // Skip anything unusual rather than failing the whole download.
    }
  }

  return files;
}

const KEEP = /\.(png|jpg|jpeg|svg|ogg|mp3|wav|xml|json|txt|md|ttf|otf|woff2?)$/i;

async function getPack(slug) {
  process.stdout.write(`\n  ${slug} ... `);

  const zipUrl = await findZipUrl(slug);
  const res = await fetch(zipUrl);
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());

  const files = unzip(buffer).filter((f) => KEEP.test(f.name) && !f.name.includes('__MACOSX'));
  const packDir = join(OUT_DIR, slug);

  for (const file of files) {
    // Zip files can contain "../" paths; refuse anything that escapes the folder.
    const safeName = file.name.split('/').filter((p) => p && p !== '.' && p !== '..').join('/');
    if (!safeName) continue;
    const target = join(packDir, safeName);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.data);
  }

  console.log(`${files.length} files -> public/assets/art/${slug}/`);
}

async function main() {
  const wanted = process.argv.slice(2).filter((a) => !a.startsWith('-'));

  if (wanted.length === 0) {
    console.log('\nFree art packs you can add (all public domain, from kenney.nl):\n');
    for (const [slug, description] of Object.entries(CATALOG)) {
      const have = existsSync(join(OUT_DIR, slug)) ? '[installed]' : '           ';
      console.log(`  ${have} ${slug.padEnd(22)} ${description}`);
    }
    console.log('\n  Add one with:  npm run art -- tiny-town');
    console.log('  Browse more at https://kenney.nl/assets\n');

    if (existsSync(OUT_DIR)) {
      const installed = await readdir(OUT_DIR);
      if (installed.length) console.log(`  Already here: ${installed.join(', ')}\n`);
    }
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  let failed = 0;

  for (const slug of wanted) {
    try {
      await getPack(slug);
    } catch (error) {
      failed += 1;
      console.log(`could not get it — ${error.message}`);
    }
  }

  console.log(failed ? '\nSome packs did not download.\n' : '\nDone.\n');
}

main();
