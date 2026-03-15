"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "@/lib/types/app";

interface RawLeaderboardRow {
  id: string;
  xp_this_week: number;
  xp_total: number;
  level: number;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function useLeaderboard(limit = 20) {
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("user_stats")
      .select(`
        id,
        xp_this_week,
        xp_total,
        level,
        profiles!inner (
          username,
          display_name,
          avatar_url
        )
      `)
      .order("xp_this_week", { ascending: false })
      .limit(limit);

    if (data) {
      setEntries(
        (data as unknown as RawLeaderboardRow[]).map((row) => ({
          id: row.id,
          xp_this_week: row.xp_this_week,
          xp_total: row.xp_total,
          level: row.level,
          profile: {
            username: row.profiles.username,
            display_name: row.profiles.display_name,
            avatar_url: row.profiles.avatar_url,
          },
        }))
      );
    }
    setLoading(false);
  }, [supabase, limit]);

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel("leaderboard")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_stats" },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard, supabase]);

  return { entries, loading };
}
