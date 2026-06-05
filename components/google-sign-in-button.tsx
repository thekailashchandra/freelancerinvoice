"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient, type SupabaseBrowserConfig } from "@/lib/supabase/client";
import { formatAuthError } from "@/lib/supabase/auth-errors";

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

  useEffect(() => {
    if (
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
  }, [disabled, googleClientId, gsiReady, handleCredential]);

  if (!googleClientId) {
    return (
      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
        Add <code className="text-xs">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to{" "}
        <code className="text-xs">.env.local</code> (same Client ID as Supabase
        Google provider) so the consent screen shows &quot;Invoice for
        Freelance&quot; instead of your Supabase URL.
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
