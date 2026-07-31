/**
 * maze.js — builds the maze itself.
 *
 * A maze here is a grid of squares. Every odd-numbered row and column is a
 * path; the squares between them are hedges (leafy walls). The giraffe walks
 * the paths, and can nibble leaves off the hedges she passes.
 *
 * The maze uses "recursive backtracking" — it carves passages by wandering at
 * random, so every maze is different but always solvable, with a winding,
 * cozy feel. The very middle is always open and holds the celebration heart.
 */

export function createMaze(cols, rows) {
  // Make sure cols and rows are odd, so the middle is a path square.
  const w = cols % 2 === 1 ? cols : cols + 1;
  const h = rows % 2 === 1 ? rows : rows + 1;

  // grid: 1 = hedge, 0 = path. Start everything as hedge, then carve paths.
  const grid = Array.from({ length: h }, () => new Array(w).fill(1));

  function carve(cx, cy) {
    grid[cy][cx] = 0;
    // The four directions to try, two squares at a time (skipping the hedge
    // between). Order is shuffled so every maze is different.
    const dirs = [
      [0, -2], [0, 2], [-2, 0], [2, 0],
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && grid[ny][nx] === 1) {
        // Knock out the hedge between the two path squares.
        grid[cy + dy / 2][cx + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);

  // The heart sits on a real carved cell near the middle. Carved cells are at
  // odd indices, so we snap the centre to the nearest odd row and column —
  // that guarantees the heart is reachable, not walled in.
  const midX = nearestOdd(Math.floor(w / 2), w);
  const midY = nearestOdd(Math.floor(h / 2), h);
  grid[midY][midX] = 0;

  return {
    cols: w,
    rows: h,
    grid,
    midX,
    midY,
    isPath(x, y) {
      if (x < 0 || y < 0 || x >= w || y >= h) return false;
      return grid[y][x] === 0;
    },
  };
}

// Snap a value to the nearest odd index inside the grid bounds.
function nearestOdd(v, max) {
  if (v % 2 === 0) v -= 1;
  if (v < 1) v = 1;
  if (v > max - 2) v = max - 2;
  return v;
}
