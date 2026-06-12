"use client";

import { Flame } from "lucide-react";

type StreakBadgeProps = {
  streak: number;
};

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3.5 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <Flame
        className="h-3.5 w-3.5 text-[var(--theme-accent,#fbbf24)]"
        strokeWidth={2}
        aria-hidden
      />
      <span className="text-sm font-semibold tabular-nums text-white">{streak}</span>
      <span className="text-[11px] uppercase tracking-wider text-white/50">
        streak
      </span>
    </div>
  );
}
