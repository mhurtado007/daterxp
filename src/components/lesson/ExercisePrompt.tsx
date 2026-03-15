"use client";

import { motion } from "framer-motion";
import type { ExerciseBlock } from "@/lib/types/app";

interface ExercisePromptProps {
  block: ExerciseBlock;
  value: string;
  onChange: (value: string) => void;
}

export function ExercisePrompt({ block, value, onChange }: ExercisePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <span className="text-xs text-red-400 font-medium uppercase tracking-widest mb-2 block">
          Reflection Exercise
        </span>
        <h2 className="text-xl font-bold text-white leading-snug">{block.prompt}</h2>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={block.placeholder ?? "Write your thoughts here..."}
        rows={5}
        className="w-full px-5 py-4 rounded-xl bg-[#1a0a0a] border border-red-900/30 text-white placeholder-gray-600 focus:outline-none focus:border-red-700/60 focus:ring-1 focus:ring-red-700/40 transition-all resize-none text-sm leading-relaxed"
      />

      <p className="text-gray-600 text-xs">
        This is a private reflection — your answer is only for you.
      </p>
    </motion.div>
  );
}
