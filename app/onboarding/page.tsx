"use client";

import { useRouter } from "next/navigation";
import { InterestPicker } from "@/components/InterestPicker";

export default function OnboardingPage() {
  const router = useRouter();

  const handleSubmit = async (data: { categories: string[]; depth: string }) => {
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Onboarding failed");
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-[100dvh] bg-[#0a0a12] pb-20">
      <InterestPicker onSubmit={handleSubmit} />
    </main>
  );
}
