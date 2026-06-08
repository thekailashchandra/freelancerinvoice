import Link from "next/link";
import { PrivacyConsentLink } from "@/components/privacy-consent-link";
import { SupportTipLink } from "@/components/support-tip-link";
import { siteConfig } from "@/data/site";

export function PublicSiteFooter() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground md:px-8">
        <p>
          © {new Date().getFullYear()}{" "}
          <a href={siteConfig.url} className="text-foreground hover:underline">
            {siteConfig.name}
          </a>
          {" · "}
          Free invoice generator for freelancers
        </p>
        <nav
          className="mt-4 flex flex-wrap items-center justify-center gap-4"
          aria-label="Footer"
        >
          <Link href="/guide" className="hover:text-foreground hover:underline">
            Guide
          </Link>
          <Link href="/pricing" className="hover:text-foreground hover:underline">
            Pricing
          </Link>
          <SupportTipLink className="text-primary hover:text-primary" />
          <Link href="/signup" className="hover:text-foreground hover:underline">
            Sign up
          </Link>
          <Link href="/login" className="hover:text-foreground hover:underline">
            Sign in
          </Link>
          <a
            href={`${siteConfig.url}/sitemap.xml`}
            className="hover:text-foreground hover:underline"
          >
            Sitemap
          </a>
          <Link href="/privacy" className="hover:text-foreground hover:underline">
            Privacy
          </Link>
          <PrivacyConsentLink className="hover:text-foreground" />
        </nav>
      </div>
    </footer>
  );
}
