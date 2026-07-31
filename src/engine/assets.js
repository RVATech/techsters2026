/**
 * assets.js — loads pictures and sounds before the game starts, so nothing
 * pops in late.
 *
 * Put image and audio files in the `public/assets/` folder, then:
 *
 *   const assets = await loadAssets({
 *     images: { hero: '/assets/hero.png', sky: '/assets/sky.png' },
 *     sounds: { coin: '/assets/coin.mp3' },
 *   });
 *   assets.images.hero  // ready to draw
 */

export async function loadAssets({ images = {}, sounds = {}, onProgress } = {}) {
  const entries = [
    ...Object.entries(images).map(([k, v]) => ['image', k, v]),
    ...Object.entries(sounds).map(([k, v]) => ['sound', k, v]),
  ];

  let done = 0;
  const loaded = { images: {}, sounds: {} };

  await Promise.all(
    entries.map(async ([kind, key, url]) => {
      try {
        if (kind === 'image') {
          loaded.images[key] = await loadImage(url);
        } else {
          loaded.sounds[key] = await loadAudio(url);
        }
      } catch {
        // A missing file should never stop the game from starting.
        console.warn(`Could not load ${url}`);
      }
      done += 1;
      onProgress?.(done / entries.length);
    })
  );

  return loaded;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function loadAudio(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = reject;
    audio.preload = 'auto';
    audio.src = url;
  });
}
