"use client";

import { motion } from "framer-motion";
import type { LessonType } from "@/lib/schemas/lesson";
import type { CategoryTheme } from "@/lib/themes";
import { getTileColor } from "@/lib/themes";
import { getTextColor } from "@/lib/colorUtils";
import { getGridPlacement } from "@/lib/bentoLayout";
import { BentoCard } from "./BentoCard";

type BentoGridProps = {
  lesson: LessonType;
  theme: CategoryTheme;
  onTileClick: (index: number) => void;
  doneBanner?: {
    tomorrowCategory: string;
  } | null;
};

export function BentoGrid({
  lesson,
  theme,
  onTileClick,
  doneBanner,
}: BentoGridProps) {
  const totalTiles = lesson.cards.length + 1;
  const quizPlacement = getGridPlacement(
    lesson.cards.length,
    totalTiles,
    false,
    true,
  );

  return (
    <div
      className="grid grid-cols-2 gap-3 md:grid-cols-3"
      style={{ gridAutoRows: "minmax(180px, auto)" }}
    >
      {lesson.cards.map((card, i) => {
        const placement = getGridPlacement(i, totalTiles, i === 0, false);

        return (
          <div
            key={`card-${i}`}
            className={placement.className}
            style={{
              gridColumn: placement.gridColumn,
              gridRow: placement.gridRow,
            }}
          >
            <BentoCard
              type={card.type}
              title={card.title}
              body={card.body}
              emphasis={card.emphasis}
              bgColor={getTileColor(theme, i)}
              accent={theme.accent}
              motif={card.visual}
              motifPalette={theme.motifPalette}
              index={i}
              isHook={i === 0}
              onClick={() => onTileClick(i)}
            />
          </div>
        );
      })}

      <div
        className={quizPlacement.className}
        style={{
          gridColumn: quizPlacement.gridColumn,
          gridRow: quizPlacement.gridRow,
        }}
      >
        <BentoCard
          type="quiz"
          title="Quick check"
          body={lesson.quiz.question}
          bgColor={getTileColor(theme, 5)}
          accent={theme.accent}
          motif="spark"
          motifPalette={theme.motifPalette}
          index={lesson.cards.length}
          isQuiz
          onClick={() => onTileClick(lesson.cards.length)}
        />
      </div>

      {doneBanner && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 mt-2 rounded-2xl p-6 md:col-span-3"
          style={{
            backgroundColor: theme.accent,
            color: getTextColor(theme.accent),
          }}
        >
          <p className="font-display text-xl font-light">
            You&apos;re done for today 🎉
          </p>
          <p className="mt-1 text-sm opacity-80">
            Tomorrow: {doneBanner.tomorrowCategory} →
          </p>
        </motion.div>
      )}
    </div>
  );
}
