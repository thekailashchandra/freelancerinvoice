"use client";

import { geoEntity, geoKeyFacts } from "@/data/geo";
import { useTranslation } from "@/components/locale-provider";

type KeyFactsBlockProps = {
  /** Optional page-specific facts appended after the shared definition list. */
  extraFacts?: { term: string; definition: string }[];
};

/**
 * Canonical Key facts block - render once per page (intended for /about).
 * Entity statement appears a single time; facts use distinct copy per row.
 */
export function KeyFactsBlock({ extraFacts = [] }: KeyFactsBlockProps) {
  const { t } = useTranslation();
  const facts = [...geoKeyFacts, ...extraFacts];

  return (
    <section
      className="geo-key-facts rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8"
      aria-labelledby="key-facts-heading"
    >
      <h2 id="key-facts-heading" className="text-xl font-bold tracking-tight">
        {t("geo.keyFacts")}
      </h2>
      <p className="geo-entity-statement mt-3 text-sm font-medium leading-relaxed text-foreground">
        {geoEntity.entityStatement}
      </p>
      <dl className="mt-6 space-y-5">
        {facts.map((fact) => (
          <div key={fact.term}>
            <dt className="font-semibold text-foreground">{fact.term}</dt>
            <dd className="geo-fact-answer mt-1 text-sm text-muted-foreground leading-relaxed">
              {fact.definition}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
