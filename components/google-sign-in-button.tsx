"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { toast } from "sonner";
import { CalmLoader } from "@/components/calm-loader";
import { createClient, type SupabaseBrowserConfig } from "@/lib/supabase/client";
import { formatAuthError } from "@/lib/supabase/auth-errors";
import { getGoogleClientId } from "@/lib/supabase/client-env";

type GoogleCredentialResponse = {
  credential: string;
};

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

  const resolvedClientId = googleClientId ?? getGoogleClientId() ?? null;

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

        document.cookie = "iff_entering=1; path=/; max-age=20; samesite=lax";
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

  useEffect(() => {
    if (
      disabled ||
      !resolvedClientId ||
      !gsiReady ||
      !containerRef.current ||
      !window.google?.accounts?.id
    ) {
      return;
    }

    const container = containerRef.current;
    container.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: resolvedClientId,
      callback: handleCredential,
      ux_mode: "popup",
      auto_select: false,
      context: "signin",
    });

    const width = Math.max(container.offsetWidth, 280);
    window.google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "filled_black",
      size: "large",
      text: "continue_with",
      shape: "pill",
      width,
      logo_alignment: "left",
    });
  }, [disabled, resolvedClientId, gsiReady, handleCredential]);

  if (!resolvedClientId) {
    return (
      <p className="rounded-lg border border-primary/40 bg-primary/15 p-3 text-sm text-foreground">
        Google sign-in is temporarily unavailable. Please use email sign-up, or
        contact support if this persists.
      </p>
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
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/90 calm-overlay-enter">
            <CalmLoader message="Signing you in…" size="sm" />
          </div>
        )}
        <div
          ref={containerRef}
          className={[
            "flex min-h-11 w-full justify-center overflow-hidden rounded-lg [&>div]:!w-full [&_iframe]:!rounded-lg",
            disabled || loading ? "pointer-events-none opacity-50" : "",
          ].join(" ")}
          aria-hidden={disabled || loading}
        />
      </div>
    </>
  );
}
