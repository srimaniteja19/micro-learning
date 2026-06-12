import { prisma } from "@/lib/db";

const STREAK_MILESTONES = [3, 7, 14, 30];

export function isStreakMilestone(streak: number): boolean {
  return STREAK_MILESTONES.includes(streak);
}

export function startOfDayUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function startOfDayInTimezone(date: Date, timezone: string): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);

  return new Date(Date.UTC(y, m - 1, d));
}

export async function incrementStreak(
  userId: string,
  timezone = "UTC",
): Promise<{ streak: number; milestone: boolean }> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const today = startOfDayInTimezone(new Date(), timezone);
  const lastDrop = user.lastDropAt
    ? startOfDayInTimezone(user.lastDropAt, timezone)
    : null;

  let newStreak = user.streak;

  if (!lastDrop) {
    newStreak = 1;
  } else {
    const diffDays = Math.round(
      (today.getTime() - lastDrop.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) {
      return { streak: user.streak, milestone: false };
    }
    newStreak = diffDays === 1 ? user.streak + 1 : 1;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { streak: newStreak, lastDropAt: new Date() },
  });

  return { streak: newStreak, milestone: isStreakMilestone(newStreak) };
}
