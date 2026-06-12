import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getOrGenerateTodayDrop, lessonFromDrop } from "@/lib/drops";
import type { LessonType } from "@/lib/schemas/lesson";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.interests.length === 0) {
    return NextResponse.json({ error: "No interests configured" }, { status: 400 });
  }

  try {
    const drop = await getOrGenerateTodayDrop(user.id);
    const lesson = lessonFromDrop(drop);
    return NextResponse.json({
      id: drop.id,
      completed: drop.completed,
      category: drop.category,
      topic: drop.topic,
      lesson,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
