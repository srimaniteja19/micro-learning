import { prisma } from "@/lib/db";
import { generateLesson } from "@/lib/openrouter";
import { startOfDayUTC } from "@/lib/streak";
import { normalizeLesson, type LessonType } from "@/lib/schemas/lesson";

export type DropRecord = {
  category: string;
  topic: string;
  lessonJson: unknown;
};

/** Merge drop metadata into lessonJson when AI omits fields. */
export function lessonFromDrop(drop: DropRecord): LessonType {
  const raw =
    drop.lessonJson && typeof drop.lessonJson === "object"
      ? (drop.lessonJson as Record<string, unknown>)
      : {};

  return normalizeLesson({
    ...raw,
    category: raw.category ?? drop.category,
    topic: raw.topic ?? drop.topic,
  });
}

export function getNextCategoryInRotation(
  categories: string[],
  current: string,
): string {
  if (categories.length === 0) return current;
  if (categories.length === 1) return categories[0];
  const idx = categories.indexOf(current);
  if (idx === -1) return categories[0];
  return categories[(idx + 1) % categories.length];
}

export async function pickCategory(userId: string): Promise<string> {
  const interests = await prisma.interest.findMany({
    where: { userId, active: true },
  });

  if (interests.length === 0) throw new Error("No active interests");

  const counts = await prisma.drop.groupBy({
    by: ["category"],
    where: { userId },
    _count: { category: true },
  });

  const countMap = new Map(counts.map((c) => [c.category, c._count.category]));

  return interests.reduce((best, curr) => {
    const bestCount = countMap.get(best.category) ?? 0;
    const currCount = countMap.get(curr.category) ?? 0;
    return currCount < bestCount ? curr : best;
  }).category;
}

export async function getPastTopics(
  userId: string,
  category: string,
): Promise<string[]> {
  const drops = await prisma.drop.findMany({
    where: { userId, category },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { topic: true },
  });
  return drops.map((d) => d.topic);
}

export async function getOrGenerateTodayDrop(userId: string) {
  const today = startOfDayUTC(new Date());

  const existing = await prisma.drop.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  if (existing) return existing;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const category = await pickCategory(userId);
  const pastTopics = await getPastTopics(userId, category);

  const lesson: LessonType = await generateLesson(
    user.depth,
    category,
    pastTopics,
  );

  const normalized = normalizeLesson({
    ...lesson,
    category: lesson.category || category,
  });

  return prisma.drop.create({
    data: {
      userId,
      date: today,
      category: normalized.category,
      topic: normalized.topic,
      lessonJson: normalized,
    },
  });
}
