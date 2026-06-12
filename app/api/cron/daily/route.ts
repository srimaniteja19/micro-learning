import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrGenerateTodayDrop } from "@/lib/drops";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    include: { interests: { where: { active: true } } },
  });

  const results: { userId: string; status: string }[] = [];

  for (const user of users) {
    if (user.interests.length === 0) {
      results.push({ userId: user.id, status: "skipped_no_interests" });
      continue;
    }

    try {
      await getOrGenerateTodayDrop(user.id);
      results.push({ userId: user.id, status: "generated" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "failed";
      results.push({ userId: user.id, status: `error: ${message}` });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
