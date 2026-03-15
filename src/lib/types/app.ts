// ============================================
// DaterXP App Types
// ============================================

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  xp_total: number;
  xp_this_week: number;
  level: number;
  streak_current: number;
  streak_longest: number;
  last_activity: string | null;
  lessons_completed: number;
  updated_at: string;
}

export interface UserWithStats {
  profile: Profile;
  stats: UserStats;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export type ContentBlockType = "theory" | "quiz" | "exercise";

export interface TheoryBlock {
  type: "theory";
  heading: string;
  body: string;
  image_url?: string;
}

export interface QuizBlock {
  type: "quiz";
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface ExerciseBlock {
  type: "exercise";
  prompt: string;
  placeholder?: string;
}

export type ContentBlock = TheoryBlock | QuizBlock | ExerciseBlock;

export interface Lesson {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string | null;
  order_index: number;
  xp_reward: number;
  content: ContentBlock[];
  is_published: boolean;
  created_at: string;
}

export interface LessonWithProgress extends Lesson {
  completed: boolean;
  score: number | null;
  xp_earned: number;
}

export interface CourseWithProgress extends Course {
  lessons: LessonWithProgress[];
  completed_count: number;
  total_lessons: number;
  progress_percentage: number;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
  trigger_type: string;
  trigger_value: number | null;
  xp_bonus: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

export interface LeaderboardEntry {
  id: string;
  xp_this_week: number;
  xp_total: number;
  level: number;
  profile: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

// Gamification result types
export interface LessonCompletionResult {
  xp_earned: number;
  xp_total: number;
  new_level: number;
  level_up: boolean;
  streak_current: number;
  badges_earned: Badge[];
}

export interface XPProgress {
  level: number;
  currentXP: number;
  neededXP: number;
  percentage: number;
  totalXP: number;
}
