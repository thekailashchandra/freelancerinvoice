import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";
import {
  getGoogleClientId,
  getSupabasePublishableEnv,
  isSupabaseConfigured,
} from "@/lib/supabase/env";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in to ${siteConfig.name} to access your freelancer invoices, PDF exports, and billing history.`,
  alternates: { canonical: getCanonicalUrl("/login") },
  robots: { index: true, follow: true },
};

export default function LoginPage() {
  const configured = isSupabaseConfigured();
  const supabaseConfig = configured ? getSupabasePublishableEnv() : null;
  const googleClientId = getGoogleClientId() ?? null;

  return (
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
  );
}
