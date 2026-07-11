"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { markEnteringApp, signUpClient } from "@/lib/api/auth-client";
import type { SupabaseBrowserConfig } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { PrivacyPolicyConsentField } from "@/components/privacy-policy-consent-field";
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
          Creating account…
        </>
      ) : rateLimited ? (
        `Try again in ${retryAfterSec}s`
      ) : (
        "Create account"
      )}
    </Button>
  );
}

const authFieldClass =
  "h-10 rounded-lg border-0 bg-muted/50 px-3.5 shadow-none ring-1 ring-border/50 transition-shadow placeholder:text-muted-foreground/70 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring/80";

type SignupFormProps = {
  configured: boolean;
  canSignUp: boolean;
  supabaseConfig: SupabaseBrowserConfig | null;
  googleClientId: string | null;
  initialCountryCode?: string;
};

export function SignupForm({
  configured,
  canSignUp,
  supabaseConfig,
  googleClientId,
  initialCountryCode,
}: SignupFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const consentCountry = useConsentCountry(initialCountryCode);
  const {
    isBlocked: isRateLimited,
    retryAfterSec,
    applyCooldown,
    message: rateLimitMessage,
  } = useAuthRateLimit();

  const isRateLimitError = (message: string) => /too many/i.test(message);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSignUp || !privacyConsent || isRateLimited) return;

    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const password = String(new FormData(form).get("password") ?? "");

    setIsPending(true);
    setError(null);

    try {
      const result = await signUpClient(email, password, true);

      if (!result.ok) {
        if (result.rateLimited && result.retryAfterSec) {
          applyCooldown(result.retryAfterSec);
          toast.error("Sign up paused", {
            description: formatRateLimitMessage(result.retryAfterSec),
          });
          return;
        }

        if (isRateLimitError(result.error)) {
          applyCooldown(5 * 60);
          toast.error("Sign up paused", { description: result.error });
          return;
        }

        setError(result.error);
        toast.error("Sign up failed", { description: result.error });
        return;
      }

      markEnteringApp();
      window.location.href = result.redirect;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create account.";
      setError(message);
      toast.error("Sign up failed", { description: message });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthScreen
      compact
      title="Create your account"
      description="Free invoicing for freelancers"
      loading={isPending}
      loadingMessage="Setting up your account…"
      footer={
        <AuthFooterLinks
          primary={{ href: "/", label: "Back to home" }}
          secondary={{ href: "/login", label: "Sign in" }}
        />
      }
    >
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
            autoComplete="new-password"
            placeholder="At least 6 characters"
            minLength={6}
            required
            className={authFieldClass}
          />
        </div>

        <PrivacyPolicyConsentField
          compact
          checked={privacyConsent}
          onCheckedChange={setPrivacyConsent}
          id="signup-privacy-consent"
          initialCountryCode={initialCountryCode}
        />

        <SubmitButton
          disabled={!canSignUp || !privacyConsent || isRateLimited}
          pending={isPending}
          rateLimited={isRateLimited}
          retryAfterSec={retryAfterSec}
        />
      </form>

      <AuthDivider label="or" />

      <GoogleSignInButton
        disabled={!configured || isRateLimited}
        fadedUntilConsent={!privacyConsent}
        redirectTo="/onboarding"
        supabaseConfig={supabaseConfig}
        googleClientId={googleClientId}
        recordPrivacyConsentOnSuccess
        privacyConsentGranted={privacyConsent}
        countryCode={consentCountry}
      />
    </AuthScreen>
  );
}
