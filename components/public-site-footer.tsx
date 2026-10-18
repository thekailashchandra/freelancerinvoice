"use client";

import Link from "next/link";
import { PrivacyConsentLink } from "@/components/privacy-consent-link";
import { useTranslation } from "@/components/locale-provider";
import { publicNavKeys } from "@/lib/i18n/public-nav-keys";
import { footerNavLinks } from "@/data/public-navigation";
import { siteConfig } from "@/data/site";

export function PublicSiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto w-full max-w-7xl px-6 text-center text-sm text-muted-foreground lg:px-10 xl:px-12">
        <p>
          © {new Date().getFullYear()}{" "}
          <a href={siteConfig.url} className="text-foreground hover:underline">
            {siteConfig.name}
          </a>
          {" · "}
          {t("footer.tagline")}
        </p>
        <nav
          className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
          aria-label="Footer"
        >
          {footerNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground hover:underline"
            >
              {t(publicNavKeys[link.href] ?? link.label)}
            </Link>
          ))}
          <a
            href={`${siteConfig.url}/sitemap.xml`}
            className="hover:text-foreground hover:underline"
          >
            {t("footer.sitemap")}
          </a>
          <a
            href={`${siteConfig.url}/llms.txt`}
            className="hover:text-foreground hover:underline"
          >
            {t("footer.llmsTxt")}
          </a>
          <PrivacyConsentLink className="hover:text-foreground" />
        </nav>
      </div>
    </footer>
  );
}
