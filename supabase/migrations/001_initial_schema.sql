-- ============================================
-- DaterXP Initial Schema
-- ============================================

-- Profiles table (extends auth.users 1:1)
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- User stats table (XP, levels, streaks)
CREATE TABLE IF NOT EXISTS public.user_stats (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp_total          INTEGER DEFAULT 0 NOT NULL,
  xp_this_week      INTEGER DEFAULT 0 NOT NULL,
  level             INTEGER DEFAULT 1 NOT NULL,
  streak_current    INTEGER DEFAULT 0 NOT NULL,
  streak_longest    INTEGER DEFAULT 0 NOT NULL,
  last_activity     DATE,
  lessons_completed INTEGER DEFAULT 0 NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  icon         TEXT DEFAULT '📚',
  color        TEXT DEFAULT '#ff1a1a',
  order_index  INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id    UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  slug         TEXT NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  order_index  INTEGER NOT NULL DEFAULT 0,
  xp_reward    INTEGER NOT NULL DEFAULT 50,
  content      JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

-- User lesson progress
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id    UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id    UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed    BOOLEAN DEFAULT FALSE,
  score        INTEGER,
  xp_earned    INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Badges table
CREATE TABLE IF NOT EXISTS public.badges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  icon          TEXT DEFAULT '🏆',
  trigger_type  TEXT NOT NULL,  -- 'streak', 'level', 'course_complete', 'lesson_complete'
  trigger_value INTEGER,
  xp_bonus      INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- User badges (earned badges)
CREATE TABLE IF NOT EXISTS public.user_badges (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id  UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- XP transactions (audit log)
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount       INTEGER NOT NULL,
  reason       TEXT NOT NULL,
  reference_id UUID,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
