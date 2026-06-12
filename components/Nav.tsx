"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Zap } from "lucide-react";

const LINKS = [
  { href: "/", label: "Today", Icon: Zap },
  { href: "/library", label: "Library", Icon: Bookmark },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-white/[0.05] backdrop-blur-[20px]">
      <div
        className="mx-auto flex h-16 max-w-lg items-stretch justify-around pb-[env(safe-area-inset-bottom)]"
        style={{ minHeight: "calc(4rem + env(safe-area-inset-bottom))" }}
      >
        {LINKS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                active ? "text-[var(--theme-accent,#a78bfa)]" : "text-white/45 hover:text-white/70"
              }`}
            >
              {active && (
                <span
                  className="absolute top-0 h-0.5 w-10 rounded-full bg-[var(--theme-accent,#a78bfa)]"
                  aria-hidden
                />
              )}
              <Icon
                className="h-[18px] w-[18px]"
                strokeWidth={active ? 2.25 : 1.75}
              />
              <span className="text-[11px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
