import { COLORS, PIECE_NAMES, pieceCells, type Piece } from './engine';

interface HudProps {
  crossings: number;
  lines: number;
  level: number;
  best: number;
  next: number;
  status: 'idle' | 'running' | 'paused' | 'over';
}

function NextPiece({ type }: { type: number }) {
  const m = nextMatrix(type);
  return (
    <div className="next-grid">
      {m.map((row, r) =>
        row.map((v, c) => (
          <div
            key={`${r},${c}`}
            className={v ? 'next-cell next-cell-on' : 'next-cell'}
            style={v ? { backgroundColor: COLORS[type] } : undefined}
          />
        )),
      )}
    </div>
  );
}

function nextMatrix(type: number): number[][] {
  const defs: number[][][] = [
    [[0, 1, 1, 1], [0, 0, 0, 0]],
    [[1, 1], [1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 0], [0, 1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
  ];
  return defs[type] ?? [[1, 1], [1, 1]];
}

export function Hud({ crossings, lines, level, best, next, status }: HudProps) {
  return (
    <div className="hud">
      <div className="stat stat-hero">
        <span className="stat-label">Crossings</span>
        <span className="stat-value stat-value-big">{crossings}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Lines</span>
        <span className="stat-value">{lines}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Level</span>
        <span className="stat-value">{level}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Best</span>
        <span className="stat-value">{best}</span>
      </div>
      <div className="next-block">
        <span className="stat-label">Next</span>
        <NextPiece type={next} />
      </div>
      <div className={`status-pill status-${status}`}>{statusLabel(status)}</div>
    </div>
  );
}

function statusLabel(s: HudProps['status']): string {
  switch (s) {
    case 'running':
      return 'Running';
    case 'paused':
      return 'Paused';
    case 'over':
      return 'Game Over';
    default:
      return 'Ready';
  }
}

export function pieceCellsSet(piece: Piece | null): Set<string> {
  const set = new Set<string>();
  if (!piece) return set;
  for (const { r, c } of pieceCells(piece)) {
    if (r >= 0) set.add(`${r},${c}`);
  }
  return set;
}

export { COLORS, PIECE_NAMES };
