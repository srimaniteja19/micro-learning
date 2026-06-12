"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingNav } from "@/components/FloatingNav";
import { MiniMotif } from "@/components/MiniMotif";
import { getTextColor } from "@/lib/colorUtils";
import { getTheme, getTileColor } from "@/lib/themes";
import type { CardType } from "@/lib/schemas/lesson";

export type SavedCardItem = {
  id: string;
  cardIndex: number;
  category: string;
  card: CardType;
};

type LibraryClientProps = {
  items: SavedCardItem[];
};

export function LibraryClient({ items }: LibraryClientProps) {
  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category))].sort(),
    [items],
  );
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? items.filter((i) => i.category === filter)
    : items;

  return (
    <main className="min-h-[100dvh] bg-[#0a0a12] px-5 pb-32 pt-8 md:px-8">
      <h1 className="font-display mb-2 text-3xl font-light text-white">
        Library
      </h1>
      <p className="mb-6 text-white/50">Cards you&apos;ve bookmarked</p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-12 text-center">
          <p className="text-white/60">No saved cards yet.</p>
          <Link
            href="/"
            className="mt-4 inline-block text-violet-400 hover:text-violet-300"
          >
            Go to today&apos;s drop →
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filter === null
                  ? "bg-white/15 text-white"
                  : "bg-white/5 text-white/50 hover:text-white/80"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const theme = getTheme(cat);
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className="rounded-full px-3 py-1.5 text-xs font-medium transition"
                  style={{
                    backgroundColor: active ? theme.tiles[0] : `${theme.tiles[0]}22`,
                    color: active ? getTextColor(theme.tiles[0]) : theme.accent,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={filter ?? "all"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="columns-2 gap-3 md:columns-3"
            >
              {filtered.map((item) => {
                const theme = getTheme(item.category);
                const bg = getTileColor(theme, item.cardIndex);
                const text = getTextColor(bg);

                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-3 break-inside-avoid overflow-hidden rounded-2xl p-5"
                    style={{ backgroundColor: bg, color: text }}
                  >
                    <MiniMotif
                      visual={item.card.visual}
                      palette={theme.motifPalette}
                      size={64}
                      opacity={0.18}
                    />
                    <p
                      className="mb-1 text-[10px] uppercase tracking-widest opacity-50"
                    >
                      {item.category} · {item.card.type}
                    </p>
                    <h2 className="font-display mb-2 pr-12 text-lg font-light leading-snug">
                      {item.card.title}
                    </h2>
                    <p className="text-sm leading-relaxed opacity-75">
                      {item.card.body}
                    </p>
                    {item.card.emphasis && (
                      <p
                        className="font-display mt-3 text-sm italic"
                        style={{ color: theme.accent }}
                      >
                        {item.card.emphasis}
                      </p>
                    )}
                  </motion.article>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <FloatingNav />
    </main>
  );
}
