import { COLORS, COLS, ROWS } from './engine';

interface BoardProps {
  occupied: (r: number, c: number) => boolean;
  ghost: (r: number, c: number) => boolean;
  pieceCells: Set<string>;
  pieceType: number | null;
  flash: number;
}

const key = (r: number, c: number) => `${r},${c}`;

export function Board({ occupied, ghost, pieceCells, pieceType, flash }: BoardProps) {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const occ = occupied(r, c);
      const isPiece = pieceCells.has(key(r, c));
      const isGhost = ghost(r, c);
      let bg = 'transparent';
      let cls = 'cell';
      if (occ) {
        bg = '#1e293b';
        cls = 'cell cell-filled';
      } else if (isPiece && pieceType !== null) {
        bg = COLORS[pieceType];
        cls = 'cell cell-piece';
      } else if (isGhost && pieceType !== null) {
        cls = 'cell cell-ghost';
      }
      cells.push(
        <div
          key={key(r, c)}
          className={cls}
          style={isGhost && !occ && !isPiece ? undefined : { backgroundColor: bg }}
          data-color={isPiece && pieceType !== null ? COLORS[pieceType] : undefined}
        />,
      );
    }
  }
  return (
    <div
      className={`board${flash > 0 ? ' board-flash' : ''}`}
      style={{ '--cols': COLS, '--rows': ROWS } as React.CSSProperties}
    >
      {cells}
    </div>
  );
}
