"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  days: number;
  compact?: boolean;
}

export function StreakCounter({ days, compact = false }: StreakCounterProps) {
  const isActive = days > 0;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5", !isActive && "opacity-40")}>
        <Flame
          className={cn("w-5 h-5", isActive ? "text-orange-500" : "text-gray-600")}
          fill={isActive ? "currentColor" : "none"}
        />
        <span className={cn("font-bold text-sm", isActive ? "text-orange-400" : "text-gray-600")}>
          {days}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", !isActive && "opacity-50")}>
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          isActive
            ? "bg-orange-950/40 border border-orange-800/40"
            : "bg-gray-900/40 border border-gray-800/40"
        )}
      >
        <Flame
          className={cn("w-6 h-6", isActive ? "text-orange-500" : "text-gray-600")}
          fill={isActive ? "currentColor" : "none"}
        />
      </div>
      <div>
        <p className={cn("text-2xl font-bold", isActive ? "text-orange-400" : "text-gray-600")}>
          {days}
        </p>
        <p className="text-gray-500 text-xs">
          {days === 1 ? "day streak" : "day streak"}
        </p>
      </div>
    </div>
  );
}
