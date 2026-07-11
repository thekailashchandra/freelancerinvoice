import { WebApplicationSchema } from "@/components/web-application-schema";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildLandingWebPageSchema,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const description = `${siteConfig.name} is free for freelancers. Classic template PDF export and print are $0. Optional one-time unlocks apply to premium templates.`;

export function PricingSchema() {
  return (
    <WebApplicationSchema
      url={getCanonicalUrl("/pricing")}
      description={description}
      nodes={[
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([{ name: "Pricing", path: "/pricing" }])
        ),
        buildLandingWebPageSchema({
          path: "/pricing",
          name: `Pricing | ${siteConfig.name}`,
          description,
        }),
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
            price: "0.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: getCanonicalUrl("/signup"),
            description:
              "Free freelancer invoice generator with Classic template PDF export, print, and cloud storage",
          },
        },
      ]}
    />
  );
}
