"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizBlock } from "@/lib/types/app";

interface QuizQuestionProps {
  block: QuizBlock;
  selected: number | null;
  onSelect: (index: number) => void;
  revealed: boolean;
}

export function QuizQuestion({ block, selected, onSelect, revealed }: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <h2 className="text-xl font-bold text-white leading-snug">{block.question}</h2>

      <div className="space-y-3">
        {block.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === block.correct;
          const showCorrect = revealed && isCorrect;
          const showWrong = revealed && isSelected && !isCorrect;

          return (
            <button
              key={i}
              onClick={() => !revealed && onSelect(i)}
              disabled={revealed}
              className={cn(
                "w-full px-5 py-4 rounded-xl text-left text-sm font-medium transition-all duration-200 border",
                !revealed && !isSelected &&
                  "bg-red-950/20 border-red-900/30 text-gray-300 hover:bg-red-950/40 hover:border-red-800/50 hover:text-white",
                !revealed && isSelected &&
                  "bg-red-900/30 border-red-700/60 text-white",
                showCorrect &&
                  "bg-green-950/40 border-green-700/60 text-green-300",
                showWrong &&
                  "bg-red-950/60 border-red-700/60 text-red-300",
                revealed && !isSelected && !isCorrect &&
                  "bg-red-950/10 border-red-900/20 text-gray-600"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 border",
                    showCorrect
                      ? "bg-green-600 border-green-500 text-white"
                      : showWrong
                      ? "bg-red-700 border-red-600 text-white"
                      : isSelected
                      ? "bg-red-800 border-red-600 text-white"
                      : "bg-red-950/40 border-red-900/40 text-gray-500"
                  )}
                >
                  {revealed && showCorrect ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : revealed && showWrong ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </div>
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {revealed && block.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 py-4 rounded-xl bg-blue-950/30 border border-blue-800/30 text-blue-300 text-sm"
        >
          <strong>Explanation:</strong> {block.explanation}
        </motion.div>
      )}
    </motion.div>
  );
}
