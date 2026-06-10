import type { Metadata } from "next";
import Link from "next/link";
import { PageFaqSection } from "@/components/page-faq-section";
import { PrivacyConsentLink } from "@/components/privacy-consent-link";
import { getPageFaqs } from "@/data/page-faqs";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Privacy Policy";
const description = `How ${siteConfig.name} collects, uses, and protects your data — including cookies, advertising consent, and your privacy rights.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/privacy") },
  ...buildSocialMetadata({ title, description, path: "/privacy" }),
};

export default function PrivacyPage() {
  return (
    <>
      <PublicBreadcrumbSchema
        segments={[{ name: "Privacy Policy", path: "/privacy" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-sm leading-relaxed dark:prose-invert">
        <p>
          {siteConfig.name} ({siteConfig.url}) respects your privacy. This policy
          explains how we collect, use, and protect information when you use our
          invoice generator and related services.
        </p>

        <section>
          <h2 className="text-lg font-semibold">Information we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Account details you provide (email, business name, invoice data).</li>
            <li>Usage data needed to operate and secure the service.</li>
            <li>
              Cookies and similar technologies for advertising, where you have
              consented (EEA, UK, Switzerland) or as permitted by law.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Advertising & cookies</h2>
          <p className="mt-2">
            We use Google AdSense to display ads. In the European Economic Area,
            the United Kingdom, and Switzerland, we use Google&apos;s certified
            consent management platform to ask for your consent before personalized
            advertising cookies are used. You can change your choices at any time.
          </p>
          <p className="mt-2">
            <PrivacyConsentLink className="text-primary" />
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Your rights</h2>
          <p className="mt-2">
            Depending on your location, you may have rights to access, correct,
            delete, or restrict processing of your personal data. Contact us via
            the{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact page
            </Link>{" "}
            for requests.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-2">
            Questions about this policy? Visit{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact
            </Link>
            .
          </p>
        </section>
      </div>

      <PageFaqSection faqItems={getPageFaqs("/privacy")} />
      </div>
    </>
  );
}
