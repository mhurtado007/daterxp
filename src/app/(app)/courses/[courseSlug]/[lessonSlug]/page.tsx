import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import type { ContentBlock } from "@/lib/types/app";

interface Props {
  params: { courseSlug: string; lessonSlug: string };
}

export default async function LessonPage({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch course
  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title, icon, color")
    .eq("slug", params.courseSlug)
    .eq("is_published", true)
    .single();

  if (!course) notFound();

  // Fetch lesson
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .eq("slug", params.lessonSlug)
    .eq("is_published", true)
    .single();

  if (!lesson) notFound();

  // Find next lesson
  const { data: nextLesson } = await supabase
    .from("lessons")
    .select("slug")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .gt("order_index", lesson.order_index)
    .order("order_index")
    .limit(1)
    .single();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back nav */}
      <div className="flex items-center gap-3">
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {course.title}
        </Link>
      </div>

      {/* Lesson title */}
      <div>
        <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-gray-500 text-sm mt-1">{lesson.description}</p>
        )}
      </div>

      {/* Player */}
      <LessonPlayer
        lesson={{ ...lesson, content: lesson.content as ContentBlock[] }}
        courseSlug={course.slug}
        nextLessonSlug={nextLesson?.slug ?? null}
      />
    </div>
  );
}
