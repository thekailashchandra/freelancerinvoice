import { geoEntityStatement, geoKeyFacts } from "@/data/geo";

type GeoKeyFactsProps = {
  /** Optional page-specific facts appended after global entity facts. */
  extraFacts?: { term: string; definition: string }[];
};

/**
 * Visible definition-list block for generative engine optimization (GEO).
 * Pairs with FAQ schema and speakable selectors for AI Overviews.
 */
export function GeoKeyFacts({ extraFacts = [] }: GeoKeyFactsProps) {
  const facts = [...geoKeyFacts, ...extraFacts];

  return (
    <section
      className="geo-key-facts rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8"
      aria-labelledby="geo-key-facts-heading"
    >
      <h2 id="geo-key-facts-heading" className="text-xl font-bold tracking-tight">
        Key facts
      </h2>
      <p className="geo-entity-statement mt-2 text-sm font-medium leading-relaxed text-foreground">
        {geoEntityStatement}
      </p>
      <p className="geo-page-summary mt-2 text-sm text-muted-foreground leading-relaxed">
        Quick answers for freelancers evaluating a free invoice generator.
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
