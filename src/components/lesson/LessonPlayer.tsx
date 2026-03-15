"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { ProgressDots } from "./ProgressDots";
import { TheorySlide } from "./TheorySlide";
import { QuizQuestion } from "./QuizQuestion";
import { ExercisePrompt } from "./ExercisePrompt";
import { LessonComplete } from "./LessonComplete";
import { XPBurst } from "@/components/gamification/XPBurst";
import { LevelUpModal } from "@/components/gamification/LevelUpModal";
import { completeLesson } from "@/lib/actions/lessons";
import type { Lesson, LessonCompletionResult, QuizBlock } from "@/lib/types/app";

interface LessonPlayerProps {
  lesson: Lesson;
  courseSlug: string;
  nextLessonSlug: string | null;
}

export function LessonPlayer({ lesson, courseSlug, nextLessonSlug }: LessonPlayerProps) {
  const blocks = lesson.content;
  const [step, setStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizRevealed, setQuizRevealed] = useState<Record<number, boolean>>({});
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, string>>({});
  const [completing, setCompleting] = useState(false);
  const [result, setResult] = useState<LessonCompletionResult | null>(null);
  const [showXPBurst, setShowXPBurst] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const currentBlock = blocks[step];
  const isLastStep = step === blocks.length - 1;

  function canProceed(): boolean {
    if (!currentBlock) return false;
    if (currentBlock.type === "quiz") {
      return quizRevealed[step] === true;
    }
    return true;
  }

  function handleQuizSelect(index: number) {
    setQuizAnswers((prev) => ({ ...prev, [step]: index }));
    setQuizRevealed((prev) => ({ ...prev, [step]: true }));
  }

  async function handleNext() {
    if (isLastStep) {
      await handleComplete();
    } else {
      setStep((s) => s + 1);
    }
  }

  async function handleComplete() {
    setCompleting(true);

    // Calculate quiz score
    const quizBlocks = blocks
      .map((b, i) => ({ block: b, index: i }))
      .filter(({ block }) => block.type === "quiz");

    const correctCount = quizBlocks.filter(({ block, index }) => {
      const b = block as QuizBlock;
      return quizAnswers[index] === b.correct;
    }).length;

    const score =
      quizBlocks.length > 0
        ? Math.round((correctCount / quizBlocks.length) * 100)
        : 100;

    const res = await completeLesson({
      lessonId: lesson.id,
      courseId: lesson.course_id,
      score,
    });

    if ("error" in res) {
      console.error(res.error);
      setCompleting(false);
      return;
    }

    setResult(res);

    // Trigger XP burst
    setShowXPBurst(true);
    setTimeout(() => setShowXPBurst(false), 1500);

    // Trigger level up modal if applicable
    if (res.level_up) {
      setTimeout(() => setShowLevelUp(true), 600);
    }

    setCompleting(false);
  }

  if (result) {
    return (
      <>
        <LessonComplete
          result={result}
          courseSlug={courseSlug}
          nextLessonSlug={nextLessonSlug}
        />
        <XPBurst amount={result.xp_earned} show={showXPBurst} />
        <LevelUpModal
          show={showLevelUp}
          newLevel={result.new_level}
          onClose={() => setShowLevelUp(false)}
        />
      </>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step > 0 && setStep((s) => s - 1)}
          className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-gray-500 hover:text-gray-300 transition-all disabled:opacity-30"
          disabled={step === 0}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <ProgressDots total={blocks.length} current={step} />

        <div className="text-sm text-gray-600">
          {step + 1}/{blocks.length}
        </div>
      </div>

      {/* Content */}
      <div className="glass-card rounded-2xl p-8 min-h-[320px]">
        <AnimatePresence mode="wait">
          {currentBlock.type === "theory" && (
            <TheorySlide key={step} block={currentBlock} />
          )}
          {currentBlock.type === "quiz" && (
            <QuizQuestion
              key={step}
              block={currentBlock}
              selected={quizAnswers[step] ?? null}
              onSelect={handleQuizSelect}
              revealed={quizRevealed[step] ?? false}
            />
          )}
          {currentBlock.type === "exercise" && (
            <ExercisePrompt
              key={step}
              block={currentBlock}
              value={exerciseAnswers[step] ?? ""}
              onChange={(v) =>
                setExerciseAnswers((prev) => ({ ...prev, [step]: v }))
              }
            />
          )}
        </AnimatePresence>
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={!canProceed() || completing}
        className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: canProceed()
            ? "linear-gradient(135deg, #ff2a2a, #cc0000)"
            : "rgba(61,21,21,0.4)",
          boxShadow: canProceed() ? "0 0 16px rgba(255,26,26,0.3)" : "none",
        }}
      >
        {completing ? (
          "Saving..."
        ) : isLastStep ? (
          <>Complete Lesson <ChevronRight className="w-5 h-5" /></>
        ) : (
          <>Continue <ArrowRight className="w-5 h-5" /></>
        )}
      </button>
    </div>
  );
}
