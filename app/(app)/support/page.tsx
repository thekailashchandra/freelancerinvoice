import { PageTransition } from "@/components/page-transition";
import { PageFaqSection } from "@/components/page-faq-section";
import { SupportRequestForm } from "@/components/support-request-form";
import { getPageFaqs } from "@/data/page-faqs";

export default function SupportPage() {
  return (
    <PageTransition className="mx-auto max-w-2xl space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Support</h2>
        <p className="text-muted-foreground">
          Share your request and it will be sent to our support email.
        </p>
      </div>
      <SupportRequestForm source="support-page" />
      <PageFaqSection
        faqItems={getPageFaqs("/support")}
        heading="Common questions"
      />
    </PageTransition>
  );
}
