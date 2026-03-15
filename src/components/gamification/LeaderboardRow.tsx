import { LevelBadge } from "./LevelBadge";
import { formatXP } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/types/app";
import { cn } from "@/lib/utils";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser?: boolean;
}

const RANK_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

export function LeaderboardRow({ entry, rank, isCurrentUser }: LeaderboardRowProps) {
  const rankColor = RANK_COLORS[rank];
  const name = entry.profile.display_name || entry.profile.username;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200",
        isCurrentUser
          ? "bg-red-950/40 border border-red-800/40"
          : "glass-card glass-card-hover"
      )}
    >
      {/* Rank */}
      <div
        className="w-8 text-center font-bold text-sm flex-shrink-0"
        style={{ color: rankColor ?? "#6b7280" }}
      >
        {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/30 flex items-center justify-center text-sm font-bold text-red-400 flex-shrink-0">
        {entry.profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.profile.avatar_url}
            alt={name}
            className="w-full h-full rounded-xl object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium text-sm truncate", isCurrentUser ? "text-red-300" : "text-white")}>
          {name}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-red-500 font-normal">you</span>
          )}
        </p>
        <p className="text-gray-500 text-xs">Level {entry.level}</p>
      </div>

      {/* Level badge */}
      <LevelBadge level={entry.level} size="sm" />

      {/* XP */}
      <div className="text-right flex-shrink-0">
        <p className="text-red-400 font-bold text-sm">{formatXP(entry.xp_this_week)} XP</p>
        <p className="text-gray-600 text-xs">this week</p>
      </div>
    </div>
  );
}
