import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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

  const profile = await ensureProfile(supabase, user);
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
      <OnboardingForm
        initialEmail={user.email ?? ""}
        initialName={initialName}
      />
    </div>
  );
}
