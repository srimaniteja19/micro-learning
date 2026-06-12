"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

type MotifProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

export function Spark({ palette, parallax = 0, paused }: MotifProps) {
  const reduced = useReducedMotion();
  const [c1, c2, c3] = palette;
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full opacity-25"
      style={{ transform: `translateX(${parallax * -8}px)` }}
      aria-hidden
    >
      {rays.map((deg, i) => (
        <motion.line
          key={i}
          x1="200"
          y1="200"
          x2={200 + 100 * Math.cos((deg * Math.PI) / 180)}
          y2={200 + 100 * Math.sin((deg * Math.PI) / 180)}
          stroke={[c1, c2, c3][i % 3]}
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={
            reduced || paused
              ? { opacity: 0.5 }
              : { opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.1, 0.8] }
          }
          transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
          style={{ transformOrigin: "200px 200px" }}
        />
      ))}
      <circle cx="200" cy="200" r="16" fill={c1} opacity="0.6" />
    </svg>
  );
}
