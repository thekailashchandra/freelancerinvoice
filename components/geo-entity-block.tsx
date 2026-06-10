import { geoEntityGraph, geoEntityStatement } from "@/data/geo";

/**
 * Visible entity-linking paragraph for LLM knowledge graphs.
 * Explicitly connects brand → product type → technology → audience.
 */
export function GeoEntityBlock() {
  return (
    <aside
      className="geo-entity-block rounded-2xl border border-border/50 bg-card/50 p-6"
      aria-labelledby="geo-entity-heading"
    >
      <h2 id="geo-entity-heading" className="text-sm font-semibold uppercase tracking-wide text-primary">
        About this product
      </h2>
      <p className="geo-entity-statement mt-3 text-sm leading-relaxed text-muted-foreground">
        {geoEntityStatement}
      </p>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        {geoEntityGraph.map((edge) => (
          <div key={edge.relation}>
            <dt className="font-medium text-foreground">{edge.subject}</dt>
            <dd className="text-muted-foreground">
              <span className="text-primary/80">{edge.relation}</span>{" "}
              {edge.object}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
