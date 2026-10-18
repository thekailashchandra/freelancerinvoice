import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";
import { PageFaqSection } from "@/components/page-faq-section";
import { getPageFaqs } from "@/data/page-faqs";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Refund Policy";
const description = `Refund and cancellation policy for the ${siteConfig.name} Cloud plan and voluntary contributions.`;

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
        {siteConfig.name} is open source and free to self-host. The hosted Cloud
        plan is a paid, 30-day access pass. This policy explains refunds for Cloud
        payments and voluntary contributions.
      </p>

      <section>
        <h2 className="text-lg font-semibold">Cloud plan payments</h2>
        <p className="mt-2">
          A Cloud payment grants 30 days of access to PDF export, printing,
          receipts, and every template. Access begins immediately after a verified
          payment. Adding another payment extends access from your current expiry.
        </p>
        <p className="mt-2">
          If you were charged in error, charged twice for the same period, or could
          not access the Cloud features you paid for, contact us within 7 days of
          the charge and we will review a full or partial refund.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Cancellation</h2>
        <p className="mt-2">
          Cloud is not an automatic recurring mandate. There is nothing to cancel
          mid-period: access simply runs to the end of the 30 days you paid for.
          You can stop using Cloud at any time and continue on the free preview
          plan.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Voluntary tips</h2>
        <p className="mt-2">
          Tips through Ko-fi or similar platforms are optional contributions that
          support development and hosting. They are not required to use any
          feature and do not unlock Cloud access.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">How to request a refund</h2>
        <p className="mt-2">
          Email us via the{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact page
          </Link>{" "}
          with your Razorpay payment ID, date, and amount. We aim to respond within
          5–7 business days. Approved refunds are returned to the original payment
          method.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Payment processor</h2>
        <p className="mt-2">
          Cloud payments are processed by Razorpay. Their terms and dispute
          processes may also apply. For platform-specific issues, you may contact
          Razorpay support in addition to reaching out to us.
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
