"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

type MotifProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

export function Orbit({ palette, parallax = 0, paused }: MotifProps) {
  const reduced = useReducedMotion();
  const [c1, c2, c3] = palette;

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full opacity-25"
      style={{ transform: `translateX(${parallax * -8}px)` }}
      aria-hidden
    >
      <circle cx="200" cy="200" r="60" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          r={6 + i * 2}
          fill={i === 0 ? c1 : i === 1 ? c2 : c3}
          animate={
            reduced || paused
              ? { cx: 200 + 80 * Math.cos((i * 2 * Math.PI) / 3), cy: 200 + 80 * Math.sin((i * 2 * Math.PI) / 3) }
              : { cx: [260, 140, 260], cy: [200, 200, 200] }
          }
          transition={
            reduced || paused
              ? { duration: 0 }
              : { duration: 8 + i, repeat: Infinity, ease: "linear" }
          }
        />
      ))}
      <motion.circle
        cx="200"
        cy="200"
        r="120"
        fill="none"
        stroke={c2}
        strokeWidth="0.5"
        strokeDasharray="4 8"
        animate={reduced || paused ? {} : { rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      />
    </svg>
  );
}
