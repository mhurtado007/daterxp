"use server";

import { createClient } from "@/lib/supabase/server";
import { getLevelFromXP } from "@/lib/gamification/xp";

export async function awardVictoryPhaseXP(xpAmount: number): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: stats } = await supabase
    .from("user_stats")
    .select("xp_total, xp_this_week, level")
    .eq("id", user.id)
    .single();

  if (!stats) return;

  const newXPTotal = stats.xp_total + xpAmount;
  const newLevel = getLevelFromXP(newXPTotal);

  await supabase.from("user_stats").update({
    xp_total: newXPTotal,
    xp_this_week: stats.xp_this_week + xpAmount,
    level: newLevel,
    last_activity: new Date().toISOString().split("T")[0],
  }).eq("id", user.id);

  await supabase.from("xp_transactions").insert({
    user_id: user.id,
    amount: xpAmount,
    reason: "victory_road_phase",
  });
}
