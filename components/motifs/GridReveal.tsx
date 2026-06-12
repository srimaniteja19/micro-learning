"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

type MotifProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

export function GridReveal({ palette, parallax = 0, paused }: MotifProps) {
  const reduced = useReducedMotion();
  const [c1, c2, c3] = palette;
  const cells = Array.from({ length: 36 }, (_, i) => ({
    x: 80 + (i % 6) * 40,
    y: 80 + Math.floor(i / 6) * 40,
    delay: (i % 6) * 0.1 + Math.floor(i / 6) * 0.1,
  }));

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full opacity-25"
      style={{ transform: `translateX(${parallax * -8}px)` }}
      aria-hidden
    >
      {cells.map((cell, i) => (
        <motion.rect
          key={i}
          x={cell.x}
          y={cell.y}
          width="32"
          height="32"
          rx="4"
          fill={[c1, c2, c3][i % 3]}
          animate={
            reduced || paused
              ? { opacity: 0.3 }
              : { opacity: [0.1, 0.6, 0.1] }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: cell.delay,
          }}
        />
      ))}
    </svg>
  );
}
