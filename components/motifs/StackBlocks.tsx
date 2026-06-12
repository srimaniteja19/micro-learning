"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

type MotifProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

export function StackBlocks({ palette, parallax = 0, paused }: MotifProps) {
  const reduced = useReducedMotion();
  const [c1, c2, c3] = palette;
  const blocks = [
    { w: 200, c: c1, y: 240 },
    { w: 160, c: c2, y: 190 },
    { w: 120, c: c3, y: 140 },
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full opacity-25"
      style={{ transform: `translateX(${parallax * -8}px)` }}
      aria-hidden
    >
      {blocks.map((b, i) => (
        <motion.rect
          key={i}
          x={(400 - b.w) / 2}
          y={b.y}
          width={b.w}
          height="40"
          rx="6"
          fill={b.c}
          animate={
            reduced || paused ? {} : { y: [b.y, b.y - 8, b.y], opacity: [0.5, 0.9, 0.5] }
          }
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </svg>
  );
}
