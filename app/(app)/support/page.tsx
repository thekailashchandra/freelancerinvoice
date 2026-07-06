"use client";

import { PageTransition } from "@/components/page-transition";
import { PageFaqSection } from "@/components/page-faq-section";
import { SupportRequestForm } from "@/components/support-request-form";
import { useTranslation } from "@/components/locale-provider";
import { getPageFaqs } from "@/data/page-faqs";

export default function SupportPage() {
  const { t } = useTranslation();

  return (
    <PageTransition className="mx-auto max-w-2xl space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("support.title")}</h2>
        <p className="text-muted-foreground">{t("support.subtitle")}</p>
      </div>
      <SupportRequestForm source="support-page" />
      <PageFaqSection
        faqItems={getPageFaqs("/support")}
        heading={t("support.faqTitle")}
      />
    </PageTransition>
  );
}
