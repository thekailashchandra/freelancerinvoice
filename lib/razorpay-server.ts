import crypto from "crypto";
import Razorpay from "razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProfileRow } from "@/types/database";

export type RazorpayCredentials = {
  keyId: string;
  keySecret: string;
};

/** Platform keys for ₹99 template unlocks — set in .env.local / Vercel (server only). */
export function getPlatformRazorpayCredentials(): RazorpayCredentials | null {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

export function isPlatformRazorpayConfigured(): boolean {
  return getPlatformRazorpayCredentials() !== null;
}

export function createRazorpayClient(credentials: RazorpayCredentials): Razorpay {
  return new Razorpay({
    key_id: credentials.keyId,
    key_secret: credentials.keySecret,
  });
}

export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

export function profileHasRazorpay(
  profile: Pick<ProfileRow, "razorpay_key_id" | "razorpay_key_secret">
): boolean {
  return Boolean(
    profile.razorpay_key_id?.trim() && profile.razorpay_key_secret?.trim()
  );
}

export function credentialsFromProfile(
  profile: Pick<ProfileRow, "razorpay_key_id" | "razorpay_key_secret">
): RazorpayCredentials | null {
  const keyId = profile.razorpay_key_id?.trim();
  const keySecret = profile.razorpay_key_secret?.trim();
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

export async function getUserRazorpayCredentials(
  userId: string
): Promise<RazorpayCredentials | null> {
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("razorpay_key_id, razorpay_key_secret")
    .eq("id", userId)
    .single();

  if (profile && profileHasRazorpay(profile as ProfileRow)) {
    return credentialsFromProfile(profile as ProfileRow);
  }

  return null;
}

export async function getInvoiceOwnerRazorpayCredentials(
  invoiceId: string
): Promise<{ userId: string; credentials: RazorpayCredentials } | null> {
  const admin = createAdminClient();
  const { data: invoice } = await admin
    .from("invoices")
    .select("user_id")
    .eq("id", invoiceId)
    .single();

  if (!invoice?.user_id) return null;

  const credentials = await getUserRazorpayCredentials(invoice.user_id);
  if (!credentials) return null;

  return { userId: invoice.user_id, credentials };
}

export function amountToPaise(amount: number): number {
  return Math.max(100, Math.round(amount * 100));
}
