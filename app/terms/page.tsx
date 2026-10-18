import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";
import { PageFaqSection } from "@/components/page-faq-section";
import { getPageFaqs } from "@/data/page-faqs";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Terms of Service";
const description = `Terms of service for using ${siteConfig.name}, the free freelancer invoice generator.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/terms") },
  ...buildSocialMetadata({ title, description, path: "/terms" }),
};

export default function TermsPage() {
  return (
    <>
      <PublicBreadcrumbSchema segments={[{ name: "Terms", path: "/terms" }]} />
      <LegalDocument title="Terms of Service">
      <p>
        By accessing or using {siteConfig.name} ({siteConfig.url}), you agree to
        these Terms of Service. If you do not agree, please do not use the
        service.
      </p>

      <section>
        <h2 className="text-lg font-semibold">Service description</h2>
        <p className="mt-2">
          {siteConfig.name} provides an online invoice generator for freelancers
          and independent contractors, including PDF export, cloud storage, and
          related billing tools. We may update, improve, or discontinue features
          at any time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Your account</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>You are responsible for keeping your login credentials secure.</li>
          <li>You must provide accurate account and business information.</li>
          <li>
            You are responsible for the content of invoices you create, including
            accuracy of amounts, taxes, and client details.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Acceptable use</h2>
        <p className="mt-2">You agree not to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Use the service for unlawful, fraudulent, or abusive purposes.</li>
          <li>Attempt to disrupt, reverse engineer, or overload the platform.</li>
          <li>Upload malicious code or infringe third-party rights.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Cloud plan, self-hosting &amp; tips</h2>
        <p className="mt-2">
          Creating and previewing invoices is free. The hosted Cloud plan is a
          paid 30-day access pass for PDF export, printing, receipts, and every
          template. Self-hosted installations are governed by the open-source
          license and may be used without charge. Optional voluntary tips via
          Ko-fi do not constitute a purchase of additional features. See our{" "}
          <Link href="/refund-policy" className="text-primary hover:underline">
            Refund Policy
          </Link>{" "}
          for payment terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Disclaimer</h2>
        <p className="mt-2">
          {siteConfig.name} is provided &quot;as is&quot; without warranties of
          any kind. We do not provide tax, legal, or accounting advice. Invoice
          templates and fields are tools only - you remain responsible for
          compliance with applicable laws in your jurisdiction.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Limitation of liability</h2>
        <p className="mt-2">
          To the fullest extent permitted by law, {siteConfig.name} and its
          operators shall not be liable for indirect, incidental, or consequential
          damages arising from your use of the service, including lost profits or
          data.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Changes</h2>
        <p className="mt-2">
          We may revise these terms from time to time. Continued use of the
          service after changes constitutes acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="mt-2">
          Questions about these terms?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
          .
        </p>
      </section>
      </LegalDocument>
      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-8">
        <PageFaqSection faqItems={getPageFaqs("/terms")} />
      </div>
    </>
  );
}
