"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuideNavMenu } from "@/components/guide-nav-menu";
import { LocaleCountrySwitcher } from "@/components/locale-country-switcher";
import { PublicMobileMenu } from "@/components/public-mobile-menu";
import { useTranslation } from "@/components/locale-provider";
import { SiteLogo } from "@/components/site-logo";
import { mainNavLinks } from "@/data/public-navigation";
import { Button } from "@/components/ui/button";

const publicNavKeys: Record<string, string> = {
  "/features": "nav.features",
  "/pricing": "nav.pricing",
};

export function PublicSiteHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10 xl:px-12">
        <SiteLogo variant="full" href="/" priority />
        <nav
          className="flex items-center gap-0.5 sm:gap-1"
          aria-label="Main navigation"
        >
          <PublicMobileMenu />
          {mainNavLinks.map((link) => (
            <div key={link.href} className="hidden sm:block">
              <Button variant="ghost" asChild>
                <Link href={link.href}>
                  {t(publicNavKeys[link.href] ?? link.label)}
                </Link>
              </Button>
            </div>
          ))}
          <GuideNavMenu />
          <LocaleCountrySwitcher />
          <div className="hidden sm:block">
            <Button variant="ghost" asChild>
              <Link href="/login">{t("nav.signIn")}</Link>
            </Button>
          </div>
          <Button asChild size="sm" className="sm:size-default">
            <Link href="/signup">
              <span className="hidden sm:inline">{t("nav.getStarted")}</span>
              <span className="sm:hidden">{t("nav.signUp")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
