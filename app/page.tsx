import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing-page";
import { StructuredData } from "@/components/structured-data";
import { buildKeywordsString, getCanonicalUrl, homeSeo } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";

export const metadata: Metadata = {
  title: homeSeo.title,
  description: homeSeo.description,
  keywords: buildKeywordsString(),
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: {
    title: homeSeo.ogTitle,
    description: homeSeo.ogDescription,
    url: siteConfig.url,
    type: "website",
  },
};

export default async function HomePage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const profile = await ensureProfile(supabase, user);
      if (!profile?.company_name) {
        redirect("/onboarding");
      }
      redirect("/dashboard");
    }
  }

  return (
    <>
      <StructuredData includeFaq />
      <LandingPage />
    </>
  );
}
