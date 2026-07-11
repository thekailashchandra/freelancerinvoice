import { PRIVACY_POLICY_VERSION } from "@/data/privacy-policy";
import { TERMS_VERSION } from "@/data/terms-of-service";

export type AuthApiResult =
  | { ok: true; redirect: string }
  | {
      ok: false;
      error: string;
      rateLimited?: boolean;
      retryAfterSec?: number;
    };

async function parseAuthResponse(res: Response): Promise<AuthApiResult> {
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    redirect?: string;
  };

  if (res.status === 429) {
    const retryAfterHeader = Number(res.headers.get("Retry-After") ?? "");
    const resetHeader = Number(res.headers.get("X-RateLimit-Reset") ?? "");
    let retryAfterSec = Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
      ? retryAfterHeader
      : 0;

    if (!retryAfterSec && Number.isFinite(resetHeader) && resetHeader > 0) {
      retryAfterSec = Math.max(1, Math.ceil((resetHeader - Date.now()) / 1000));
    }

    if (!retryAfterSec) retryAfterSec = 60;

    return {
      ok: false,
      error:
        data.error ?? "Too many requests. Please try again later.",
      rateLimited: true,
      retryAfterSec,
    };
  }

  if (data.ok === true && data.redirect) {
    return { ok: true, redirect: data.redirect };
  }

  return {
    ok: false,
    error: data.error ?? "Authentication failed. Please try again.",
  };
}

export async function signUpClient(
  email: string,
  password: string,
  legalAccepted: boolean
): Promise<AuthApiResult> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      privacyPolicyAccepted: legalAccepted,
      termsAccepted: legalAccepted,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      termsVersion: TERMS_VERSION,
    }),
  });

  return parseAuthResponse(res);
}

export async function signInClient(
  email: string,
  password: string,
  legalAccepted: boolean
): Promise<AuthApiResult> {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      privacyPolicyAccepted: legalAccepted,
      termsAccepted: legalAccepted,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      termsVersion: TERMS_VERSION,
    }),
  });

  return parseAuthResponse(res);
}

export function markEnteringApp() {
  document.cookie = "iff_entering=1; path=/; max-age=20; samesite=lax";
}
