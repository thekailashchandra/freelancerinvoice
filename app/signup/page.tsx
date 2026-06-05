import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getGoogleClientId,
  getSupabasePublishableEnv,
  isSupabaseConfigured,
  isSupabaseServerConfigured,
} from "@/lib/supabase/env";
import { getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create Free Account",
  description: `Create a free ${siteConfig.name} account and start generating professional invoices for freelancers with PDF export and cloud storage.`,
  alternates: { canonical: getCanonicalUrl("/signup") },
  robots: { index: true, follow: true },
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignupForm
        configured={configured}
        canSignUp={canSignUp}
        supabaseConfig={supabaseConfig}
        googleClientId={googleClientId}
      />
    </div>
  );
}
