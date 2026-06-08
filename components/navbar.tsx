"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { navItems } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function Navbar() {
  const pathname = usePathname();
  const title =
    navItems.find((n) => pathname.startsWith(n.href))?.title ?? siteConfig.name;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-background px-4 md:h-16 md:px-5">
      <h1 className="min-w-0 truncate text-base font-semibold tracking-tight md:text-lg">
        {title}
      </h1>

      <div className="flex shrink-0 items-center gap-1">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
