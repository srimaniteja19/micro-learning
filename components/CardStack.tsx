"use client";

import {
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { X } from "lucide-react";
import type { LessonType } from "@/lib/schemas/lesson";
import { getTheme, themeToCssVars } from "@/lib/themes";
import { Card } from "./Card";
import { QuizCard } from "./QuizCard";
import { ProgressDots } from "./ProgressDots";
import { CardAtmosphere } from "./CardAtmosphere";

type CardStackProps = {
  lesson: LessonType;
  dropId: string;
  completed?: boolean;
  initialIndex?: number;
  onClose?: () => void;
  onComplete?: (correct: boolean, streak: number, milestone: boolean) => void;
};

export function CardStack({
  lesson,
  dropId,
  completed = false,
  initialIndex = 0,
  onClose,
  onComplete,
}: CardStackProps) {
  const theme = getTheme(lesson.category);
  const totalSlides = lesson.cards.length + 1;
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const parallax = useMotionValue(0);

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= totalSlides) return;
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index, totalSlides],
  );

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
        return;
      }
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, onClose]);

  const handleQuizAnswer = async (correct: boolean) => {
    if (finishing || completed) return;
    setFinishing(true);

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch(`/api/drops/${dropId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correct, timezone: tz }),
      });
      const data = await res.json();
      if (data.milestone) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }
      onComplete?.(correct, data.streak, data.milestone);
    } catch {
      onComplete?.(correct, 0, false);
    }
  };

  const handleSave = async () => {
    if (index >= lesson.cards.length) return;
    await fetch("/api/cards/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dropId, cardIndex: index }),
    });
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) go(index + 1);
    else if (info.offset.x > 80) go(index - 1);
  };

  const isQuiz = index === lesson.cards.length;

  return (
    <div
      className={`relative h-[100dvh] w-full overflow-hidden text-white ${onClose ? "fixed inset-0 z-50" : ""}`}
      style={{
        ...themeToCssVars(theme),
        background: `linear-gradient(160deg, ${theme.gradient[0]} 0%, ${theme.gradient[1]} 100%)`,
      }}
    >
      <CardAtmosphere accent={theme.accent} />

      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-5">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close focus mode"
            className="rounded-full border border-white/10 bg-white/10 p-2 backdrop-blur-sm transition hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
            {lesson.category}
          </span>
        )}
        <ProgressDots total={totalSlides} current={index} onSelect={go} />
        {!isQuiz && (
          <button
            type="button"
            onClick={handleSave}
            aria-label="Save card"
            className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        )}
        {isQuiz && <div className="w-9" />}
      </div>

      <div
        className="absolute inset-0 z-10"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        <button
          type="button"
          aria-label="Previous card"
          className="absolute left-0 top-0 z-30 h-full w-1/4"
          onClick={() => go(index - 1)}
        />
        <button
          type="button"
          aria-label="Next card"
          className="absolute right-0 top-0 z-30 h-full w-1/4"
          onClick={() => go(index + 1)}
        />

        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDrag={(_, info) => parallax.set(info.offset.x / 100)}
            onDragEnd={onDragEnd}
            initial={{ x: direction >= 0 ? 300 : -300, opacity: 0, rotate: direction >= 0 ? 8 : -8 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: direction >= 0 ? -300 : 300, opacity: 0, rotate: direction >= 0 ? -8 : 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="absolute inset-0"
          >
            {isQuiz ? (
              <QuizCard
                quiz={lesson.quiz}
                theme={theme}
                onAnswer={handleQuizAnswer}
                disabled={completed || finishing}
              />
            ) : (
              <Card
                card={lesson.cards[index]}
                theme={theme}
                parallax={parallax.get()}
                paused={paused}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="absolute bottom-20 left-0 right-0 z-20 text-center text-[11px] tracking-wide text-white/30">
        Swipe or use arrow keys · hold to pause animation
      </p>
    </div>
  );
}
