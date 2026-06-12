import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { incrementStreak } from "@/lib/streak";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const correct = Boolean(body.correct);
  const timezone = typeof body.timezone === "string" ? body.timezone : "UTC";

  const drop = await prisma.drop.findFirst({
    where: { id, userId },
  });

  if (!drop) {
    return NextResponse.json({ error: "Drop not found" }, { status: 404 });
  }

  if (drop.completed) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return NextResponse.json({
      streak: user.streak,
      milestone: false,
      alreadyCompleted: true,
    });
  }

  await prisma.drop.update({
    where: { id },
    data: { completed: true, quizCorrect: correct },
  });

  const { streak, milestone } = await incrementStreak(userId, timezone);

  return NextResponse.json({ streak, milestone });
}
