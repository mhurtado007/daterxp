"use server";

import { createClient } from "@/lib/supabase/server";
import { getLevelFromXP } from "@/lib/gamification/xp";
import { calculateNewStreak, getStreakBonus } from "@/lib/gamification/streak";
import { getEligibleBadges, type BadgeCheckContext } from "@/lib/gamification/badges";
import type { LessonCompletionResult, Badge } from "@/lib/types/app";

interface CompleteLessonArgs {
  lessonId: string;
  courseId: string;
  score: number; // 0-100
}

export async function completeLesson({
  lessonId,
  courseId,
  score,
}: CompleteLessonArgs): Promise<LessonCompletionResult | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Idempotency check
  const { data: existing } = await supabase
    .from("user_lesson_progress")
    .select("id, xp_earned")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .eq("completed", true)
    .single();

  if (existing) {
    // Already completed — return current stats without awarding again
    const { data: stats } = await supabase
      .from("user_stats")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      xp_earned: 0,
      xp_total: stats?.xp_total ?? 0,
      new_level: stats?.level ?? 1,
      level_up: false,
      streak_current: stats?.streak_current ?? 0,
      badges_earned: [],
    };
  }

  // Fetch lesson XP reward
  const { data: lesson } = await supabase
    .from("lessons")
    .select("xp_reward")
    .eq("id", lessonId)
    .single();

  if (!lesson) return { error: "Lesson not found" };

  // Fetch current user stats
  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!stats) return { error: "User stats not found" };

  // Calculate XP earned
  const streakResult = calculateNewStreak(
    stats.last_activity,
    stats.streak_current,
    stats.streak_longest
  );

  const baseXP = lesson.xp_reward;
  const quizBonus = score >= 80 ? 20 : 0;
  const streakBonus = getStreakBonus(streakResult.streak_current);
  const totalXPEarned = baseXP + quizBonus + streakBonus;

  const newXPTotal = stats.xp_total + totalXPEarned;
  const oldLevel = stats.level;
  const newLevel = getLevelFromXP(newXPTotal);
  const didLevelUp = newLevel > oldLevel;

  // Insert lesson progress
  await supabase.from("user_lesson_progress").insert({
    user_id: user.id,
    lesson_id: lessonId,
    course_id: courseId,
    completed: true,
    score,
    xp_earned: totalXPEarned,
    completed_at: new Date().toISOString(),
  });

  // Update user stats
  const today = new Date().toISOString().split("T")[0];
  await supabase
    .from("user_stats")
    .update({
      xp_total: newXPTotal,
      xp_this_week: stats.xp_this_week + totalXPEarned,
      level: newLevel,
      streak_current: streakResult.streak_current,
      streak_longest: streakResult.streak_longest,
      last_activity: today,
      lessons_completed: stats.lessons_completed + 1,
    })
    .eq("id", user.id);

  // Log XP transaction
  await supabase.from("xp_transactions").insert({
    user_id: user.id,
    amount: totalXPEarned,
    reason: "lesson_complete",
    reference_id: lessonId,
  });

  // Check and award badges
  const newLessonsCompleted = stats.lessons_completed + 1;
  const badgesEarned: Badge[] = [];

  const { data: allBadges } = await supabase.from("badges").select("*");

  if (allBadges) {
    const { data: existingBadges } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", user.id);

    const earnedIds = new Set(existingBadges?.map((b) => b.badge_id) ?? []);

    const checkAndAward = async (
      type: string,
      value: number
    ) => {
      const eligible = getEligibleBadges(allBadges, { type: type as BadgeCheckContext["type"], value }, value);
      for (const badge of eligible) {
        if (!earnedIds.has(badge.id)) {
          await supabase.from("user_badges").insert({
            user_id: user.id,
            badge_id: badge.id,
          });
          if (badge.xp_bonus > 0) {
            await supabase.from("xp_transactions").insert({
              user_id: user.id,
              amount: badge.xp_bonus,
              reason: "badge_earned",
              reference_id: badge.id,
            });
          }
          badgesEarned.push(badge);
          earnedIds.add(badge.id);
        }
      }
    };

    await checkAndAward("lesson_complete", newLessonsCompleted);
    await checkAndAward("streak", streakResult.streak_current);
    if (didLevelUp) await checkAndAward("level", newLevel);
  }

  return {
    xp_earned: totalXPEarned,
    xp_total: newXPTotal,
    new_level: newLevel,
    level_up: didLevelUp,
    streak_current: streakResult.streak_current,
    badges_earned: badgesEarned,
  };
}
