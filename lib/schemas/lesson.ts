import { z } from "zod";

export const VisualMotif = z.enum([
  "orbit",
  "flowNodes",
  "pulseBars",
  "wave",
  "stackBlocks",
  "branch",
  "spark",
  "gridReveal",
  "spiral",
  "morphBlob",
]);

export const Card = z.object({
  type: z.enum(["hook", "concept", "example", "takeaway"]),
  title: z.string().max(60),
  body: z.string().max(320),
  emphasis: z.string().max(80).optional(),
  visual: VisualMotif,
});

export const Lesson = z.object({
  category: z.string(),
  topic: z.string().max(80),
  cards: z.array(Card).min(4).max(6),
  quiz: z.object({
    question: z.string().max(160),
    options: z.array(z.string().max(80)).length(3),
    correctIndex: z.number().int().min(0).max(2),
    explanation: z.string().max(200),
  }),
});

export type VisualMotifType = z.infer<typeof VisualMotif>;
export type CardType = z.infer<typeof Card>;
export type LessonType = z.infer<typeof Lesson>;

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + "…";
}

/** Gracefully trim overlong strings instead of failing the whole drop. */
export function normalizeLesson(raw: unknown): LessonType {
  const parsed = Lesson.safeParse(raw);
  if (parsed.success) return parsed.data;

  const obj = raw as Record<string, unknown>;
  const cards = Array.isArray(obj?.cards)
    ? obj.cards.map((c: Record<string, unknown>) => ({
        type: c.type,
        title: truncate(String(c.title ?? ""), 60),
        body: truncate(String(c.body ?? ""), 320),
        emphasis: c.emphasis
          ? truncate(String(c.emphasis), 80)
          : undefined,
        visual: c.visual ?? "gridReveal",
      }))
    : [];

  const quiz = obj?.quiz as Record<string, unknown> | undefined;

  return Lesson.parse({
    category: String(obj?.category ?? "General"),
    topic: truncate(String(obj?.topic ?? "Untitled"), 80),
    cards,
    quiz: {
      question: truncate(String(quiz?.question ?? "Quick check"), 160),
      options: (Array.isArray(quiz?.options) ? quiz.options : ["A", "B", "C"]).map(
        (o) => truncate(String(o), 80),
      ),
      correctIndex: Number(quiz?.correctIndex ?? 0),
      explanation: truncate(String(quiz?.explanation ?? ""), 200),
    },
  });
}
