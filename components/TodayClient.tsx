"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { BentoGrid } from "@/components/BentoGrid";
import { CardStack } from "@/components/CardStack";
import { BrewingAnimation } from "@/components/BrewingAnimation";
import { FloatingNav } from "@/components/FloatingNav";
import { StreakBadge } from "@/components/StreakBadge";
import { getNextCategoryInRotation } from "@/lib/drops";
import { getTheme, themeToCssVars } from "@/lib/themes";
import type { LessonType } from "@/lib/schemas/lesson";

type TodayClientProps = {
  initialDrop: {
    id: string;
    completed: boolean;
    lesson: LessonType;
  } | null;
  streak: number;
  needsGenerate: boolean;
  interests: string[];
};

export function TodayClient({
  initialDrop,
  streak,
  needsGenerate,
  interests,
}: TodayClientProps) {
  const [drop, setDrop] = useState(initialDrop);
  const [loading, setLoading] = useState(needsGenerate);
  const [error, setError] = useState<string | null>(null);
  const [currentStreak, setCurrentStreak] = useState(streak);
  const [done, setDone] = useState(initialDrop?.completed ?? false);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!needsGenerate) return;

    fetch("/api/drops/generate", { method: "POST" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to generate today's drop");
        }
        if (!data.lesson?.category || !Array.isArray(data.lesson?.cards)) {
          throw new Error("Received an invalid lesson from the server");
        }
        setDrop({
          id: data.id,
          completed: data.completed,
          lesson: data.lesson,
        });
        setDone(data.completed);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, [needsGenerate]);

  if (loading) return <BrewingAnimation />;

  if (error || !drop?.lesson) {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center bg-[#0a0a12] px-6 text-center text-white">
        <p className="font-display mb-2 text-xl">Couldn&apos;t brew your drop</p>
        <p className="mb-6 max-w-sm text-sm text-white/50">
          {error ?? "Lesson data is missing. Try again."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-violet-500 px-6 py-3 text-sm font-medium hover:bg-violet-400"
        >
          Retry
        </button>
      </div>
    );
  }

  const theme = getTheme(drop.lesson.category);
  const tomorrowCategory = getNextCategoryInRotation(
    interests,
    drop.lesson.category,
  );

  return (
    <>
      <main
        className="min-h-[100dvh] bg-[#0a0a12] px-5 pb-32 pt-8 md:px-8"
        style={themeToCssVars(theme)}
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]"
                style={{
                  backgroundColor: `${theme.tiles[0]}33`,
                  color: theme.accent,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
                {drop.lesson.category}
              </span>
            </div>
            <h1 className="font-display text-[2rem] font-light leading-tight text-white md:text-[2rem]">
              {drop.lesson.topic}
            </h1>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <StreakBadge streak={currentStreak} />
            {done && (
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium tracking-wide text-emerald-200 backdrop-blur-xl">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                Done
              </div>
            )}
          </div>
        </header>

        <BentoGrid
          lesson={drop.lesson}
          theme={theme}
          onTileClick={setFocusIndex}
          doneBanner={
            done ? { tomorrowCategory } : null
          }
        />
      </main>

      <FloatingNav />

      <AnimatePresence>
        {focusIndex !== null && (
          <CardStack
            lesson={drop.lesson}
            dropId={drop.id}
            completed={drop.completed}
            initialIndex={focusIndex}
            onClose={() => setFocusIndex(null)}
            onComplete={(_correct, newStreak) => {
              setCurrentStreak(newStreak);
              setDone(true);
              setFocusIndex(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
