import { redirect } from "next/navigation";
import { getTopicalPillar } from "@/data/topical-pillars";

/** Legacy cluster URLs → topical authority pillar hubs. */
const legacyClusterToPillar: Record<string, string> = {
  "invoicing-basics": "invoicing-billing",
  "tax-compliance": "tax-compliance-currency",
  "international-billing": "tax-compliance-currency",
  "india-billing": "tax-compliance-currency",
};

type LegacyClusterProps = {
  params: Promise<{ cluster: string }>;
};

export default async function LegacyBlogClusterPage({
  params,
}: LegacyClusterProps) {
  const { cluster } = await params;
  const pillarSlug = legacyClusterToPillar[cluster] ?? cluster;

  if (getTopicalPillar(pillarSlug)) {
    redirect(`/blog/pillar/${pillarSlug}`);
  }

  redirect("/freelance-finances");
}
