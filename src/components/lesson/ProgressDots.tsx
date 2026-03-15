interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: i === current ? "24px" : "8px",
            background:
              i < current
                ? "#16a34a"
                : i === current
                ? "#ff1a1a"
                : "rgba(61,21,21,0.6)",
          }}
        />
      ))}
    </div>
  );
}
