import type { GuideSection } from "@/data/guides/types";
import { GuideDataTable } from "@/components/guide-data-table";
import { GuideStepList } from "@/components/guide-step-list";

type GuideSectionRendererProps = {
  section: GuideSection;
  headingLevel?: "h2" | "h3";
};

export function GuideSectionRenderer({
  section,
  headingLevel = "h2",
}: GuideSectionRendererProps) {
  const Heading = headingLevel;

  return (
    <section
      id={section.id}
      className="ai-content-section scroll-mt-24"
      aria-labelledby={`${section.id}-heading`}
    >
      <Heading
        id={`${section.id}-heading`}
        className={
          headingLevel === "h3"
            ? "text-lg font-semibold tracking-tight md:text-xl"
            : "text-xl font-semibold tracking-tight md:text-2xl"
        }
      >
        {section.heading}
      </Heading>
      {section.paragraphs?.map((paragraph) => (
        <p
          key={paragraph.slice(0, 40)}
          className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line"
        >
          {paragraph}
        </p>
      ))}
      {section.list ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground leading-relaxed">
          {section.list.map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.table ? <GuideDataTable table={section.table} /> : null}
      {section.steps ? <GuideStepList steps={section.steps} /> : null}
      {section.note ? (
        <p className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
          {section.note}
        </p>
      ) : null}
    </section>
  );
}
