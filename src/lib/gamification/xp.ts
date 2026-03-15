import type { XPProgress } from "@/lib/types/app";

/**
 * Level N requires 100 * N^2 cumulative XP
 * Level 1 = 0 XP, Level 2 = 400, Level 3 = 900, Level 10 = 10000
 */
export function getXPForLevel(level: number): number {
  return 100 * level * level;
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (getXPForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

export function getXPProgress(totalXP: number): XPProgress {
  const level = getLevelFromXP(totalXP);
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const currentXP = totalXP - currentLevelXP;
  const neededXP = nextLevelXP - currentLevelXP;
  const percentage = Math.min(100, Math.round((currentXP / neededXP) * 100));

  return { level, currentXP, neededXP, percentage, totalXP };
}

export const LEVEL_TITLES: Record<number, string> = {
  1: "Newcomer",
  2: "Explorer",
  3: "Conversationalist",
  4: "Smooth Talker",
  5: "Charmer",
  6: "Heartbreaker",
  7: "Casanova",
  8: "Lover",
  9: "Seducer",
  10: "Legend",
};

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, 10)] ?? "Legend";
}
