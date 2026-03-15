"use client";

import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import { useUser } from "@/lib/hooks/useUser";
import { LeaderboardRow } from "@/components/gamification/LeaderboardRow";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardPage() {
  const { entries, loading } = useLeaderboard(50);
  const { profile } = useUser();

  return (
    <div className="space-y-8 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-500">Weekly XP rankings — resets every Monday</p>
      </div>

      <div className="space-y-2">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))
          : entries.map((entry, i) => (
              <LeaderboardRow
                key={entry.id}
                entry={entry}
                rank={i + 1}
                isCurrentUser={profile?.id === entry.id}
              />
            ))}

        {!loading && entries.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-gray-500">No rankings yet. Be the first to earn XP!</p>
          </div>
        )}
      </div>
    </div>
  );
}
