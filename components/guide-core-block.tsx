import type { GuideCoreBlock } from "@/data/guides/types";
import { GuideDataTable } from "@/components/guide-data-table";
import { GuideStepList } from "@/components/guide-step-list";

type GuideCoreBlockProps = {
  block: GuideCoreBlock;
};

/** Labeled data table / core steps — second tier of the AI content template. */
export function GuideCoreBlockSection({ block }: GuideCoreBlockProps) {
  return (
    <section
      id={block.id ?? "core-steps"}
      className="ai-content-core scroll-mt-24"
      aria-labelledby={`${block.id ?? "core-steps"}-heading`}
    >
      <h2
        id={`${block.id ?? "core-steps"}-heading`}
        className="text-xl font-semibold tracking-tight md:text-2xl"
      >
        {block.heading}
      </h2>
      {block.table ? <GuideDataTable table={block.table} /> : null}
      {block.steps ? <GuideStepList steps={block.steps} /> : null}
    </section>
  );
}
