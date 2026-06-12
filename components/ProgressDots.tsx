"use client";

type ProgressDotsProps = {
  total: number;
  current: number;
  onSelect?: (index: number) => void;
};

export function ProgressDots({ total, current, onSelect }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to card ${i + 1}`}
          onClick={() => onSelect?.(i)}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "h-1.5 w-7 bg-[var(--theme-accent)] shadow-[0_0_12px_color-mix(in_srgb,var(--theme-accent)_40%,transparent)]"
              : "h-1.5 w-1.5 bg-white/25 hover:bg-white/45"
          }`}
        />
      ))}
    </div>
  );
}
