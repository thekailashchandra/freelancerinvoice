import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { IndiaMarketHubContent } from "@/components/india-market-hub-content";
import { WebApplicationSchema } from "@/components/web-application-schema";
import { buildPageMetadata, getCanonicalUrl } from "@/data/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { buildLandingWebPageSchema } from "@/data/structured-data";
import { indiaMarketHero } from "@/data/geo-markets";

const LandingInteractiveWorkspace = dynamic(
  () =>
    import("@/components/landing-interactive-workspace").then((m) => ({
      default: m.LandingInteractiveWorkspace,
    })),
  {
    loading: () => (
      <Skeleton className="min-h-[640px] w-full rounded-2xl" aria-hidden />
    ),
  }
);

export const metadata: Metadata = buildPageMetadata({
  title: "India Freelance Invoicing Hub - GST, UPI & Cross-Border Billing",
  description:
    "GST-compliant invoice templates for Indian independent contractors. Compare payout channels, currency conversion fees, and tax withholding for US and EU clients.",
  path: "/india",
  keywords: [
    "GST invoice India freelancer",
    "independent contractor invoice India",
    "India freelance invoicing",
    "UPI invoice generator",
    "cross border payment India freelancer",
  ],
});

export default function IndiaHubPage() {
  return (
    <>
      <WebApplicationSchema
        url={getCanonicalUrl("/india")}
        description={indiaMarketHero.summary}
        nodes={[
          buildLandingWebPageSchema({
            path: "/india",
            name: indiaMarketHero.title,
            description: indiaMarketHero.summary,
          }),
        ]}
      />
      <IndiaMarketHubContent
        workspace={
          <LandingInteractiveWorkspace initialCountryCode="IN" />
        }
      />
    </>
  );
}
