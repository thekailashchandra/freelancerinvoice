import { SchemaGraph } from "@/components/schema-graph";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

export function PricingSchema() {
  return (
    <SchemaGraph
      nodes={[
        buildOrganizationSchema(),
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([{ name: "Pricing", path: "/pricing" }])
        ),
        buildSoftwareApplicationSchema(),
        {
          "@type": "Product",
          "@id": `${getCanonicalUrl("/pricing")}#product`,
          name: siteConfig.name,
          description: siteConfig.description,
          url: getCanonicalUrl("/pricing"),
          brand: {
            "@type": "Brand",
            name: siteConfig.name,
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: getCanonicalUrl("/signup"),
            description:
              "Free freelancer invoice generator with PDF export and cloud storage",
          },
        },
      ]}
    />
  );
}
