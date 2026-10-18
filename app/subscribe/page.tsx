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

export const dynamic = "force-dynamic";

const title = "Cloud plan";
const description =
  "Unlock PDF downloads, printing, brand colors, and every template on the hosted Cloud plan. ₹299/month or ₹999/year in India, and $5/month or $19/year elsewhere. Self-host for free.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/subscribe") },
  robots: { index: false, follow: false },
  ...buildSocialMetadata({ title, description, path: "/subscribe" }),
};

export default async function SubscribePage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login?redirect=/subscribe");
    }
  }

  const [access, countryCode] = await Promise.all([
    getSubscriptionAccess(),
    readConsentCountryFromServerCookies(),
  ]);
  const market = resolveMarketFromCountry(countryCode ?? "US");

  return (
    <PublicPageShell>
      <SubscribePageClient access={access} market={market} />
    </PublicPageShell>
  );
}
