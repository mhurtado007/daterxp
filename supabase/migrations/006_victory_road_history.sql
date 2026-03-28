-- ============================================
-- Victory Road History Table
-- ============================================

CREATE TABLE public.victory_road_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  phase_states JSONB,
  mission TEXT,
  went_right TEXT,
  went_wrong TEXT,
  had_good_time BOOLEAN,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.victory_road_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history"
  ON public.victory_road_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
  ON public.victory_road_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX victory_road_history_user_id_idx ON public.victory_road_history(user_id);
