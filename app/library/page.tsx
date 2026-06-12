import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { LibraryClient } from "@/components/LibraryClient";
import type { CardType } from "@/lib/schemas/lesson";

export default async function LibraryPage() {
  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  const saved = await prisma.savedCard.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const drops = await prisma.drop.findMany({
    where: { id: { in: saved.map((s) => s.dropId) } },
    select: { id: true, category: true },
  });

  const categoryMap = new Map(drops.map((d) => [d.id, d.category]));

  const items = saved.map((item) => ({
    id: item.id,
    cardIndex: item.cardIndex,
    category: categoryMap.get(item.dropId) ?? "General",
    card: item.cardJson as CardType,
  }));

  return <LibraryClient items={items} />;
}
