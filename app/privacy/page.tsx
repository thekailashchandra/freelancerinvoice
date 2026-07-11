import type { Metadata } from "next";
import Link from "next/link";
import { PageFaqSection } from "@/components/page-faq-section";
import { PrivacyConsentLink } from "@/components/privacy-consent-link";
import { getPageFaqs } from "@/data/page-faqs";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { DataProtectionLawReference } from "@/components/data-protection-law-reference";
import { PRIVACY_POLICY_VERSION, privacyContactEmail } from "@/data/privacy-policy";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Privacy Policy";
const description = `How ${siteConfig.name} collects, uses, and protects your data — including regional data-protection laws, cookies, and your privacy rights.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/privacy") },
  ...buildSocialMetadata({ title, description, path: "/privacy" }),
};

const lastUpdated = "11 July 2026";

export default function PrivacyPage() {
  return (
    <>
      <PublicBreadcrumbSchema
        segments={[{ name: "Privacy Policy", path: "/privacy" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {lastUpdated} · Version {PRIVACY_POLICY_VERSION}
        </p>

        <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-sm leading-relaxed dark:prose-invert">
          <p>
            {siteConfig.name} ({siteConfig.url}) respects your privacy. This
            policy explains how we collect, use, store, and protect personal
            data when you use our invoice generator and related services.
          </p>

          <section>
            <h2 className="text-lg font-semibold">Information we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Account details you provide (email, business name, invoice and
                client data).
              </li>
              <li>Usage data needed to operate, secure, and improve the service.</li>
              <li>
                Cookies and similar technologies for analytics and advertising,
                where you have consented (EEA, UK, Switzerland) or as permitted
                by applicable law.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Consent at signup and login</h2>
            <p className="mt-2">
              Every new registrant must explicitly accept this Privacy Policy
              before an account is created. Existing users must accept again
              when we materially update this policy. The consent checkbox is
              tailored to the data-protection laws that apply in your country
              (detected from your locale or country preference). We record the
              date and policy version of your acceptance in your profile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">
              India — Digital Personal Data Protection Act, 2023 (DPDP Act)
            </h2>
            <p className="mt-2">
              If you are located in India, or if Indian law applies to your use of
              this service, the following additional notices apply under the
              Digital Personal Data Protection Act, 2023 and rules framed
              thereunder.
            </p>
            <h3 className="mt-4 text-base font-semibold">Data fiduciary</h3>
            <p className="mt-2">
              {siteConfig.name} acts as a <strong>Data Fiduciary</strong> with
              respect to personal data you provide when creating an account,
              storing invoices, uploading logos or signatures, and using billing
              features on {siteConfig.url}.
            </p>
            <h3 className="mt-4 text-base font-semibold">
              Personal data we process
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Identity and contact data (name, email, phone, address).</li>
              <li>
                Business and billing data (company details, client records,
                invoice line items, payment identifiers you choose to store).
              </li>
              <li>
                Account security data (authentication events, session
                information).
              </li>
              <li>
                Optional files you upload (logo, signature) stored in your
                private account folder.
              </li>
            </ul>
            <h3 className="mt-4 text-base font-semibold">
              Purpose and lawful basis
            </h3>
            <p className="mt-2">
              We process personal data to provide the invoicing service you
              request, maintain your account, generate PDFs, sync your invoice
              history, process optional payments, prevent abuse, and comply with
              legal obligations. For users in India, we rely on your{" "}
              <strong>consent</strong> at registration (and when required for
              optional cookies or marketing analytics) and on processing that is
              necessary to perform the service you signed up for.
            </p>
            <h3 className="mt-4 text-base font-semibold">Your rights as a Data Principal</h3>
            <p className="mt-2">
              Subject to the DPDP Act and applicable exceptions, you may have the
              right to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Access personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>
                Request erasure when consent is withdrawn or processing is no
                longer necessary, subject to legal retention requirements.
              </li>
              <li>
                Withdraw consent for processing that is consent-based (for
                example optional analytics or advertising cookies).
              </li>
              <li>
                Nominate another individual to exercise your rights in the event
                of death or incapacity, as permitted by law.
              </li>
              <li>
                Raise a grievance with us and, if unresolved, with the Data
                Protection Board of India when operational.
              </li>
            </ul>
            <h3 className="mt-4 text-base font-semibold">Consent at signup</h3>
            <p className="mt-2">
              Users in India see the DPDP Act notice in the signup and login
              consent checkbox. We record the date and policy version of your
              acceptance in your profile.
            </p>
            <h3 className="mt-4 text-base font-semibold">
              Data retention and security
            </h3>
            <p className="mt-2">
              We retain account and invoice data while your account is active
              and for a reasonable period afterward where required for backups,
              disputes, or legal compliance. Data is hosted with Supabase using
              account-level isolation and row-level security so only you can
              access your invoices and clients.
            </p>
            <h3 className="mt-4 text-base font-semibold">
              Cross-border processing
            </h3>
            <p className="mt-2">
              Our infrastructure providers may process data in regions outside
              India. Where required, we take steps consistent with applicable
              cross-border transfer requirements under Indian law.
            </p>
            <h3 className="mt-4 text-base font-semibold">
              Children&apos;s data
            </h3>
            <p className="mt-2">
              {siteConfig.name} is not directed at children under 18. We do not
              knowingly collect personal data from children without verifiable
              parental consent as required by law.
            </p>
            <h3 className="mt-4 text-base font-semibold">
              Grievance / contact officer
            </h3>
            <p className="mt-2">
              For DPDP-related requests, corrections, erasure, or complaints,
              contact us at{" "}
              <a
                href={`mailto:${privacyContactEmail}`}
                className="text-primary hover:underline"
              >
                {privacyContactEmail}
              </a>{" "}
              or via our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact page
              </Link>
              . We aim to respond within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">
              European Union / EEA — GDPR
            </h2>
            <p className="mt-2">
              If you are in the EU or EEA, we process personal data under the
              General Data Protection Regulation (GDPR). You have rights to
              access, rectification, erasure, restriction, portability, and
              objection. You may lodge a complaint with your local supervisory
              authority. Analytics and advertising cookies are used only with
              your consent via our cookie banner.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">United Kingdom — UK GDPR</h2>
            <p className="mt-2">
              UK users are covered by the UK GDPR and Data Protection Act 2018,
              with equivalent rights to EU users. Contact us or the ICO for
              unresolved complaints.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">
              Americas, Asia-Pacific &amp; other regions
            </h2>
            <p className="mt-2">
              We apply region-specific notices at signup and login for users in
              jurisdictions with comprehensive data-protection laws — including
              Brazil (LGPD), Canada (PIPEDA), the United States (applicable
              state privacy laws such as CCPA/CPRA), Australia, Japan, South
              Korea, Singapore, and others listed in the reference table below.
            </p>
          </section>

          <DataProtectionLawReference />

          <section>
            <h2 className="text-lg font-semibold">Advertising &amp; cookies</h2>
            <p className="mt-2">
              {siteConfig.name} is free to use. To help cover hosting and ongoing
              development, we may show ads through Google AdSense when you accept
              advertising cookies. We also use Google Analytics to measure
              anonymous traffic and improve the product.
            </p>
            <p className="mt-3">
              <strong>Essential cookies</strong> are always active for sign-in,
              security, and preferences such as your language.{" "}
              <strong>Analytics cookies</strong> help us understand which pages
              and features freelancers use. <strong>Advertising cookies</strong>{" "}
              are optional and only enabled if you choose{" "}
              <strong>Accept all cookies</strong>.
            </p>
            <p className="mt-3">
              We do not use cookies to access the invoices, clients, or payment
              details stored in your account. When you first visit, a consent
              banner lets you choose <strong>Essential &amp; analytics</strong>{" "}
              (no personalised ads) or <strong>Accept all cookies</strong>. You
              can change your choice anytime via <PrivacyConsentLink /> in the
              footer.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Your rights (all regions)</h2>
            <p className="mt-2">
              Depending on your location, you may have rights to access, correct,
              delete, or restrict processing of your personal data. Contact us
              via the{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact page
              </Link>{" "}
              for requests.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Contact</h2>
            <p className="mt-2">
              Questions about this policy? Email{" "}
              <a
                href={`mailto:${privacyContactEmail}`}
                className="text-primary hover:underline"
              >
                {privacyContactEmail}
              </a>{" "}
              or visit{" "}
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
