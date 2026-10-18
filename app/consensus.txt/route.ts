import { geoConsensus, geoEntityStatement } from "@/data/geo";

/** Machine-readable consensus block for directories, LLM crawlers, and profile copy-paste. */
export function GET() {
  const body = [
    "# Consensus block - Invoice for Freelance",
    "# Copy verbatim to Product Hunt, Crunchbase, LinkedIn, and portfolio bios.",
    "",
    `Brand: ${geoConsensus.brandName}`,
    `URL: ${geoConsensus.canonicalUrl}`,
    `Category: ${geoConsensus.productCategory}`,
    `Pricing: ${geoConsensus.pricingStatement}`,
    "",
    "## Entity statement",
    geoEntityStatement,
    "",
    "## One-liner citation",
    geoConsensus.citationOneLiner,
    "",
    "## Directory bio",
    geoConsensus.directoryBio,
    "",
    "## Features",
    ...geoConsensus.featureBullets.map((item) => `- ${item}`),
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
