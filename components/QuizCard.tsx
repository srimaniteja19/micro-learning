"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { LessonType } from "@/lib/schemas/lesson";
import type { CategoryTheme } from "@/lib/themes";

type QuizCardProps = {
  quiz: LessonType["quiz"];
  theme: CategoryTheme;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
};

export function QuizCard({ quiz, theme, onAnswer, disabled }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (index: number) => {
    if (disabled || revealed) return;
    setSelected(index);
    setRevealed(true);
    onAnswer(index === quiz.correctIndex);
  };

  return (
    <div className="flex h-full w-full flex-col justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto max-w-lg"
      >
        <p className="mb-2 text-xs uppercase tracking-widest text-white/50">
          Quick check
        </p>
        <h2 className="font-display mb-8 text-2xl text-white md:text-3xl">
          {quiz.question}
        </h2>

        <div className="space-y-3">
          {quiz.options.map((option, i) => {
            const isCorrect = i === quiz.correctIndex;
            const isSelected = selected === i;
            let border = "border-white/20";
            let bg = "bg-white/5 hover:bg-white/10";

            if (revealed && isCorrect) {
              border = "border-emerald-400/60";
              bg = "bg-emerald-500/20";
            } else if (revealed && isSelected && !isCorrect) {
              border = "border-red-400/60";
              bg = "bg-red-500/20";
            }

            return (
              <button
                key={i}
                type="button"
                disabled={disabled || revealed}
                onClick={() => handleSelect(i)}
                className={`w-full rounded-xl border px-5 py-4 text-left text-white transition-colors ${border} ${bg}`}
              >
                <span
                  className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                  style={{ backgroundColor: `${theme.accent}33`, color: theme.accent }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {revealed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-sm leading-relaxed text-white/70"
          >
            {quiz.explanation}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
