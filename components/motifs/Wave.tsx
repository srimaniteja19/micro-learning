"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

type MotifProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

export function Wave({ palette, parallax = 0, paused }: MotifProps) {
  const reduced = useReducedMotion();
  const [c1, c2, c3] = palette;

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full opacity-25"
      style={{ transform: `translateX(${parallax * -8}px)` }}
      aria-hidden
    >
      {[c1, c2, c3].map((c, i) => (
        <motion.path
          key={i}
          d="M0,200 Q100,120 200,200 T400,200"
          fill="none"
          stroke={c}
          strokeWidth="2"
          animate={
            reduced || paused
              ? { d: "M0,200 Q100,120 200,200 T400,200" }
              : {
                  d: [
                    "M0,200 Q100,120 200,200 T400,200",
                    "M0,200 Q100,280 200,200 T400,200",
                    "M0,200 Q100,120 200,200 T400,200",
                  ],
                }
          }
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          style={{ transform: `translateY(${i * 30 - 30}px)` }}
        />
      ))}
    </svg>
  );
}
