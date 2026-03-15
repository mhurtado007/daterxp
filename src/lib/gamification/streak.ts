import { differenceInDays, parseISO, startOfDay, format } from "date-fns";

export interface StreakResult {
  streak_current: number;
  streak_longest: number;
  is_new_record: boolean;
  already_checked_in: boolean;
}

export function calculateNewStreak(
  lastActivity: string | null,
  currentStreak: number,
  longestStreak: number
): StreakResult {
  const today = startOfDay(new Date());
  const todayStr = format(today, "yyyy-MM-dd");

  if (!lastActivity) {
    return {
      streak_current: 1,
      streak_longest: Math.max(1, longestStreak),
      is_new_record: longestStreak < 1,
      already_checked_in: false,
    };
  }

  const lastDate = startOfDay(parseISO(lastActivity));
  const lastDateStr = format(lastDate, "yyyy-MM-dd");

  // Already checked in today
  if (lastDateStr === todayStr) {
    return {
      streak_current: currentStreak,
      streak_longest: longestStreak,
      is_new_record: false,
      already_checked_in: true,
    };
  }

  const daysDiff = differenceInDays(today, lastDate);

  let newStreak: number;
  if (daysDiff === 1) {
    // Consecutive day — increment
    newStreak = currentStreak + 1;
  } else {
    // Gap > 1 day — reset
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, longestStreak);

  return {
    streak_current: newStreak,
    streak_longest: newLongest,
    is_new_record: newStreak > longestStreak,
    already_checked_in: false,
  };
}

export function getStreakBonus(streakDays: number): number {
  if (streakDays >= 30) return 25;
  if (streakDays >= 14) return 20;
  if (streakDays >= 7) return 10;
  if (streakDays >= 3) return 5;
  return 0;
}
