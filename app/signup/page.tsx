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
import { SchemaGraph } from "@/components/schema-graph";
import { getPageFaqs } from "@/data/page-faqs";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
} from "@/data/structured-data";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { SignupForm } from "./signup-form";

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

  if (configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  }

  return (
    <>
      <SchemaGraph
        nodes={[
          buildOrganizationSchema(),
          buildBreadcrumbListSchema(
            buildBreadcrumbItems([{ name: "Signup", path: "/signup" }])
          ),
          buildSoftwareApplicationSchema(),
        ]}
      />
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <SignupForm
        configured={configured}
        canSignUp={canSignUp}
        supabaseConfig={supabaseConfig}
        googleClientId={googleClientId}
        />
      </div>
      <div className="mx-auto max-w-md px-4 pb-16">
        <PageFaqSection
          faqItems={getPageFaqs("/signup")}
          heading="Signup FAQ"
        />
      </div>
    </>
  );
}
