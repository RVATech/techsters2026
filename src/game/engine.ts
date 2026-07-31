export const COLS = 12;
export const ROWS = 20;

export type Cell = number; // 0 empty, 1..7 color index
export type Grid = Cell[][]; // [row][col], row 0 = top

export interface Piece {
  type: number; // 0..6
  rot: number; // 0..3
  x: number;
  y: number;
}

export interface Unicorn {
  col: number;
  dir: 1 | -1;
  lastEdge: 'left' | 'right';
  crossings: number;
}

export interface GameState {
  board: Grid;
  piece: Piece | null;
  nextType: number;
  unicorn: Unicorn;
  lines: number;
  status: 'idle' | 'running' | 'paused' | 'over';
  softDrop: boolean;
  best: number;
  gravityAcc: number;
  unicornAcc: number;
  flash: number;
}

interface Def {
  name: string;
  color: string;
  base: number[][];
}

const DEFS: Def[] = [
  { name: 'I', color: '#22d3ee', base: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
  { name: 'O', color: '#fbbf24', base: [[1, 1], [1, 1]] },
  { name: 'T', color: '#f472b6', base: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
  { name: 'S', color: '#34d399', base: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
  { name: 'Z', color: '#ef4444', base: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
  { name: 'J', color: '#38bdf8', base: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
  { name: 'L', color: '#f97316', base: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] },
];

export const COLORS = DEFS.map((d) => d.color);
export const PIECE_NAMES = DEFS.map((d) => d.name);

function rotateCW(m: number[][]): number[][] {
  const rows = m.length;
  const cols = m[0].length;
  const out: number[][] = Array.from({ length: cols }, () => Array<number>(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out[c][rows - 1 - r] = m[r][c];
    }
  }
  return out;
}

const ROTATIONS: number[][][][] = DEFS.map((d) => {
  const mats: number[][][] = [d.base];
  let m = d.base;
  for (let i = 0; i < 3; i++) {
    m = rotateCW(m);
    mats.push(m);
  }
  return mats;
});

export function shapeMatrix(type: number, rot: number): number[][] {
  return ROTATIONS[type][rot];
}

export function createBoard(): Grid {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));
}

export function randomType(exclude?: number): number {
  let t = Math.floor(Math.random() * 7);
  if (exclude !== undefined && t === exclude) t = (t + 1) % 7;
  return t;
}

export function spawnPiece(type: number): Piece {
  const m = shapeMatrix(type, 0);
  const w = m[0].length;
  return { type, rot: 0, x: Math.floor((COLS - w) / 2), y: 0 };
}

export function pieceCells(p: Piece): { r: number; c: number }[] {
  const m = shapeMatrix(p.type, p.rot);
  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      if (m[r][c]) cells.push({ r: p.y + r, c: p.x + c });
    }
  }
  return cells;
}

export function collides(board: Grid, p: Piece): boolean {
  for (const { r, c } of pieceCells(p)) {
    if (c < 0 || c >= COLS || r >= ROWS) return true;
    if (r >= 0 && board[r][c] !== 0) return true;
  }
  return false;
}

export function lockPiece(board: Grid, p: Piece): { board: Grid; toppedOut: boolean } {
  const nb = board.map((row) => row.slice());
  let toppedOut = false;
  for (const { r, c } of pieceCells(p)) {
    if (r < 0) {
      toppedOut = true;
      continue;
    }
    if (r < ROWS && c >= 0 && c < COLS) nb[r][c] = p.type + 1;
  }
  return { board: nb, toppedOut };
}

export function clearLines(board: Grid): { board: Grid; cleared: number } {
  const remaining = board.filter((row) => row.some((v) => v === 0));
  const cleared = ROWS - remaining.length;
  const empty = Array.from({ length: cleared }, () => Array<Cell>(COLS).fill(0));
  return { board: [...empty, ...remaining], cleared };
}

export function surfaceHeight(board: Grid, c: number): number {
  for (let r = 0; r < ROWS; r++) if (board[r][c] !== 0) return ROWS - r;
  return 0;
}

export function stepUnicorn(board: Grid, u: Unicorn): Unicorn {
  const target = u.col + u.dir;
  if (target < 0 || target >= COLS) {
    return { ...u, dir: (u.dir === 1 ? -1 : 1) as 1 | -1 };
  }
  const dh = surfaceHeight(board, target) - surfaceHeight(board, u.col);
  if (Math.abs(dh) > 1) {
    const rev = u.col - u.dir;
    if (rev < 0 || rev >= COLS) return u;
    const dh2 = surfaceHeight(board, rev) - surfaceHeight(board, u.col);
    if (Math.abs(dh2) <= 1) {
      return { ...u, col: rev, dir: (u.dir === 1 ? -1 : 1) as 1 | -1 };
    }
    return u;
  }
  let { lastEdge, crossings } = u;
  if (target === 0) {
    if (lastEdge === 'right') crossings++;
    lastEdge = 'left';
  } else if (target === COLS - 1) {
    if (lastEdge === 'left') crossings++;
    lastEdge = 'right';
  }
  return { col: target, dir: u.dir, lastEdge, crossings };
}

export function ghostPiece(board: Grid, p: Piece): Piece {
  let g = p;
  while (!collides(board, { ...g, y: g.y + 1 })) g = { ...g, y: g.y + 1 };
  return g;
}

export function levelFromLines(lines: number): number {
  return Math.floor(lines / 10) + 1;
}
