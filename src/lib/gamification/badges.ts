import type { Badge } from "@/lib/types/app";

export interface BadgeCheckContext {
  type: "streak" | "level" | "course_complete" | "lesson_complete";
  value: number;
  courseId?: string;
}

export const BADGE_DEFINITIONS = [
  { slug: "first-step", trigger_type: "lesson_complete", trigger_value: 1, name: "First Step", icon: "👣", description: "Complete your first lesson" },
  { slug: "streak-3", trigger_type: "streak", trigger_value: 3, name: "On Fire", icon: "🔥", description: "3-day streak" },
  { slug: "streak-7", trigger_type: "streak", trigger_value: 7, name: "Week Warrior", icon: "⚡", description: "7-day streak" },
  { slug: "streak-30", trigger_type: "streak", trigger_value: 30, name: "Month Master", icon: "🏆", description: "30-day streak" },
  { slug: "level-5", trigger_type: "level", trigger_value: 5, name: "Charmer", icon: "✨", description: "Reach Level 5" },
  { slug: "level-10", trigger_type: "level", trigger_value: 10, name: "Legend", icon: "👑", description: "Reach Level 10" },
  { slug: "lessons-10", trigger_type: "lesson_complete", trigger_value: 10, name: "Student", icon: "📚", description: "Complete 10 lessons" },
  { slug: "lessons-25", trigger_type: "lesson_complete", trigger_value: 25, name: "Scholar", icon: "🎓", description: "Complete 25 lessons" },
] as const;

export function getEligibleBadges(
  allBadges: Badge[],
  context: BadgeCheckContext,
  currentValue: number
): Badge[] {
  return allBadges.filter(
    (badge) =>
      badge.trigger_type === context.type &&
      badge.trigger_value !== null &&
      badge.trigger_value <= currentValue
  );
}
