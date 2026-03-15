-- ============================================
-- DaterXP Row Level Security Policies
-- ============================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly viewable"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- USER STATS (public read for leaderboard)
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stats are publicly readable"
  ON public.user_stats FOR SELECT USING (true);

CREATE POLICY "Users can insert own stats"
  ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE USING (auth.uid() = id);

-- COURSES (public read)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are publicly readable"
  ON public.courses FOR SELECT USING (is_published = true);

-- LESSONS (public read)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published lessons are publicly readable"
  ON public.lessons FOR SELECT USING (is_published = true);

-- USER LESSON PROGRESS (private per user)
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own progress"
  ON public.user_lesson_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- BADGES (public read)
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are publicly readable"
  ON public.badges FOR SELECT USING (true);

-- USER BADGES
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own badges"
  ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- XP TRANSACTIONS (private)
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own transactions"
  ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.xp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
