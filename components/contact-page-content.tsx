import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";
import { PageFaqSection } from "@/components/page-faq-section";
import { PublicContactForm } from "@/components/public-contact-form";
import { getPageFaqs } from "@/data/page-faqs";
import { siteConfig } from "@/data/site";

const contactEmail = "invoiceforfreelance@gmail.com";

export function ContactPageContent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Contact</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Questions about {siteConfig.name}, your account, or a feature idea?
          Send us a message and we will respond as soon as we can.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <aside className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <Mail className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="mt-3 font-semibold">Email</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prefer email? Reach us directly at{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-foreground hover:underline"
              >
                {contactEmail}
              </a>
              .
            </p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <MessageSquare className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="mt-3 font-semibold">Existing users</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in? You can also raise requests from your{" "}
              <Link href="/support" className="text-foreground hover:underline">
                in-app support page
              </Link>
              .
            </p>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <PublicContactForm />
        </div>
      </div>

      <PageFaqSection faqItems={getPageFaqs("/contact")} />
    </div>
  );
}
