"use client";

import { usePathname } from "next/navigation";
import { LocaleCountrySwitcher } from "@/components/locale-country-switcher";
import { useTranslation } from "@/components/locale-provider";
import { UserMenu } from "@/components/user-menu";
import { navItems } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const activeItem = navItems.find((n) => pathname.startsWith(n.href));
  const title = activeItem ? t(activeItem.titleKey) : siteConfig.name;

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/80 md:h-16 md:px-5">
      <h1 className="min-w-0 truncate text-base font-semibold tracking-tight md:text-lg">
        {title}
      </h1>

      <div className="flex shrink-0 items-center gap-1">
        <LocaleCountrySwitcher />
        <UserMenu />
      </div>
    </header>
  );
}
