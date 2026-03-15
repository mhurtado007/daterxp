"use client";

import { motion } from "framer-motion";
import { getXPProgress, getLevelTitle } from "@/lib/gamification/xp";
import { formatXP } from "@/lib/utils";

interface XPBarProps {
  totalXP: number;
  compact?: boolean;
}

export function XPBar({ totalXP, compact = false }: XPBarProps) {
  const { level, currentXP, neededXP, percentage } = getXPProgress(totalXP);
  const title = getLevelTitle(level);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #ff2a2a, #cc0000)" }}
        >
          {level}
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-2 rounded-full bg-red-950/60 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #ff4444, #ff1a1a)",
                boxShadow: "0 0 8px rgba(255,26,26,0.6)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {formatXP(currentXP)}/{formatXP(neededXP)}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
              boxShadow: "0 0 12px rgba(255,26,26,0.4)",
            }}
          >
            {level}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{title}</p>
            <p className="text-gray-500 text-xs">Level {level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white text-sm font-medium">
            {formatXP(currentXP)} <span className="text-gray-500">/ {formatXP(neededXP)} XP</span>
          </p>
          <p className="text-gray-500 text-xs">{percentage}% to Level {level + 1}</p>
        </div>
      </div>

      <div className="h-3 rounded-full bg-red-950/60 overflow-hidden">
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: "linear-gradient(90deg, #ff6644, #ff1a1a, #cc0000)",
            boxShadow: "0 0 10px rgba(255,26,26,0.5)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
