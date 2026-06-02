import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing-page";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";

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

  return <LandingPage />;
}
