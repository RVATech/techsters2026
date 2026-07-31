import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Board } from './game/Board';
import { Hud, pieceCellsSet } from './game/Hud';
import { Unicorn } from './game/Unicorn';
import { Leaderboard, SubmitPanel } from './game/Leaderboard';
import { useGame } from './game/useGame';
import { COLS, ROWS, levelFromLines } from './game/engine';

const BEST_KEY = 'unicorn-tetris-best';

export default function App() {
  const initialBest = useMemo(() => {
    const v = Number(localStorage.getItem(BEST_KEY) ?? 0);
    return Number.isFinite(v) ? v : 0;
  }, []);
  const game = useGame(initialBest);
  const { state } = game;
  const [lbKey, setLbKey] = useState(0);

  useEffect(() => {
    if (state.unicorn.crossings > state.best) {
      localStorage.setItem(BEST_KEY, String(state.unicorn.crossings));
      game.setBest(state.unicorn.crossings);
    }
  }, [state.unicorn.crossings, state.best, game]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat && (e.key === 'ArrowUp' || e.key === ' ')) return;
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          game.move(-1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          game.move(1);
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'x':
        case 'X':
          e.preventDefault();
          game.rotate();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          game.softDrop(true);
          break;
        case ' ':
          e.preventDefault();
          game.hardDrop();
          break;
        case 'p':
        case 'P':
          game.togglePause();
          break;
        case 'Enter':
          if (state.status === 'over' || state.status === 'idle') game.restart();
          break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') game.softDrop(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [game, state.status]);

  const pieceSet = useMemo(
    () => pieceCellsSet(state.piece),
    [state.piece],
  );

  const boardWrapRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const s = touchStart.current;
      if (!s) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - s.x;
      const dy = t.clientY - s.y;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      const dt = Date.now() - s.t;
      if (adx < 24 && ady < 24 && dt < 250) {
        game.rotate();
      } else if (adx > ady) {
        game.move(dx > 0 ? 1 : -1);
      } else if (dy > 40) {
        game.softDrop(true);
        setTimeout(() => game.softDrop(false), 120);
      } else if (dy < -40 && ady > 60) {
        game.hardDrop();
      }
      touchStart.current = null;
    },
    [game],
  );

  const refreshLeaderboard = useCallback(() => setLbKey((k) => k + 1), []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span className="title-emoji" aria-hidden>🦄</span> Unicorn Tetris
        </h1>
        <p className="tagline">Sculpt a smooth skyline. Help the unicorn cross from side to side.</p>
      </header>

      <main className="play-area">
        <div
          className="board-wrap"
          ref={boardWrapRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Board
            occupied={game.occupiedCells}
            ghost={game.ghostCells}
            pieceCells={pieceSet}
            pieceType={state.piece?.type ?? null}
            flash={state.flash}
          />
          {state.status === 'running' && (
            <Unicorn
              row={game.unicornRow}
              col={state.unicorn.col}
              dir={state.unicorn.dir}
              cols={COLS}
              rows={ROWS}
            />
          )}
          {(state.status === 'paused' || state.status === 'over') && (
            <div className="overlay">
              {state.status === 'paused' ? (
                <>
                  <h2>Paused</h2>
                  <button type="button" className="btn-primary" onClick={game.togglePause}>
                    Resume
                  </button>
                </>
              ) : (
                <>
                  <h2>Game Over</h2>
                  <p className="overlay-score">
                    {state.unicorn.crossings} crossings · {state.lines} lines
                  </p>
                  <SubmitPanel
                    score={state.unicorn.crossings}
                    lines={state.lines}
                    onSubmitDone={refreshLeaderboard}
                  />
                  <button type="button" className="btn-primary" onClick={game.restart}>
                    Play Again
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="side">
          <Hud
            crossings={state.unicorn.crossings}
            lines={state.lines}
            level={levelFromLines(state.lines)}
            best={state.best}
            next={state.nextType}
            status={state.status}
          />
          <Leaderboard refreshKey={lbKey} />
          <ControlsHelp />
        </div>
      </main>

      <footer className="app-footer">
        <p>Arrow keys to move · Up to rotate · Down to drop faster · Space to slam · P to pause</p>
      </footer>
    </div>
  );
}

function ControlsHelp() {
  return (
    <div className="controls-help">
      <h3>How to play</h3>
      <ul>
        <li>Stack falling blocks to shape the ground.</li>
        <li>The unicorn runs across the top automatically.</li>
        <li>It can step up or down one block at a time — keep the path smooth.</li>
        <li>Score one point each time it reaches the far side.</li>
      </ul>
    </div>
  );
}
