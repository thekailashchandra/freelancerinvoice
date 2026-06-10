import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";
import { PageFaqSection } from "@/components/page-faq-section";
import { getPageFaqs } from "@/data/page-faqs";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Refund Policy";
const description = `Refund policy for voluntary Ko-fi tips and contributions to ${siteConfig.name}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/refund-policy") },
  ...buildSocialMetadata({ title, description, path: "/refund-policy" }),
};

export default function RefundPolicyPage() {
  return (
    <>
      <PublicBreadcrumbSchema
        segments={[{ name: "Refund Policy", path: "/refund-policy" }]}
      />
      <LegalDocument title="Refund Policy">
      <p>
        {siteConfig.name} is a free invoice generator. This Refund Policy applies
        to voluntary tips and contributions made through Ko-fi or similar
        platforms — not to subscription fees, since the core product is free.
      </p>

      <section>
        <h2 className="text-lg font-semibold">Voluntary tips</h2>
        <p className="mt-2">
          Tips on Ko-fi are optional donations to support development and hosting.
          They are not required to use any feature of {siteConfig.name}. Tips do
          not unlock premium tiers unless explicitly communicated at the time of
          contribution.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Refund eligibility</h2>
        <p className="mt-2">
          Because tips are voluntary gifts, refunds are generally not offered.
          However, we will consider refund requests in these cases:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Duplicate or accidental charges processed through Ko-fi.</li>
          <li>Technical errors that resulted in an unintended payment.</li>
          <li>Fraudulent transactions reported within a reasonable timeframe.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">How to request a refund</h2>
        <p className="mt-2">
          Email us via the{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact page
          </Link>{" "}
          with your Ko-fi transaction details (date, amount, and username). We
          aim to respond within 5–7 business days.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Ko-fi platform</h2>
        <p className="mt-2">
          Payments are processed by Ko-fi. Their terms and dispute processes may
          also apply. For platform-specific issues, you may contact Ko-fi support
          directly in addition to reaching out to us.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Changes</h2>
        <p className="mt-2">
          We may update this policy from time to time. The latest version will
          always be available on this page.
        </p>
      </section>
      </LegalDocument>
      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-8">
        <PageFaqSection faqItems={getPageFaqs("/refund-policy")} />
      </div>
    </>
  );
}
