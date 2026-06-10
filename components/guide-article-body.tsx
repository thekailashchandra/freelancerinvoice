import type { GuideArticle } from "@/data/guides/types";
import { GuideCoreBlockSection } from "@/components/guide-core-block";
import { GuideSectionRenderer } from "@/components/guide-section-renderer";

type GuideArticleBodyProps = {
  article: Pick<
    GuideArticle,
    "sections" | "coreBlock" | "architectureHeading"
  >;
};

const DEFAULT_ARCHITECTURE_HEADING = "Contextual architecture";

/**
 * Renders long-form guide body using the AI-friendly content hierarchy:
 * core table/steps block, then contextual elaboration sections.
 */
export function GuideArticleBody({ article }: GuideArticleBodyProps) {
  const usesTemplate = Boolean(article.coreBlock);
  const architectureHeading =
    article.architectureHeading ?? DEFAULT_ARCHITECTURE_HEADING;

  return (
    <>
      {article.coreBlock ? (
        <div className="mt-10">
          <GuideCoreBlockSection block={article.coreBlock} />
        </div>
      ) : null}

      <div className={usesTemplate ? "mt-12" : "mt-10 space-y-10"}>
        {usesTemplate ? (
          <h2
            id="contextual-architecture"
            className="text-xl font-semibold tracking-tight md:text-2xl"
          >
            {architectureHeading}
          </h2>
        ) : null}

        <div className={usesTemplate ? "mt-6 space-y-8" : "space-y-10"}>
          {article.sections.map((section) => (
            <GuideSectionRenderer
              key={section.id}
              section={section}
              headingLevel={usesTemplate ? "h3" : "h2"}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/** Table-of-contents entries for guide articles (core block + sections). */
export function getGuideArticleTocItems(
  article: Pick<GuideArticle, "sections" | "coreBlock" | "architectureHeading">
): { id: string; label: string }[] {
  const items: { id: string; label: string }[] = [];

  if (article.coreBlock) {
    items.push({
      id: article.coreBlock.id ?? "core-steps",
      label: article.coreBlock.heading,
    });
    items.push({
      id: "contextual-architecture",
      label: article.architectureHeading ?? DEFAULT_ARCHITECTURE_HEADING,
    });
  }

  for (const section of article.sections) {
    items.push({ id: section.id, label: section.heading });
  }

  return items;
}
