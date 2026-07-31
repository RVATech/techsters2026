/*
# Create high_scores table (public leaderboard, no auth)

1. Purpose
- Stores Unicorn Tetris high scores for a public, shared leaderboard.
- The game has no sign-in screen, so scores are submitted and read by the
  anon-key client. The data is intentionally public (anyone can view and submit).

2. New Tables
- `high_scores`
  - `id` uuid PK (default gen_random_uuid())
  - `player_name` text NOT NULL (display name, capped at 20 chars by CHECK)
  - `score` integer NOT NULL (number of full unicorn crossings, >= 0 by CHECK)
  - `lines` integer NOT NULL DEFAULT 0 (Tetris lines cleared)
  - `created_at` timestamptz DEFAULT now()

3. Security (RLS)
- Enable RLS on high_scores.
- SELECT policy: anyone (anon + authenticated) can read all scores (public leaderboard).
- INSERT policy: anyone (anon + authenticated) can submit a score.
- UPDATE / DELETE: intentionally NOT exposed to clients. No policy means denied by
  default once RLS is on, so anonymous visitors cannot edit or wipe leaderboard rows
  while the leaderboard stays readable and submittable.

4. Notes
- Single-tenant, no-auth app. USING (true) / WITH CHECK (true) are acceptable here
  because the data is intentionally public/shared, not a fallback around ownership.
*/

CREATE TABLE IF NOT EXISTS high_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL CHECK (score >= 0),
  lines integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CHECK (char_length(player_name) BETWEEN 1 AND 20)
);

ALTER TABLE high_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_high_scores" ON high_scores;
CREATE POLICY "anon_read_high_scores"
ON high_scores FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_high_scores" ON high_scores;
CREATE POLICY "anon_insert_high_scores"
ON high_scores FOR INSERT
TO anon, authenticated WITH CHECK (true);
