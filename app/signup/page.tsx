import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getGoogleClientId,
  getSupabasePublishableEnv,
  isSupabaseConfigured,
  isSupabaseServerConfigured,
} from "@/lib/supabase/env";
import { PageFaqSection } from "@/components/page-faq-section";
import { WebApplicationSchema } from "@/components/web-application-schema";
import { getPageFaqs } from "@/data/page-faqs";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildLandingWebPageSchema,
} from "@/data/structured-data";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { AuthPageLayout } from "@/components/auth-screen";
import { readConsentCountryFromServerCookies } from "@/lib/consent-country-server";
import { SignupForm } from "./signup-form";

/** Uses cookies() via createClient when Supabase is configured. */
export const dynamic = "force-dynamic";

const title = "Create Free Account";
const description = `Create a free ${siteConfig.name} account and start generating professional invoices for freelancers with PDF export and cloud storage.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/signup") },
  robots: { index: true, follow: true },
  ...buildSocialMetadata({ title, description, path: "/signup" }),
};

export default async function SignupPage() {
  const configured = isSupabaseConfigured();
  const canSignUp = isSupabaseServerConfigured();
  const supabaseConfig = configured ? getSupabasePublishableEnv() : null;
  const googleClientId = getGoogleClientId() ?? null;
  const initialCountryCode = await readConsentCountryFromServerCookies();

  if (configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  }

  return (
    <>
      <WebApplicationSchema
        url={getCanonicalUrl("/signup")}
        description={description}
        nodes={[
          buildBreadcrumbListSchema(
            buildBreadcrumbItems([{ name: "Signup", path: "/signup" }])
          ),
          buildLandingWebPageSchema({
            path: "/signup",
            name: title,
            description,
          }),
        ]}
      />
      <AuthPageLayout>
        <SignupForm
          configured={configured}
          canSignUp={canSignUp}
          supabaseConfig={supabaseConfig}
          googleClientId={googleClientId}
          initialCountryCode={initialCountryCode ?? undefined}
        />
        <PageFaqSection
          faqItems={getPageFaqs("/signup")}
          heading="Signup FAQ"
        />
      </AuthPageLayout>
    </>
  );
}
