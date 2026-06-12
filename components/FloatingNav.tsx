"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Zap } from "lucide-react";

const LINKS = [
  { href: "/", label: "Today", Icon: Zap },
  { href: "/library", label: "Library", Icon: Bookmark },
];

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.08] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[20px]">
        {LINKS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-white/15 text-white shadow-inner"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
