import { WebApplicationSchema } from "@/components/web-application-schema";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildLandingWebPageSchema,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const description = `${siteConfig.name} is free to self-host. The hosted Cloud plan is ₹299/month or ₹999/year in India, and $5/month or $19/year elsewhere. It unlocks PDF export, printing, brand colors, and every template.`;

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
          offers: [
            {
              "@type": "Offer",
              price: "5.00",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: getCanonicalUrl("/subscribe"),
              description:
                "Cloud plan: ₹299/month or ₹999/year in India, and $5/month or $19/year elsewhere. PDF download, print, brand colors, and every template.",
            },
            {
              "@type": "Offer",
              price: "0.00",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: siteConfig.githubUrl || getCanonicalUrl("/self-host"),
              description:
                "Self-hosted open-source edition with every feature unlocked.",
            },
          ],
        },
      ]}
    />
  );
}
