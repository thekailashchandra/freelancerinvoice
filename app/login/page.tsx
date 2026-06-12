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
import { AuthPageLayout } from "@/components/auth-screen";
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
      <Suspense
        fallback={
          <AuthPageLayout>
            <Skeleton className="h-[480px] w-full rounded-xl" />
          </AuthPageLayout>
        }
      >
        <AuthPageLayout>
          <LoginForm
            configured={configured}
            supabaseConfig={supabaseConfig}
            googleClientId={googleClientId}
          />
          <PageFaqSection
            faqItems={getPageFaqs("/login")}
            heading="Sign-in FAQ"
          />
        </AuthPageLayout>
      </Suspense>
    </>
  );
}
