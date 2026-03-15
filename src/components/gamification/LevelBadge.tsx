import { getLevelTitle } from "@/lib/gamification/xp";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const title = getLevelTitle(level);

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center rounded-xl font-bold text-white",
        size === "sm" && "w-8 h-8 text-xs",
        size === "md" && "w-12 h-12 text-sm",
        size === "lg" && "w-16 h-16 text-lg"
      )}
      style={{
        background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
        boxShadow: "0 0 12px rgba(255,26,26,0.4)",
      }}
      title={title}
    >
      {level}
    </div>
  );
}
