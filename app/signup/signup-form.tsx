"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  markEnteringApp,
  signUpClient,
} from "@/lib/api/auth-client";
import type { SupabaseBrowserConfig } from "@/lib/supabase/client";
import { brand } from "@/data/navigation";
import { Skeleton } from "@/components/ui/skeleton";

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
}: {
  disabled: boolean;
  pending: boolean;
}) {
  return (
    <Button
      type="submit"
      className="h-11 w-full rounded-lg font-medium shadow-none"
      disabled={disabled || pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Creating account…
        </>
      ) : (
        "Create account"
      )}
    </Button>
  );
}

const authFieldClass =
  "h-11 rounded-lg border-0 bg-muted/50 px-3.5 shadow-none ring-1 ring-border/50 transition-shadow placeholder:text-muted-foreground/70 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring/80";

type SignupFormProps = {
  configured: boolean;
  canSignUp: boolean;
  supabaseConfig: SupabaseBrowserConfig | null;
  googleClientId: string | null;
};

export function SignupForm({
  configured,
  canSignUp,
  supabaseConfig,
  googleClientId,
}: SignupFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSignUp) return;

    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const password = String(new FormData(form).get("password") ?? "");

    setIsPending(true);
    setError(null);

    try {
      const result = await signUpClient(email, password);

      if (!result.ok) {
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
      title="Create your account"
      description={`Start invoicing with ${brand.name}`}
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
          <code className="text-xs">.env.local</code> and set{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>
          , and <code className="text-xs">SUPABASE_SECRET_KEY</code>.
        </AuthAlert>
      )}
      {error && <AuthAlert>{error}</AuthAlert>}

      <GoogleSignInButton
        disabled={!configured}
        redirectTo="/onboarding"
        supabaseConfig={supabaseConfig}
        googleClientId={googleClientId}
      />

      <AuthDivider label="or" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Email address
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
        <div className="space-y-2">
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
        <SubmitButton disabled={!canSignUp} pending={isPending} />
      </form>

      <p className="text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline-offset-2 hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthScreen>
  );
}
