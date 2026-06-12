import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const dropId = body.dropId as string;
  const cardIndex = Number(body.cardIndex);

  if (!dropId || Number.isNaN(cardIndex)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const drop = await prisma.drop.findFirst({
    where: { id: dropId, userId },
  });

  if (!drop) {
    return NextResponse.json({ error: "Drop not found" }, { status: 404 });
  }

  const lesson = drop.lessonJson as { cards: unknown[] };
  const card = lesson.cards[cardIndex];

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const existing = await prisma.savedCard.findFirst({
    where: { userId, dropId, cardIndex },
  });

  if (existing) {
    return NextResponse.json({ saved: true, id: existing.id });
  }

  const saved = await prisma.savedCard.create({
    data: { userId, dropId, cardIndex, cardJson: card },
  });

  return NextResponse.json({ saved: true, id: saved.id });
}
