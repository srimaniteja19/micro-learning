import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSessionUser } from "@/lib/session";
import type { Depth } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.json();
  const categories = body.categories as string[];
  const depth = body.depth as Depth;

  if (!Array.isArray(categories) || categories.length < 3 || categories.length > 5) {
    return NextResponse.json(
      { error: "Pick 3 to 5 categories" },
      { status: 400 },
    );
  }

  const email = `user-${Date.now()}@microlearn.local`;

  const user = await prisma.user.create({
    data: {
      email,
      depth,
      interests: {
        create: categories.map((category) => ({ category, active: true })),
      },
    },
  });

  await setSessionUser(user.id);

  return NextResponse.json({ userId: user.id });
}
