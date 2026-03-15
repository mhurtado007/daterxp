import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import Link from "next/link";
import { ArrowRight, BookOpen, Zap } from "lucide-react";
import { formatXP } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: stats }, { data: courses }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_stats").select("*").eq("id", user.id).single(),
    supabase
      .from("courses")
      .select(`
        id, slug, title, description, icon, color, order_index,
        lessons!inner(id)
      `)
      .eq("is_published", true)
      .order("order_index"),
  ]);

  // Get user progress per course
  const courseIds = courses?.map((c) => c.id) ?? [];
  const { data: progress } = courseIds.length
    ? await supabase
        .from("user_lesson_progress")
        .select("course_id")
        .eq("user_id", user.id)
        .eq("completed", true)
        .in("course_id", courseIds)
    : { data: [] };

  const progressByCourse = (progress ?? []).reduce<Record<string, number>>(
    (acc, row) => {
      acc[row.course_id] = (acc[row.course_id] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const displayName = profile?.display_name || profile?.username || "there";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          Hey, {displayName} 👋
        </h1>
        <p className="text-gray-500">Ready to level up today?</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* XP / Level */}
        <div className="glass-card rounded-2xl p-6 md:col-span-2">
          <p className="text-gray-500 text-sm mb-4">Your Progress</p>
          {stats ? (
            <XPBar totalXP={stats.xp_total} />
          ) : (
            <div className="h-16 shimmer rounded-xl" />
          )}
        </div>

        {/* Streak */}
        <div className="glass-card rounded-2xl p-6">
          <p className="text-gray-500 text-sm mb-4">Current Streak</p>
          {stats ? (
            <>
              <StreakCounter days={stats.streak_current} />
              {stats.streak_longest > 0 && (
                <p className="text-gray-600 text-xs mt-3">
                  Best: {stats.streak_longest} days
                </p>
              )}
            </>
          ) : (
            <div className="h-16 shimmer rounded-xl" />
          )}
        </div>
      </div>

      {/* Quick stats row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total XP", value: formatXP(stats.xp_total), color: "#ff1a1a" },
            { label: "This Week", value: formatXP(stats.xp_this_week) + " XP", color: "#ff6600" },
            { label: "Level", value: stats.level.toString(), color: "#cc0044" },
            { label: "Lessons Done", value: stats.lessons_completed.toString(), color: "#8800ff" },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">{label}</p>
              <p className="text-2xl font-bold" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Courses */}
      {courses && courses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your Courses</h2>
            <Link
              href="/courses"
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {courses.slice(0, 4).map((course) => {
              const totalLessons = (course.lessons as { id: string }[]).length;
              const completedLessons = progressByCourse[course.id] ?? 0;
              const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="glass-card glass-card-hover rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      backgroundColor: `${course.color}20`,
                      border: `1px solid ${course.color}40`,
                    }}
                  >
                    {course.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm mb-1 group-hover:text-red-300 transition-colors">
                      {course.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-red-950/60 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: course.color,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {completedLessons}/{totalLessons}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-red-400 transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!courses || courses.length === 0) && (
        <div className="glass-card rounded-2xl p-10 text-center">
          <BookOpen className="w-12 h-12 text-red-900 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No courses yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            Courses are being set up. Check back soon!
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white text-sm"
            style={{ background: "linear-gradient(135deg, #ff2a2a, #cc0000)" }}
          >
            <Zap className="w-4 h-4" />
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}
