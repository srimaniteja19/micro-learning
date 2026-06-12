"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

type MotifProps = {
  palette: [string, string, string];
  parallax?: number;
  paused?: boolean;
};

export function Spiral({ palette, parallax = 0, paused }: MotifProps) {
  const reduced = useReducedMotion();
  const [c1, c2] = palette;

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full opacity-25"
      style={{ transform: `translateX(${parallax * -8}px)` }}
      aria-hidden
    >
      <motion.path
        d="M200,200 Q220,180 240,200 T280,240 T300,300 T240,340 T160,340 T100,280 T120,200 T200,200"
        fill="none"
        stroke={c1}
        strokeWidth="2"
        animate={reduced || paused ? {} : { rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      />
      <motion.circle
        cx="200"
        cy="200"
        r="80"
        fill="none"
        stroke={c2}
        strokeWidth="1"
        strokeDasharray="6 10"
        animate={reduced || paused ? {} : { rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      />
    </svg>
  );
}
