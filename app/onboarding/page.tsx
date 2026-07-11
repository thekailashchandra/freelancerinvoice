import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";
import { PolicyUpdateGate } from "@/components/policy-update-gate";
import { privateAppRobots } from "@/data/seo";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Onboarding",
  robots: privateAppRobots,
};

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await ensureProfile(supabase, user);

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_name")
    .eq("id", user.id)
    .single();

  if (profile?.company_name) {
    redirect("/dashboard");
  }

  const initialName =
    (typeof user.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
    "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <PolicyUpdateGate />
      <OnboardingForm
        initialEmail={user.email ?? ""}
        initialName={initialName}
      />
    </div>
  );
}
