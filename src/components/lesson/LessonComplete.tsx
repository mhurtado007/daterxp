"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";
import type { LessonCompletionResult } from "@/lib/types/app";

interface LessonCompleteProps {
  result: LessonCompletionResult;
  courseSlug: string;
  nextLessonSlug: string | null;
}

export function LessonComplete({ result, courseSlug, nextLessonSlug }: LessonCompleteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="text-center py-8 space-y-6"
    >
      {/* Check circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        className="flex justify-center"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            boxShadow: "0 0 30px rgba(22,163,74,0.5)",
          }}
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
        <p className="text-gray-400">Great work. Keep the momentum going.</p>
      </div>

      {/* XP earned */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #ff2a2a20, #cc000020)",
          border: "1px solid rgba(255,26,26,0.3)",
        }}
      >
        <Zap className="w-6 h-6 text-red-400" />
        <div className="text-left">
          <p className="text-3xl font-bold text-red-400">+{result.xp_earned} XP</p>
          <p className="text-gray-500 text-xs">{result.xp_total} total XP</p>
        </div>
      </motion.div>

      {/* Badges earned */}
      {result.badges_earned.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <p className="text-gray-400 text-sm font-medium">Badges Earned</p>
          <div className="flex flex-wrap justify-center gap-3">
            {result.badges_earned.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card"
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="text-sm text-white font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        {nextLessonSlug ? (
          <Link
            href={`/courses/${courseSlug}/${nextLessonSlug}`}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
              boxShadow: "0 0 16px rgba(255,26,26,0.3)",
            }}
          >
            Next Lesson
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              boxShadow: "0 0 16px rgba(22,163,74,0.3)",
            }}
          >
            Course Complete!
            <CheckCircle className="w-4 h-4" />
          </Link>
        )}
        <Link
          href={`/courses/${courseSlug}`}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-gray-400 border border-red-900/30 hover:text-gray-200 hover:border-red-800/50 transition-all text-sm"
        >
          Back to Course
        </Link>
      </motion.div>
    </motion.div>
  );
}
