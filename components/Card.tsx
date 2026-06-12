"use client";

import { motion } from "framer-motion";
import type { CardType } from "@/lib/schemas/lesson";
import type { CategoryTheme } from "@/lib/themes";
import { getMotif } from "@/components/motifs";

type CardProps = {
  card: CardType;
  theme: CategoryTheme;
  parallax?: number;
  paused?: boolean;
};

const bodyStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.4 },
  },
};

const lineVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export function Card({ card, theme, parallax = 0, paused }: CardProps) {
  const Motif = getMotif(card.visual);
  const lines = card.body.split(/(?<=[.!?])\s+/);

  return (
    <div className="relative h-full w-full overflow-hidden pb-24 pt-28">
      <motion.div
        className="absolute right-0 top-0 h-full w-[62%] overflow-hidden"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 22,
          delay: 0.1,
        }}
      >
        <Motif palette={theme.motifPalette} parallax={parallax} paused={paused} />
      </motion.div>

      <div className="relative z-10 flex h-full w-full max-w-[480px] flex-col justify-center px-8 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
          className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--theme-accent)] opacity-60"
        >
          {card.type}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease: "easeOut" }}
          className="font-display mb-8 text-[2.25rem] font-light leading-[1.1] text-white md:text-[3.25rem]"
        >
          {card.title}
        </motion.h2>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={bodyStagger}
          className="max-w-[420px] space-y-3 text-[17px] leading-[1.6] text-white/75"
        >
          {lines.map((line, i) => (
            <motion.p key={i} variants={lineVariant}>
              {line}
            </motion.p>
          ))}
        </motion.div>

        {card.emphasis && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="font-display mt-10 max-w-[420px] border-l-[3px] pl-6 text-[1.75rem] italic leading-[1.3] text-[var(--theme-accent)]"
            style={{ borderColor: "var(--theme-accent)" }}
          >
            {card.emphasis}
          </motion.p>
        )}
      </div>
    </div>
  );
}
