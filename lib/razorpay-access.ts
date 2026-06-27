import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRazorpayEnabled } from "@/lib/razorpay-feature";
import {
  isPlatformRazorpayConfigured,
  profileHasRazorpay,
} from "@/lib/razorpay-server";
import type { ProfileRow } from "@/types/database";

/** Comma-separated in RAZORPAY_OWNER_EMAIL or RAZORPAY_OWNER_EMAILS (server only). */
export function getRazorpayOwnerEmails(): string[] {
  const raw =
    process.env.RAZORPAY_OWNER_EMAIL?.trim() ||
    process.env.RAZORPAY_OWNER_EMAILS?.trim();
  if (!raw) return [];
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isRazorpayOwnerEmail(
  email: string | null | undefined
): boolean {
  if (!email?.trim()) return false;
  return getRazorpayOwnerEmails().includes(email.trim().toLowerCase());
}

export function isRazorpayUserFacingEnabled(
  email: string | null | undefined
): boolean {
  return isRazorpayEnabled() && isRazorpayOwnerEmail(email);
}

export async function getAuthenticatedRazorpayAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? null;
  const isOwner = isRazorpayOwnerEmail(email);
  const platformReady =
    isRazorpayEnabled() && isPlatformRazorpayConfigured();

  let invoiceCheckout = false;
  if (isOwner && user && isRazorpayEnabled()) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("razorpay_key_id, razorpay_key_secret")
      .eq("id", user.id)
      .single();
    invoiceCheckout = profileHasRazorpay(profile as ProfileRow);
  }

  return {
    user,
    email,
    isOwner,
    platformReady,
    templateCheckout: platformReady && isOwner,
    invoiceCheckout,
    userFacing: isOwner && isRazorpayEnabled(),
  };
}

export async function isRazorpayOwnerUserId(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user) return false;
  return isRazorpayOwnerEmail(data.user.email);
}
