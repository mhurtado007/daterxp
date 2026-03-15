"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, UserStats } from "@/lib/types/app";

export function useUser() {
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let statsChannel: ReturnType<typeof supabase.channel> | null = null;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const [{ data: profileData }, { data: statsData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("user_stats").select("*").eq("id", user.id).single(),
      ]);

      setProfile(profileData);
      setStats(statsData);
      setLoading(false);

      // Subscribe to realtime stats updates
      statsChannel = supabase
        .channel(`user_stats:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "user_stats",
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            setStats(payload.new as UserStats);
          }
        )
        .subscribe();
    }

    loadUser();

    return () => {
      if (statsChannel) supabase.removeChannel(statsChannel);
    };
  }, [supabase]);

  return { profile, stats, loading };
}
