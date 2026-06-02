"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { formatAuthError } from "@/lib/supabase/auth-errors";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { isNextRedirect } from "@/lib/auth-redirect";

export type AuthActionResult =
  | { ok: true; redirect?: string }
  | { ok: false; error: string };

export type AuthFormState = { error: string } | null;

async function signUpWithCredentials(
  email: string,
  password: string
): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured in .env.local" };
  }

  if (!process.env.SUPABASE_SECRET_KEY?.trim()) {
    return {
      ok: false,
      error:
        "Missing SUPABASE_SECRET_KEY in .env.local (required for sign up).",
    };
  }

  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const admin = createAdminClient();

  const { error: createError } = await admin.auth.admin.createUser({
    email: trimmedEmail,
    password,
    email_confirm: true,
  });

  if (createError) {
    return { ok: false, error: formatAuthError(createError) };
  }

  const supabase = await createClient();
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (signInError) {
    return {
      ok: false,
      error:
        "Account was created. Please sign in with your email and password.",
    };
  }

  if (data.user) {
    await ensureProfile(supabase, data.user);
  }

  revalidatePath("/", "layout");
  return { ok: true, redirect: "/onboarding" };
}

/** Form action for /signup — uses native POST (no client-side action RPC). */
export async function signUpFormAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  try {
    const result = await signUpWithCredentials(
      String(formData.get("email") ?? ""),
      String(formData.get("password") ?? "")
    );

    if (!result.ok) {
      return { error: result.error };
    }

    redirect(result.redirect ?? "/onboarding");
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    return { error: formatAuthError(err) };
  }
}

export async function signUpAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  try {
    const result = await signUpWithCredentials(email, password);
    if (result.ok) {
      redirect(result.redirect ?? "/onboarding");
    }
    return result;
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    return { ok: false, error: formatAuthError(err) };
  }
}

async function signInWithCredentials(
  email: string,
  password: string
): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured in .env.local" };
  }

  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error) {
    return { ok: false, error: formatAuthError(error) };
  }

  let redirectTo = "/dashboard";
  if (data.user) {
    const profile = await ensureProfile(supabase, data.user);
    if (!profile?.company_name) redirectTo = "/onboarding";
  }

  revalidatePath("/", "layout");
  return { ok: true, redirect: redirectTo };
}

export async function signInFormAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  try {
    const result = await signInWithCredentials(
      String(formData.get("email") ?? ""),
      String(formData.get("password") ?? "")
    );

    if (!result.ok) {
      return { error: result.error };
    }

    const next =
      String(formData.get("redirect") ?? "").trim() ||
      result.redirect ||
      "/dashboard";

    redirect(next.startsWith("/") ? next : "/dashboard");
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    return { error: formatAuthError(err) };
  }
}

export async function signInAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  try {
    return await signInWithCredentials(email, password);
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    return { ok: false, error: formatAuthError(err) };
  }
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
