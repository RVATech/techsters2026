/**
 * theme.js — the look of the game in one place: colours, fonts, sizes.
 *
 * Changing a colour here changes it everywhere at once. That is why the rest
 * of the code says `theme.colors.accent` instead of writing out a colour code
 * over and over.
 *
 * Palette: warm greens and golds for a cozy, sunny-garden feel.
 */

export const theme = {
  colors: {
    // The sky behind the maze.
    background: '#eaf3df',
    backgroundSoft: '#d6e8c6',
    // Walkable paths through the maze — soft earth.
    path: '#f4ead2',
    pathShade: '#e6dab9',
    // Hedges: the leafy walls she eats her way past.
    hedge: '#6fae54',
    hedgeDeep: '#4f8a3a',
    hedgeTrunk: '#7a5a3a',
    // Leaves that sit on the hedges and disappear when eaten.
    leaf: '#a7d96b',
    leafBright: '#cbf08a',
    // The celebration heart in the middle of the maze.
    heart: '#ff8a9b',
    heartGlow: '#ffd9e0',
    // Text and ink.
    ink: '#3a3326',
    inkSoft: '#6b6452',
    surface: '#fffaf0',
    // Sparks for fireworks — warm golds, pinks, and greens.
    accent: '#ffd166',
    accentDeep: '#f4a93f',
    highlight: '#ff8a9b',
    danger: '#ff6b8b',
    shadow: 'rgba(40, 30, 15, 0.25)',
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
