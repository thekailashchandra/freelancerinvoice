"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient, type SupabaseBrowserConfig } from "@/lib/supabase/client";
import { formatAuthError } from "@/lib/supabase/auth-errors";
import { Button } from "@/components/ui/button";

type GoogleCredentialResponse = {
  credential: string;
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

type GoogleSignInButtonProps = {
  disabled?: boolean;
  redirectTo?: string;
  supabaseConfig?: SupabaseBrowserConfig | null;
  googleClientId?: string | null;
};

export function GoogleSignInButton({
  disabled = false,
  redirectTo = "/dashboard",
  supabaseConfig = null,
  googleClientId = null,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gsiReady, setGsiReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const useGsi = Boolean(googleClientId);

  const handleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!supabaseConfig?.url || !supabaseConfig.publishableKey) {
        toast.error("Google sign-in failed", {
          description: "Supabase is not configured.",
        });
        return;
      }

      setLoading(true);
      try {
        const supabase = createClient(supabaseConfig);
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
        });

        if (error) {
          toast.error("Google sign-in failed", {
            description: formatAuthError(error),
          });
          setLoading(false);
          return;
        }

        const next = redirectTo.startsWith("/") ? redirectTo : "/dashboard";
        let destination = next;

        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("company_name")
            .eq("id", data.user.id)
            .maybeSingle();

          if (!profile?.company_name) {
            destination = "/onboarding";
          }
        }

        window.location.href = destination;
      } catch (err) {
        toast.error("Google sign-in failed", {
          description: formatAuthError(err),
        });
        setLoading(false);
      }
    },
    [redirectTo, supabaseConfig]
  );

  async function handleOAuthFallback() {
    if (disabled || loading) return;

    if (!supabaseConfig?.url || !supabaseConfig.publishableKey) {
      toast.error("Google sign-in failed", {
        description: "Supabase is not configured.",
      });
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient(supabaseConfig);
      const next = redirectTo.startsWith("/") ? redirectTo : "/dashboard";
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        toast.error("Google sign-in failed", {
          description: formatAuthError(error),
        });
        setLoading(false);
      }
    } catch (err) {
      toast.error("Google sign-in failed", {
        description: formatAuthError(err),
      });
      setLoading(false);
    }
  }

  useEffect(() => {
    if (
      !useGsi ||
      disabled ||
      !googleClientId ||
      !gsiReady ||
      !containerRef.current ||
      !window.google?.accounts?.id
    ) {
      return;
    }

    const container = containerRef.current;
    container.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleCredential,
      ux_mode: "popup",
      auto_select: false,
      context: "signin",
    });

    const width = Math.max(container.offsetWidth, 280);
    window.google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width,
      logo_alignment: "left",
    });
  }, [disabled, googleClientId, gsiReady, handleCredential, useGsi]);

  if (!useGsi) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        disabled={disabled || loading}
        onClick={handleOAuthFallback}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </Button>
    );
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setGsiReady(true)}
      />
      <div className="relative w-full">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/80">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        <div
          ref={containerRef}
          className={[
            "flex min-h-10 w-full justify-center [&>div]:!w-full",
            disabled || loading ? "pointer-events-none opacity-50" : "",
          ].join(" ")}
          aria-hidden={disabled || loading}
        />
      </div>
    </>
  );
}
