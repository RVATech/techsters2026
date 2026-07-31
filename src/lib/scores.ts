import { supabase } from './supabase';

export interface ScoreRow {
  id: string;
  player_name: string;
  score: number;
  lines: number;
  created_at: string;
}

export async function fetchTopScores(): Promise<{ rows: ScoreRow[] | null; error: string | null }> {
  if (!supabase) return { rows: null, error: null };
  const { data, error } = await supabase
    .from('high_scores')
    .select('id, player_name, score, lines, created_at')
    .order('score', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) return { rows: null, error: error.message };
  return { rows: data as ScoreRow[], error: null };
}

export async function submitScore(
  name: string,
  score: number,
  lines: number,
): Promise<{ ok: boolean; error: string | null }> {
  if (!supabase) return { ok: false, error: 'Leaderboard unavailable.' };
  const trimmed = name.trim().slice(0, 20);
  if (!trimmed) return { ok: false, error: 'Please enter a name.' };
  const { error } = await supabase
    .from('high_scores')
    .insert({ player_name: trimmed, score, lines });
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}
