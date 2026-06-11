import Link from "next/link";
import { PrivacyConsentLink } from "@/components/privacy-consent-link";
import { SupportTipLink } from "@/components/support-tip-link";
import { footerNavLinks } from "@/data/public-navigation";
import { siteConfig } from "@/data/site";

export function PublicSiteFooter() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto w-full max-w-7xl px-6 text-center text-sm text-muted-foreground lg:px-10 xl:px-12">
        <p>
          © {new Date().getFullYear()}{" "}
          <a href={siteConfig.url} className="text-foreground hover:underline">
            {siteConfig.name}
          </a>
          {" · "}
          Free invoice generator for freelancers
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
              {link.label}
            </Link>
          ))}
          <SupportTipLink className="text-primary hover:text-primary" />
          <a
            href={`${siteConfig.url}/sitemap.xml`}
            className="hover:text-foreground hover:underline"
          >
            Sitemap
          </a>
          <a
            href={`${siteConfig.url}/llms.txt`}
            className="hover:text-foreground hover:underline"
          >
            LLMs.txt
          </a>
          <PrivacyConsentLink className="hover:text-foreground" />
        </nav>
      </div>
    </footer>
  );
}
