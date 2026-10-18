import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PublicPageShell } from "@/components/public-page-shell";
import { SubscribePageClient } from "@/components/subscribe-page-client";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { readConsentCountryFromServerCookies } from "@/lib/consent-country-server";
import { resolveMarketFromCountry } from "@/lib/geo-market";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSubscriptionAccess } from "@/lib/subscription-server";
import { fetchBillingHistory } from "@/lib/billing-history";

export const dynamic = "force-dynamic";

const title = "Billing";
const description =
  "Manage your Cloud plan, review payment history, and download receipts.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/subscribe") },
  robots: { index: false, follow: false },
  ...buildSocialMetadata({ title, description, path: "/subscribe" }),
};

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ dodo?: string }>;
}) {
  let userId: string | null = null;
  let userEmail: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login?redirect=/subscribe");
    }

    userId = user.id;
    userEmail = user.email ?? null;
  }

  const [{ dodo }, access, countryCode] = await Promise.all([
    searchParams,
    getSubscriptionAccess(),
    readConsentCountryFromServerCookies(),
  ]);
  const market = resolveMarketFromCountry(countryCode ?? "US");
  let history: Awaited<ReturnType<typeof fetchBillingHistory>> = [];

  if (userId) {
    try {
      history = await fetchBillingHistory(userId, userEmail);
    } catch (error) {
      console.error(
        "Could not load billing history",
        error instanceof Error ? error.message : error
      );
    }
  }

  return (
    <PublicPageShell>
      <SubscribePageClient
        access={access}
        market={market}
        history={history}
        dodoStatus={dodo === "success" || dodo === "cancelled" ? dodo : null}
      />
    </PublicPageShell>
  );
}
