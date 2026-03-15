"use client";

import { useUser } from "@/lib/hooks/useUser";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { Skeleton } from "@/components/ui/skeleton";

export function TopBar() {
  const { stats, loading } = useUser();

  return (
    <header className="sticky top-0 z-30 bg-[#0d0000]/90 backdrop-blur-md border-b border-red-900/20 px-6 py-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-6">
        {/* XP Bar */}
        <div className="flex-1 max-w-xs">
          {loading || !stats ? (
            <Skeleton className="h-8 w-full bg-red-950/30" />
          ) : (
            <XPBar totalXP={stats.xp_total} compact />
          )}
        </div>

        {/* Streak */}
        <div>
          {loading || !stats ? (
            <Skeleton className="h-6 w-16 bg-red-950/30" />
          ) : (
            <StreakCounter days={stats.streak_current} compact />
          )}
        </div>
      </div>
    </header>
  );
}
