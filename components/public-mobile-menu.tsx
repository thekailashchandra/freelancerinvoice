"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { LocaleCountrySwitcher } from "@/components/locale-country-switcher";
import { publicNavKeys } from "@/lib/i18n/public-nav-keys";
import { mobileNavLinks } from "@/data/public-navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function PublicMobileMenu() {
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label={t("nav.openMenu")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 overflow-y-auto">
        <h2 className="text-lg font-semibold">{t("nav.menu")}</h2>
        <div className="mt-4">
          <LocaleCountrySwitcher variant="compact" className="w-full justify-start" />
        </div>
        <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile navigation">
          {mobileNavLinks.map((link) => (
            <SheetClose key={link.href} asChild>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {t(publicNavKeys[link.href] ?? link.label)}
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              {t("nav.signIn")}
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
