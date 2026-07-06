"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { markEnteringApp, signInClient } from "@/lib/api/auth-client";
import { safeAppRedirect } from "@/lib/safe-redirect";
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
          Signing in…
        </>
      ) : (
        "Sign in"
      )}
    </Button>
  );
}

const authFieldClass =
  "h-11 rounded-lg border-0 bg-muted/50 px-3.5 shadow-none ring-1 ring-border/50 transition-shadow placeholder:text-muted-foreground/70 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring/80";

type LoginFormProps = {
  configured: boolean;
  supabaseConfig: SupabaseBrowserConfig | null;
  googleClientId: string | null;
};

export function LoginForm({
  configured,
  supabaseConfig,
  googleClientId,
}: LoginFormProps) {
  const searchParams = useSearchParams();
  const redirectParam = safeAppRedirect(searchParams.get("redirect"), "/dashboard");
  const authError = searchParams.get("error");

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!configured) return;

    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const password = String(new FormData(form).get("password") ?? "");

    setIsPending(true);
    setError(null);

    try {
      const result = await signInClient(email, password);

      if (!result.ok) {
        setError(result.error);
        toast.error("Sign in failed", { description: result.error });
        return;
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
      title={`Welcome back`}
      description={`Sign in to continue to ${brand.name}`}
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
      {error && <AuthAlert>{error}</AuthAlert>}

      <GoogleSignInButton
        disabled={!configured}
        redirectTo={redirectParam}
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
          <div className="flex items-center justify-between gap-2">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-muted-foreground"
            >
              Password
            </Label>
          </div>
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
        <SubmitButton disabled={!configured} pending={isPending} />
      </form>

      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
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
