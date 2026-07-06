import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperadminEmail } from "@/lib/superadmin-emails";

export { getSuperadminEmails, isSuperadminEmail } from "@/lib/superadmin-emails";

export async function profileHasSuperadminRole(
  userId: string
): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return false;
  return data.role === "superadmin";
}

export async function isSuperadminUser(
  user: Pick<User, "id" | "email"> | null | undefined
): Promise<boolean> {
  if (!user?.id) return false;
  if (isSuperadminEmail(user.email)) return true;

  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) return false;
  if (profile.role === "superadmin") return true;
  return isSuperadminEmail(profile.email);
}

export async function requireSuperadmin(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isSuperadminUser(user))) {
    throw new Error("Forbidden");
  }

  return user;
}
