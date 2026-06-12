import type { TemplateFaqItem } from "@/data/template-pages/types";
import { SchemaGraph } from "@/components/schema-graph";
import { buildFaqPageSchemaFromItems } from "@/data/structured-data";

type PageFaqSectionProps = {
  faqItems: TemplateFaqItem[];
  heading?: string;
  /** When true, emits FAQPage JSON-LD (default true). */
  includeSchema?: boolean;
};

export function PageFaqSection({
  faqItems,
  heading = "Frequently asked questions",
  includeSchema = true,
}: PageFaqSectionProps) {
  if (faqItems.length === 0) return null;

  return (
    <>
      {includeSchema && (
        <SchemaGraph nodes={[buildFaqPageSchemaFromItems(faqItems)]} />
      )}
      <section aria-labelledby="page-faq-heading">
        <h2 id="page-faq-heading" className="text-2xl font-bold tracking-tight">
          {heading}
        </h2>
        <div className="mt-6 space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="rounded-xl border border-border/50 bg-card/50 p-5"
            >
              <summary className="cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="faq-answer mt-3 text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
