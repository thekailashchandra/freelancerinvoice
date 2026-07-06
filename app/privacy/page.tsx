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
          <h2 className="text-lg font-semibold">Advertising &amp; cookies</h2>
          <p className="mt-2">
            {siteConfig.name} is free to use. To help cover hosting and ongoing
            development, we may show ads through Google AdSense when you accept
            advertising cookies. We also use Google Analytics to measure anonymous
            traffic and improve the product.
          </p>
          <p className="mt-3">
            <strong>Essential cookies</strong> are always active for sign-in,
            security, and preferences such as your language.{" "}
            <strong>Analytics cookies</strong> help us understand which pages and
            features freelancers use. <strong>Advertising cookies</strong> are
            optional and only enabled if you choose{" "}
            <strong>Accept all cookies</strong>.
          </p>
          <p className="mt-3">
            We do not use cookies to access the invoices, clients, or payment
            details stored in your account. When you first visit, a consent banner
            lets you choose <strong>Essential &amp; analytics</strong> (no
            personalised ads) or <strong>Accept all cookies</strong>. You can
            change your choice anytime via{" "}
            <PrivacyConsentLink className="text-primary" /> in the footer.
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
