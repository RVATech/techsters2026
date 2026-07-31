/**
 * audio.js — sound effects and music.
 *
 * You can make sounds two ways:
 *   1. `sound.beep({ ... })` invents a sound out of nothing. No files needed,
 *      great for coins, jumps, zaps, and bumps while you're still deciding.
 *   2. `sound.play(clip)` plays an audio file you loaded with assets.js.
 *
 * Browsers won't make noise until the player clicks or taps once. This file
 * handles that for you — it just waits for the first tap.
 */

export function createAudio() {
  let ctx = null;
  let muted = false;
  let masterVolume = 0.6;
  let music = null;

  function ensureContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // The first tap or key press unlocks sound for the whole session.
  const unlock = () => ensureContext();
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });

  return {
    /**
     * Invent a sound.
     *   shape: 'sine' (soft), 'square' (retro), 'triangle', 'sawtooth' (buzzy)
     *   from/to: pitch in Hz. Going up sounds happy, going down sounds sad.
     */
    beep({ from = 440, to = from, seconds = 0.12, shape = 'square', volume = 0.5 } = {}) {
      if (muted) return;
      const audioCtx = ensureContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = shape;
      osc.frequency.setValueAtTime(from, now);
      if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), now + seconds);

      // Fade out so it doesn't click at the end.
      gain.gain.setValueAtTime(volume * masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + seconds);

      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + seconds);
    },

    /** Play a loaded audio clip once. */
    play(clip, { volume = 1 } = {}) {
      if (muted || !clip) return;
      const copy = clip.cloneNode();
      copy.volume = Math.min(volume * masterVolume, 1);
      copy.play().catch(() => {});
    },

    /** Start background music looping. Pass the same clip again to keep it going. */
    startMusic(clip, { volume = 0.4 } = {}) {
      if (!clip || music === clip) return;
      this.stopMusic();
      music = clip;
      music.loop = true;
      music.volume = muted ? 0 : volume * masterVolume;
      music.play().catch(() => {});
    },

    stopMusic() {
      if (music) {
        music.pause();
        music.currentTime = 0;
        music = null;
      }
    },

    setMuted(value) {
      muted = value;
      if (music) music.volume = value ? 0 : 0.4 * masterVolume;
    },

    toggleMute() {
      this.setMuted(!muted);
      return muted;
    },

    get muted() {
      return muted;
    },

    setVolume(value) {
      masterVolume = Math.max(0, Math.min(1, value));
    },
  };
}
