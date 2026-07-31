/**
 * theme.js — the look of the game in one place: colours, fonts, sizes.
 *
 * Changing a colour here changes it everywhere at once. That is why the rest
 * of the code says `theme.colors.accent` instead of writing out a colour code
 * over and over.
 *
 * This starter palette is a placeholder. Replace it with the palette chosen
 * for THIS game.
 */

export const theme = {
  colors: {
    background: '#12101f',
    backgroundSoft: '#1d1a30',
    surface: '#282444',
    ink: '#f7f5ff',
    inkSoft: '#b7b0d6',
    accent: '#7cf5c6',
    accentDeep: '#2fbf95',
    highlight: '#ffd166',
    danger: '#ff6b8b',
    shadow: 'rgba(0, 0, 0, 0.35)',
  },

  fonts: {
    display: '"Trebuchet MS", "Verdana", system-ui, sans-serif',
    body: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  },

  sizes: {
    title: 64,
    heading: 34,
    body: 22,
    small: 16,
  },
};
