import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Lock, Zap, ArrowRight } from "lucide-react";

interface Props {
  params: { courseSlug: string };
}

export default async function CoursePage({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", params.courseSlug)
    .eq("is_published", true)
    .single();

  if (!course) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, slug, title, description, order_index, xp_reward")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("order_index");

  const { data: progress } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id, completed, score, xp_earned")
    .eq("user_id", user.id)
    .eq("course_id", course.id);

  const progressByLesson = (progress ?? []).reduce<
    Record<string, { completed: boolean; score: number | null; xp_earned: number }>
  >((acc, row) => {
    acc[row.lesson_id] = {
      completed: row.completed,
      score: row.score,
      xp_earned: row.xp_earned,
    };
    return acc;
  }, {});

  const completedCount = Object.values(progressByLesson).filter((p) => p.completed).length;
  const totalLessons = lessons?.length ?? 0;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Find the first incomplete lesson
  const nextLesson = lessons?.find((l) => !progressByLesson[l.id]?.completed);

  return (
    <div className="space-y-8 max-w-2xl animate-fade-in">
      {/* Back */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> All Courses
      </Link>

      {/* Course header */}
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-start gap-5 mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{
              backgroundColor: `${course.color}20`,
              border: `1px solid ${course.color}40`,
            }}
          >
            {course.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-gray-400 text-sm leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{completedCount} of {totalLessons} lessons complete</span>
            <span style={{ color: course.color }} className="font-medium">{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-red-950/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: course.color }}
            />
          </div>
        </div>

        {nextLesson && (
          <Link
            href={`/courses/${course.slug}/${nextLesson.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all text-sm"
            style={{
              background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
              boxShadow: "0 0 16px rgba(255,26,26,0.3)",
            }}
          >
            {completedCount > 0 ? "Continue Course" : "Start Course"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        {pct === 100 && (
          <div className="flex items-center gap-2 text-green-400 font-medium">
            <CheckCircle className="w-5 h-5" />
            Course Complete!
          </div>
        )}
      </div>

      {/* Lessons list */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Lessons</h2>
        <div className="space-y-3">
          {lessons?.map((lesson, i) => {
            const p = progressByLesson[lesson.id];
            const isCompleted = p?.completed ?? false;
            const isLocked = i > 0 && !progressByLesson[lessons[i - 1].id]?.completed;

            return (
              <div key={lesson.id}>
                {isLocked ? (
                  <div className="flex items-center gap-4 px-5 py-4 rounded-xl glass-card opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-500 text-sm font-medium">{lesson.title}</p>
                    </div>
                    <span className="text-xs text-gray-600">+{lesson.xp_reward} XP</span>
                  </div>
                ) : (
                  <Link
                    href={`/courses/${course.slug}/${lesson.slug}`}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl glass-card glass-card-hover transition-all group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={
                        isCompleted
                          ? { background: "#16a34a", color: "white" }
                          : {
                              backgroundColor: `${course.color}20`,
                              color: course.color,
                              border: `1px solid ${course.color}40`,
                            }
                      }
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        lesson.order_index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium group-hover:text-red-300 transition-colors ${isCompleted ? "text-gray-400" : "text-white"}`}>
                        {lesson.title}
                      </p>
                      {lesson.description && (
                        <p className="text-gray-600 text-xs truncate mt-0.5">{lesson.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isCompleted && p.score !== null && (
                        <span className="text-xs text-green-500 font-medium">{p.score}%</span>
                      )}
                      <span className="text-xs text-red-400 flex items-center gap-0.5">
                        <Zap className="w-3 h-3" />
                        {lesson.xp_reward}
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
