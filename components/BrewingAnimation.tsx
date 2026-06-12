"use client";

import { motion } from "framer-motion";

export function BrewingAnimation() {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-[#0a0a12] text-white">
      <motion.div
        className="mb-8 flex gap-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-3 w-3 rounded-full bg-violet-400"
            variants={{
              hidden: { opacity: 0.3, y: 0 },
              visible: {
                opacity: [0.3, 1, 0.3],
                y: [0, -12, 0],
                transition: { duration: 1.2, repeat: Infinity, delay: i * 0.2 },
              },
            }}
          />
        ))}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-display text-xl text-white/80"
      >
        Brewing your drop…
      </motion.p>
      <p className="mt-2 text-sm text-white/40">Crafting today&apos;s micro-lesson</p>
    </div>
  );
}
