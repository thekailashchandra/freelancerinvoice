import type { Metadata } from "next";
import { Suspense } from "react";
import { PageFaqSection } from "@/components/page-faq-section";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { getPageFaqs } from "@/data/page-faqs";
import { Skeleton } from "@/components/ui/skeleton";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";
import {
  getGoogleClientId,
  getSupabasePublishableEnv,
  isSupabaseConfigured,
} from "@/lib/supabase/env";
import { LoginForm } from "./login-form";

const title = "Sign In";
const description = `Sign in to ${siteConfig.name} to access your freelancer invoices, PDF exports, and billing history.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/login") },
  robots: { index: true, follow: true },
  ...buildSocialMetadata({ title, description, path: "/login" }),
};

export default function LoginPage() {
  const configured = isSupabaseConfigured();
  const supabaseConfig = configured ? getSupabasePublishableEnv() : null;
  const googleClientId = getGoogleClientId() ?? null;

  return (
    <>
      <PublicBreadcrumbSchema segments={[{ name: "Login", path: "/login" }]} />
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="mx-auto h-12 w-12 rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        }
      >
        <LoginForm
          configured={configured}
          supabaseConfig={supabaseConfig}
          googleClientId={googleClientId}
        />
      </Suspense>
      </div>
      <div className="mx-auto max-w-md px-4 pb-16">
        <PageFaqSection
          faqItems={getPageFaqs("/login")}
          heading="Sign-in FAQ"
        />
      </div>
    </>
  );
}
