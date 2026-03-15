import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { logout } from "@/lib/actions/auth";
import { formatXP } from "@/lib/utils";
import { LogOut } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: stats }, { data: userBadges }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_stats").select("*").eq("id", user.id).single(),
    supabase
      .from("user_badges")
      .select("*, badge:badges(*)")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false }),
  ]);

  const displayName = profile?.display_name || profile?.username || "User";

  return (
    <div className="space-y-8 max-w-2xl animate-fade-in">
      <h1 className="text-3xl font-bold text-white">Profile</h1>

      {/* Profile card */}
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-2xl font-bold text-red-400 flex-shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{displayName}</h2>
            <p className="text-gray-500 text-sm">@{profile?.username}</p>
          </div>
        </div>

        {stats && <XPBar totalXP={stats.xp_total} />}
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total XP", value: formatXP(stats.xp_total), color: "#ff1a1a" },
            { label: "Level", value: String(stats.level), color: "#ff6600" },
            { label: "Best Streak", value: `${stats.streak_longest}d`, color: "#ff8800" },
            { label: "Lessons", value: String(stats.lessons_completed), color: "#8800ff" },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold mb-1" style={{ color }}>
                {value}
              </p>
              <p className="text-gray-500 text-xs">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Current streak */}
      {stats && (
        <div className="glass-card rounded-2xl p-6">
          <p className="text-gray-500 text-sm mb-4">Current Streak</p>
          <StreakCounter days={stats.streak_current} />
        </div>
      )}

      {/* Badges */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Badges
          {userBadges && userBadges.length > 0 && (
            <span className="ml-2 text-sm text-gray-500 font-normal">
              {userBadges.length} earned
            </span>
          )}
        </h2>

        {userBadges && userBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {userBadges.map((ub: { id: string; badge: { icon: string; name: string; description: string } }) => (
              <div key={ub.id} className="glass-card rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">{ub.badge.icon}</span>
                <div>
                  <p className="text-white font-medium text-sm">{ub.badge.name}</p>
                  <p className="text-gray-600 text-xs">{ub.badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-gray-500 text-sm">
              Complete lessons and maintain streaks to earn badges
            </p>
          </div>
        )}
      </div>

      {/* Sign out */}
      <form action={logout}>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-500 border border-red-900/20 hover:text-gray-300 hover:border-red-900/40 transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </form>
    </div>
  );
}
