"use client";

import { motion } from "framer-motion";
import type { VisualMotifType } from "@/lib/schemas/lesson";
import { getTextColor } from "@/lib/colorUtils";
import { MiniMotif } from "./MiniMotif";

export type BentoCardProps = {
  type: string;
  title: string;
  body: string;
  emphasis?: string;
  bgColor: string;
  accent: string;
  motif: VisualMotifType;
  motifPalette: [string, string, string];
  index: number;
  isHook?: boolean;
  isQuiz?: boolean;
  expanded?: boolean;
  onClick?: () => void;
};

export function BentoCard({
  type,
  title,
  body,
  emphasis,
  bgColor,
  accent,
  motif,
  motifPalette,
  index,
  isHook = false,
  isQuiz = false,
  expanded = false,
  onClick,
}: BentoCardProps) {
  const textColor = getTextColor(bgColor);
  const isLight = textColor === "#111827";
  const labelOpacity = isLight ? "text-gray-900/50" : "text-white/50";
  const bodyOpacity = isLight ? "text-gray-900/75" : "text-white/75";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex h-full min-h-[180px] w-full flex-col overflow-hidden rounded-2xl p-6 text-left shadow-sm transition-shadow hover:shadow-xl ${
        isQuiz ? "justify-between" : ""
      }`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {isHook && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at 70% 30%, color-mix(in srgb, ${accent} 8%, transparent), transparent 55%)`,
            }}
            aria-hidden
          />
          <span className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80 backdrop-blur-sm">
            Today&apos;s Drop
          </span>
        </>
      )}

      <MiniMotif
        visual={motif}
        palette={motifPalette}
        size={isHook ? 120 : 80}
        opacity={isHook ? 0.3 : 0.2}
      />

      <div className="relative z-10 flex flex-1 flex-col pr-16">
        <span
          className={`mb-2 text-[11px] font-medium uppercase tracking-[0.15em] ${labelOpacity}`}
        >
          {isQuiz ? "Quiz" : type}
        </span>

        <h3
          className={`font-display mb-3 font-light leading-tight ${
            isHook ? "text-[2.25rem]" : isQuiz ? "text-2xl" : "text-[1.375rem] md:text-[1.75rem]"
          }`}
        >
          {title}
        </h3>

        <p
          className={`flex-1 text-sm leading-relaxed ${bodyOpacity} ${
            isHook || expanded ? "" : "line-clamp-3"
          }`}
        >
          {body}
        </p>

        {isQuiz && (
          <span
            className="mt-4 inline-flex items-center text-sm font-medium"
            style={{ color: accent }}
          >
            Tap to answer →
          </span>
        )}
      </div>

      {emphasis && !isQuiz && (
        <p
          className="font-display relative z-10 mt-4 text-base italic leading-snug"
          style={{ color: accent }}
        >
          {emphasis}
        </p>
      )}
    </motion.button>
  );
}
