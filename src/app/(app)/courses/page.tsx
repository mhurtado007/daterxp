import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, CheckCircle } from "lucide-react";

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: courses } = await supabase
    .from("courses")
    .select(`id, slug, title, description, icon, color, order_index, lessons(id)`)
    .eq("is_published", true)
    .order("order_index");

  const courseIds = courses?.map((c) => c.id) ?? [];
  const { data: progress } = courseIds.length
    ? await supabase
        .from("user_lesson_progress")
        .select("course_id, lesson_id")
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Courses</h1>
        <p className="text-gray-500">Master every aspect of your dating life</p>
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const totalLessons = (course.lessons as { id: string }[]).length;
            const completedLessons = progressByCourse[course.id] ?? 0;
            const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
            const isComplete = pct === 100 && totalLessons > 0;

            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="glass-card glass-card-hover rounded-2xl p-6 group transition-all duration-300 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{
                      backgroundColor: `${course.color}20`,
                      border: `1px solid ${course.color}40`,
                    }}
                  >
                    {course.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : completedLessons > 0 ? (
                      <span className="text-xs text-gray-500 font-medium">In progress</span>
                    ) : (
                      <Lock className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-300 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm mb-5 flex-1 leading-relaxed">
                  {course.description}
                </p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{completedLessons} of {totalLessons} lessons</span>
                    <span style={{ color: course.color }}>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-red-950/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: course.color }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-red-900/20">
                  <span className="text-xs text-gray-600">
                    {totalLessons} lessons · {totalLessons * 50}+ XP
                  </span>
                  <span className="text-red-400 text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {completedLessons > 0 ? "Continue" : "Start"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-10 text-center">
          <p className="text-gray-500">Courses coming soon!</p>
        </div>
      )}
    </div>
  );
}
