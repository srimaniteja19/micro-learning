import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { startOfDayUTC } from "@/lib/streak";
import { TodayClient } from "@/components/TodayClient";
import { lessonFromDrop } from "@/lib/drops";

export default async function TodayPage() {
  const user = await getSessionUser();

  if (!user || user.interests.length === 0) {
    redirect("/onboarding");
  }

  const today = startOfDayUTC(new Date());
  const drop = await prisma.drop.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });

  let initialDrop = null;
  let needsGenerate = true;

  if (drop) {
    try {
      const lesson = lessonFromDrop(drop);
      if (lesson.cards.length >= 4) {
        initialDrop = {
          id: drop.id,
          completed: drop.completed,
          lesson,
        };
        needsGenerate = false;
      }
    } catch {
      // Corrupt lessonJson — regenerate below
    }
  }

  const interests = user.interests.map((i) => i.category);

  return (
    <TodayClient
      initialDrop={initialDrop}
      streak={user.streak}
      needsGenerate={needsGenerate}
      interests={interests}
    />
  );
}
