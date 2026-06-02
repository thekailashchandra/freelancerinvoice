import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  isSupabaseConfigured,
  isSupabaseServerConfigured,
} from "@/lib/supabase/env";
import { SignupForm } from "./signup-form";

export default async function SignupPage() {
  const configured = isSupabaseConfigured();
  const canSignUp = isSupabaseServerConfigured();

  if (configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignupForm configured={configured} canSignUp={canSignUp} />
    </div>
  );
}
