"use client";

import { useState } from "react";
import { INTEREST_CATEGORIES, DEPTH_OPTIONS } from "@/lib/categories";

type InterestPickerProps = {
  onSubmit: (data: { categories: string[]; depth: string }) => Promise<void>;
};

export function InterestPicker({ onSubmit }: InterestPickerProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [depth, setDepth] = useState("INTERMEDIATE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleSubmit = async () => {
    if (selected.length < 3 || selected.length > 5) {
      setError("Pick 3 to 5 interests");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit({ categories: selected, depth });
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display mb-2 text-4xl text-white">MicroLearn</h1>
      <p className="mb-10 text-white/60">
        Pick 3–5 topics. Every day, one concept in ~60 seconds.
      </p>

      <h2 className="mb-4 text-sm uppercase tracking-widest text-white/50">
        Your interests
      </h2>
      <div className="mb-10 flex flex-wrap gap-3">
        {INTEREST_CATEGORIES.map((cat) => {
          const active = selected.includes(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggle(cat)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? "border-violet-400 bg-violet-500/20 text-white"
                  : "border-white/20 text-white/70 hover:border-white/40"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <h2 className="mb-4 text-sm uppercase tracking-widest text-white/50">
        Depth
      </h2>
      <div className="mb-10 space-y-3">
        {DEPTH_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
              depth === opt.value
                ? "border-violet-400 bg-violet-500/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <input
              type="radio"
              name="depth"
              value={opt.value}
              checked={depth === opt.value}
              onChange={() => setDepth(opt.value)}
              className="mt-1"
            />
            <div>
              <p className="font-medium text-white">{opt.label}</p>
              <p className="text-sm text-white/50">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <button
        type="button"
        disabled={loading}
        onClick={handleSubmit}
        className="w-full rounded-xl bg-violet-500 py-4 font-medium text-white transition hover:bg-violet-400 disabled:opacity-50"
      >
        {loading ? "Setting up…" : "Start learning"}
      </button>
    </div>
  );
}
