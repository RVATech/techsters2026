import { useEffect, useState } from 'react';
import { fetchTopScores, submitScore, type ScoreRow } from '../lib/scores';
import { supabaseEnabled } from '../lib/supabase';

interface LeaderboardProps {
  refreshKey: number;
}

export function Leaderboard({ refreshKey }: LeaderboardProps) {
  const [rows, setRows] = useState<ScoreRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseEnabled) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    fetchTopScores().then(({ rows: r, error: e }) => {
      if (!active) return;
      setRows(r);
      setError(e);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  if (!supabaseEnabled) {
    return (
      <div className="leaderboard">
        <h3>Leaderboard</h3>
        <p className="muted">Online scores unlock once your project is connected.</p>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h3>Top Unicorns</h3>
      {loading && <p className="muted">Loading...</p>}
      {error && <p className="muted">Couldn't load scores.</p>}
      {!loading && !error && rows && rows.length === 0 && (
        <p className="muted">No scores yet. Be the first!</p>
      )}
      {!loading && !error && rows && rows.length > 0 && (
        <ol className="score-list">
          {rows.map((row, i) => (
            <li key={row.id} className={i === 0 ? 'score-row score-row-top' : 'score-row'}>
              <span className="score-rank">#{i + 1}</span>
              <span className="score-name">{row.player_name}</span>
              <span className="score-val">{row.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export interface SubmitPanelProps {
  score: number;
  lines: number;
  onSubmitDone: () => void;
}

export function SubmitPanel({ score, lines, onSubmitDone }: SubmitPanelProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState<string | null>(null);

  if (!supabaseEnabled) return null;

  const submit = async () => {
    if (status === 'sending') return;
    setStatus('sending');
    setMsg(null);
    const { ok, error } = await submitScore(name, score, lines);
    if (ok) {
      setStatus('done');
      setMsg('Saved!');
      onSubmitDone();
    } else {
      setStatus('error');
      setMsg(error ?? 'Something went wrong.');
    }
  };

  if (status === 'done') {
    return (
      <div className="submit-panel">
        <p className="submit-done">Your score is on the board!</p>
      </div>
    );
  }

  return (
    <div className="submit-panel">
      <label htmlFor="player-name">Save your score</label>
      <input
        id="player-name"
        type="text"
        maxLength={20}
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        disabled={status === 'sending'}
      />
      <button type="button" onClick={submit} disabled={status === 'sending' || !name.trim()}>
        {status === 'sending' ? 'Saving...' : 'Submit'}
      </button>
      {msg && <p className="submit-msg">{msg}</p>}
    </div>
  );
}
