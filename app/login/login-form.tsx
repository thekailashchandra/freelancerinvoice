"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { markEnteringApp, signInClient } from "@/lib/api/auth-client";
import { safeAppRedirect } from "@/lib/safe-redirect";
import type { SupabaseBrowserConfig } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { PrivacyPolicyConsentField } from "@/components/privacy-policy-consent-field";
import { markLocalPrivacyConsentAck } from "@/lib/privacy-consent";
import { useConsentCountry } from "@/hooks/use-consent-country";
import {
  formatRateLimitMessage,
  useAuthRateLimit,
} from "@/hooks/use-auth-rate-limit";

const GoogleSignInButton = dynamic(
  () =>
    import("@/components/google-sign-in-button").then((m) => ({
      default: m.GoogleSignInButton,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-11 w-full rounded-lg" />,
  }
);
import {
  AuthAlert,
  AuthDivider,
  AuthFooterLinks,
  AuthScreen,
} from "@/components/auth-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton({
  disabled,
  pending,
  rateLimited,
  retryAfterSec,
}: {
  disabled: boolean;
  pending: boolean;
  rateLimited: boolean;
  retryAfterSec: number;
}) {
  return (
    <Button
      type="submit"
      className="h-10 w-full rounded-lg font-medium shadow-none"
      disabled={disabled || pending || rateLimited}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in…
        </>
      ) : rateLimited ? (
        `Try again in ${retryAfterSec}s`
      ) : (
        "Sign in"
      )}
    </Button>
  );
}

const authFieldClass =
  "h-10 rounded-lg border-0 bg-muted/50 px-3.5 shadow-none ring-1 ring-border/50 transition-shadow placeholder:text-muted-foreground/70 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring/80";

type LoginFormProps = {
  configured: boolean;
  supabaseConfig: SupabaseBrowserConfig | null;
  googleClientId: string | null;
  initialCountryCode?: string;
};

export function LoginForm({
  configured,
  supabaseConfig,
  googleClientId,
  initialCountryCode,
}: LoginFormProps) {
  const searchParams = useSearchParams();
  const redirectParam = safeAppRedirect(searchParams.get("redirect"), "/dashboard");
  const authError = searchParams.get("error");

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [consentRequired, setConsentRequired] = useState(true);
  const [checkingConsent, setCheckingConsent] = useState(false);
  const consentCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const consentCountry = useConsentCountry(initialCountryCode);
  const {
    isBlocked: isRateLimited,
    retryAfterSec,
    applyCooldown,
    message: rateLimitMessage,
  } = useAuthRateLimit();

  const isRateLimitError = (message: string) => /too many/i.test(message);

  const checkConsentRequired = useCallback(async (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) {
      setConsentRequired(true);
      return;
    }

    setCheckingConsent(true);
    try {
      const res = await fetch("/api/auth/privacy-consent-required", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json()) as { ok?: boolean; required?: boolean };
      if (data.ok) {
        setConsentRequired(data.required !== false);
        if (data.required === false) {
          setPrivacyConsent(false);
        }
      }
    } catch {
      setConsentRequired(true);
    } finally {
      setCheckingConsent(false);
    }
  }, []);

  const scheduleConsentCheck = useCallback(
    (email: string) => {
      if (consentCheckTimer.current) {
        clearTimeout(consentCheckTimer.current);
      }
      consentCheckTimer.current = setTimeout(() => {
        void checkConsentRequired(email);
      }, 400);
    },
    [checkConsentRequired]
  );

  useEffect(() => {
    return () => {
      if (consentCheckTimer.current) {
        clearTimeout(consentCheckTimer.current);
      }
    };
  }, []);

  const submitDisabled =
    !configured ||
    (consentRequired && !privacyConsent) ||
    checkingConsent ||
    isRateLimited;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !configured ||
      (consentRequired && !privacyConsent) ||
      isRateLimited
    ) {
      return;
    }

    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const password = String(new FormData(form).get("password") ?? "");

    setIsPending(true);
    setError(null);

    try {
      const result = await signInClient(
        email,
        password,
        consentRequired ? privacyConsent : true
      );

      if (!result.ok) {
        if (result.rateLimited && result.retryAfterSec) {
          applyCooldown(result.retryAfterSec);
          toast.error("Sign in paused", {
            description: formatRateLimitMessage(result.retryAfterSec),
          });
          return;
        }

        if (isRateLimitError(result.error)) {
          applyCooldown(5 * 60);
          toast.error("Sign in paused", { description: result.error });
          return;
        }

        setError(result.error);
        toast.error("Sign in failed", { description: result.error });
        return;
      }

      if (consentRequired && privacyConsent) {
        markLocalPrivacyConsentAck();
      }

      const next = safeAppRedirect(redirectParam, result.redirect);
      markEnteringApp();
      window.location.href = next;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not sign in.";
      setError(message);
      toast.error("Sign in failed", { description: message });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthScreen
      compact
      title="Welcome back"
      description="Sign in to your account"
      loading={isPending}
      loadingMessage="Taking you to your dashboard…"
      footer={
        <AuthFooterLinks
          primary={{ href: "/", label: "Back to home" }}
          secondary={{ href: "/signup", label: "Create account" }}
        />
      }
    >
      {authError && (
        <AuthAlert>Authentication failed. Please try again.</AuthAlert>
      )}
      {!configured && (
        <AuthAlert variant="info">
          Copy <code className="text-xs">.env.example</code> to{" "}
          <code className="text-xs">.env.local</code> and set your Supabase keys.
        </AuthAlert>
      )}
      {rateLimitMessage ? (
        <AuthAlert>{rateLimitMessage}</AuthAlert>
      ) : error ? (
        <AuthAlert>{error}</AuthAlert>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            className={authFieldClass}
            onChange={(event) => scheduleConsentCheck(event.target.value)}
            onBlur={(event) => void checkConsentRequired(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-muted-foreground"
          >
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className={authFieldClass}
          />
        </div>

        {consentRequired ? (
          <PrivacyPolicyConsentField
            compact
            checked={privacyConsent}
            onCheckedChange={setPrivacyConsent}
            id="login-privacy-consent"
            initialCountryCode={initialCountryCode}
          />
        ) : null}

        <SubmitButton
          disabled={submitDisabled}
          pending={isPending}
          rateLimited={isRateLimited}
          retryAfterSec={retryAfterSec}
        />
      </form>

      <AuthDivider label="or" />

      <GoogleSignInButton
        disabled={!configured || isRateLimited}
        fadedUntilConsent={consentRequired && !privacyConsent}
        redirectTo={redirectParam}
        supabaseConfig={supabaseConfig}
        googleClientId={googleClientId}
        recordPrivacyConsentOnSuccess={consentRequired}
        privacyConsentGranted={!consentRequired || privacyConsent}
        countryCode={consentCountry}
        onPrivacyConsentRecorded={
          consentRequired ? markLocalPrivacyConsentAck : undefined
        }
      />
    </AuthScreen>
  );
}
