import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  type GameState,
  type Piece,
  type Unicorn,
  COLS,
  ROWS,
  clearLines,
  collides,
  createBoard,
  ghostPiece,
  levelFromLines,
  lockPiece,
  pieceCells,
  randomType,
  spawnPiece,
  stepUnicorn,
} from './engine';

const GRAVITY_MS = 700;
const SOFT_DROP_MS = 45;
const UNICORN_MS = 110;

type Action =
  | { type: 'start' }
  | { type: 'togglePause' }
  | { type: 'tick' }
  | { type: 'move'; dir: 1 | -1 }
  | { type: 'rotate' }
  | { type: 'softDrop'; on: boolean }
  | { type: 'hardDrop' }
  | { type: 'restart' }
  | { type: 'setBest'; best: number };

function newUnicorn(): Unicorn {
  return { col: Math.floor(COLS / 2), dir: 1, lastEdge: 'left', crossings: 0 };
}

function freshState(best: number): GameState {
  const t = randomType();
  return {
    board: createBoard(),
    piece: spawnPiece(t),
    nextType: randomType(t),
    unicorn: newUnicorn(),
    lines: 0,
    status: 'running',
    softDrop: false,
    best,
    gravityAcc: 0,
    unicornAcc: 0,
    flash: 0,
  };
}

function lockAndAdvance(state: GameState, piece: Piece): GameState {
  const { board, toppedOut } = lockPiece(state.board, piece);
  if (toppedOut) {
    return { ...state, board, status: 'over', flash: 1 };
  }
  const { board: cleaned, cleared } = clearLines(board);
  const next = spawnPiece(state.nextType);
  if (collides(cleaned, next)) {
    return { ...state, board: cleaned, piece: null, status: 'over', flash: 1 };
  }
  const nextType = randomType(state.nextType);
  return {
    ...state,
    board: cleaned,
    piece: next,
    nextType,
    lines: state.lines + cleared,
    flash: cleared > 0 ? cleared : 0,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'start':
    case 'restart':
      return freshState(state.best);
    case 'setBest':
      return { ...state, best: action.best };
    case 'togglePause':
      if (state.status === 'running') return { ...state, status: 'paused' };
      if (state.status === 'paused') return { ...state, status: 'running' };
      return state;
    case 'softDrop':
      if (state.softDrop === action.on) return state;
      return { ...state, softDrop: action.on };
    case 'move':
    case 'rotate':
    case 'hardDrop': {
      if (state.status !== 'running' || !state.piece) return state;
      const p = state.piece;
      if (action.type === 'move') {
        const np: Piece = { ...p, x: p.x + action.dir };
        if (!collides(state.board, np)) return { ...state, piece: np };
        return state;
      }
      if (action.type === 'rotate') {
        const np: Piece = { ...p, rot: (p.rot + 1) % 4 };
        const kicks = [0, -1, 1, -2, 2];
        for (const k of kicks) {
          const test: Piece = { ...np, x: np.x + k };
          if (!collides(state.board, test)) return { ...state, piece: test };
        }
        return state;
      }
      const ghost = ghostPiece(state.board, p);
      return lockAndAdvance(state, ghost);
    }
    case 'tick': {
      if (state.status !== 'running') return state;
      let s = state;
      const gInt = s.softDrop ? SOFT_DROP_MS : Math.max(90, GRAVITY_MS - levelFromLines(s.lines) * 60);
      const gAcc = s.gravityAcc + TICK_MS;
      if (gAcc >= gInt) {
        const steps = Math.floor(gAcc / gInt);
        s.gravityAcc = gAcc % gInt;
        for (let i = 0; i < steps; i++) {
          if (!s.piece) break;
          const down: Piece = { ...s.piece, y: s.piece.y + 1 };
          if (collides(s.board, down)) {
            s = lockAndAdvance(s, s.piece);
            if (s.status === 'over') return { ...s, gravityAcc: 0, unicornAcc: 0 };
            break;
          } else {
            s = { ...s, piece: down };
          }
        }
      } else {
        s = { ...s, gravityAcc: gAcc };
      }
      if (s.status !== 'running') return { ...s, unicornAcc: 0 };
      const uAcc = s.unicornAcc + TICK_MS;
      if (uAcc >= UNICORN_MS) {
        const steps = Math.floor(uAcc / UNICORN_MS);
        s.unicornAcc = uAcc % UNICORN_MS;
        let u = s.unicorn;
        for (let i = 0; i < steps; i++) {
          u = stepUnicorn(s.board, u);
        }
        s = { ...s, unicorn: u };
      } else {
        s = { ...s, unicornAcc: uAcc };
      }
      return s;
    }
    default:
      return state;
  }
}

const TICK_MS = 16;

export interface UseGame {
  state: GameState;
  start: () => void;
  restart: () => void;
  togglePause: () => void;
  move: (dir: 1 | -1) => void;
  rotate: () => void;
  softDrop: (on: boolean) => void;
  hardDrop: () => void;
  setBest: (best: number) => void;
  occupiedCells: (r: number, c: number) => boolean;
  ghostCells: (r: number, c: number) => boolean;
  unicornRow: number;
}

export function useGame(initialBest: number): UseGame {
  const [state, dispatch] = useReducer(reducer, initialBest, freshState);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    let mounted = true;
    const loop = (t: number) => {
      if (!mounted) return;
      if (!lastRef.current) lastRef.current = t;
      let elapsed = t - lastRef.current;
      lastRef.current = t;
      if (elapsed > 250) elapsed = 250;
      while (elapsed >= TICK_MS) {
        dispatch({ type: 'tick' });
        elapsed -= TICK_MS;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const occupiedCells = useCallback(
    (r: number, c: number): boolean => {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
      return state.board[r][c] !== 0;
    },
    [state.board],
  );

  const ghostCells = useCallback(
    (r: number, c: number): boolean => {
      if (!state.piece || state.status !== 'running') return false;
      const g = ghostPiece(state.board, state.piece);
      return pieceCells(g).some((cell) => cell.r === r && cell.c === c);
    },
    [state.piece, state.board, state.status],
  );

  const unicornRow = useCallback((): number => {
    const c = state.unicorn.col;
    let topRow = ROWS;
    for (let r = 0; r < ROWS; r++) {
      if (state.board[r][c] !== 0) {
        topRow = r - 1;
        break;
      }
    }
    if (topRow < 0) topRow = 0;
    if (topRow >= ROWS) topRow = ROWS - 1;
    return topRow;
  }, [state.board, state.unicorn.col]);

  return {
    state,
    start: () => dispatch({ type: 'start' }),
    restart: () => dispatch({ type: 'restart' }),
    togglePause: () => dispatch({ type: 'togglePause' }),
    move: (dir) => dispatch({ type: 'move', dir }),
    rotate: () => dispatch({ type: 'rotate' }),
    softDrop: (on) => dispatch({ type: 'softDrop', on }),
    hardDrop: () => dispatch({ type: 'hardDrop' }),
    setBest: (best) => dispatch({ type: 'setBest', best }),
    occupiedCells,
    ghostCells,
    unicornRow: unicornRow(),
  };
}
