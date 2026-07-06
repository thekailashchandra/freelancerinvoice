import crypto from "crypto";
import { getSupabaseSecretEnv } from "@/lib/supabase/env";

function signingSecret(): string {
  const dedicated = process.env.RECEIPT_SIGNING_SECRET?.trim();
  if (dedicated) return dedicated;

  try {
    return getSupabaseSecretEnv().secretKey;
  } catch {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RECEIPT_SIGNING_SECRET or SUPABASE_SECRET_KEY is required.");
    }
    return "local-dev-receipt-signing-key";
  }
}

export function createReceiptToken(invoiceId: string): string {
  return crypto
    .createHmac("sha256", signingSecret())
    .update(`receipt:${invoiceId}`)
    .digest("hex");
}

export function verifyReceiptToken(invoiceId: string, token: string | null): boolean {
  if (!token?.trim()) return false;
  const expected = createReceiptToken(invoiceId);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(token.trim())
    );
  } catch {
    return false;
  }
}
