"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

type MotifProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

export function PulseBars({ palette, parallax = 0, paused }: MotifProps) {
  const reduced = useReducedMotion();
  const [c1, c2, c3] = palette;
  const colors = [c1, c2, c3, c2, c1, c3];

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full opacity-25"
      style={{ transform: `translateX(${parallax * -8}px)` }}
      aria-hidden
    >
      {colors.map((c, i) => (
        <motion.rect
          key={i}
          x={60 + i * 50}
          width="30"
          rx="4"
          fill={c}
          animate={
            reduced || paused
              ? { y: 200, height: 80 }
              : { y: [280, 120, 280], height: [40, 160, 40] }
          }
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </svg>
  );
}
