"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PrivacyPolicyConsentField } from "@/components/privacy-policy-consent-field";
import { Button } from "@/components/ui/button";
import { useMarketContext } from "@/hooks/use-market-context";
import { recordPrivacyConsentClient, markLocalPrivacyConsentAck, formatConsentLawNotice } from "@/lib/privacy-consent";

type PrivacyConsentFormProps = {
  userEmail?: string;
  initialCountryCode?: string;
};

export function PrivacyConsentForm({
  userEmail,
  initialCountryCode,
}: PrivacyConsentFormProps) {
  const router = useRouter();
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const market = useMarketContext(
    initialCountryCode ? { countryCode: initialCountryCode } : undefined
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!consent) return;

    setPending(true);
    try {
      const result = await recordPrivacyConsentClient();
      if (!result.ok) {
        toast.error("Could not save consent", { description: result.error });
        return;
      }
      markLocalPrivacyConsentAck();
      router.refresh();
    } catch {
      toast.error("Could not save consent", {
        description: "Please try again.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
      <h1 className="text-xl font-semibold tracking-tight">
        Privacy consent
      </h1>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Before you continue{userEmail ? ` as ${userEmail}` : ""}, please review
        and accept our Privacy Policy and Terms, including {formatConsentLawNotice(market.countryCode)}.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <PrivacyPolicyConsentField
          checked={consent}
          onCheckedChange={setConsent}
          id="onboarding-privacy-consent"
          initialCountryCode={initialCountryCode}
        />
        <Button
          type="submit"
          className="h-11 w-full"
          disabled={!consent || pending}
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </div>
  );
}
