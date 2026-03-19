-- Victory Road session table (one active session per user)
CREATE TABLE IF NOT EXISTS victory_road_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  phase_states JSONB NOT NULL DEFAULT '[{"completed":false,"unlocked":true},{"completed":false,"unlocked":false},{"completed":false,"unlocked":false},{"completed":false,"unlocked":false}]',
  active_phase INTEGER DEFAULT 1,
  total_xp INTEGER NOT NULL DEFAULT 0,
  mission TEXT DEFAULT '',
  contingency TEXT DEFAULT '',
  checklist JSONB NOT NULL DEFAULT '[false,false,false,false]',
  phase2_ratings JSONB NOT NULL DEFAULT '[null,null,null,null,null]',
  next_step TEXT DEFAULT '',
  had_good_time BOOLEAN DEFAULT NULL,
  went_right TEXT DEFAULT '',
  went_wrong TEXT DEFAULT '',
  wants_follow_up BOOLEAN DEFAULT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER update_victory_road_updated_at
  BEFORE UPDATE ON victory_road_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE victory_road_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own victory road session"
  ON victory_road_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
