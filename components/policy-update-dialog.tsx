"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PrivacyPolicyConsentField } from "@/components/privacy-policy-consent-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  describeOutstandingUpdates,
  type OutstandingLegalUpdates,
} from "@/lib/legal-consent";
import {
  markLocalPrivacyConsentAck,
  recordPrivacyConsentClient,
} from "@/lib/privacy-consent";
import { cn } from "@/lib/utils";

type PolicyUpdateDialogProps = {
  open: boolean;
  updates: OutstandingLegalUpdates;
  initialCountryCode?: string;
  onAccepted: () => void;
};

function BlockingDialogContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[100] grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function PolicyUpdateDialog({
  open,
  updates,
  initialCountryCode,
  onAccepted,
}: PolicyUpdateDialogProps) {
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) setConsent(false);
  }, [open]);

  const handleAccept = useCallback(async () => {
    if (!consent) return;

    setPending(true);
    try {
      const result = await recordPrivacyConsentClient();
      if (!result.ok) {
        toast.error("Could not save your acceptance", {
          description: result.error,
        });
        return;
      }
      markLocalPrivacyConsentAck();
      onAccepted();
    } catch {
      toast.error("Could not save your acceptance", {
        description: "Please try again.",
      });
    } finally {
      setPending(false);
    }
  }, [consent, onAccepted]);

  const updatedDocs = describeOutstandingUpdates(updates);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <BlockingDialogContent aria-describedby="policy-update-description">
        <DialogHeader>
          <DialogTitle>Updated terms</DialogTitle>
          <DialogDescription
            id="policy-update-description"
            className="text-left text-sm leading-snug"
          >
            Please accept the updated {updatedDocs.toLowerCase()} to continue.
          </DialogDescription>
        </DialogHeader>

        <PrivacyPolicyConsentField
          compact
          checked={consent}
          onCheckedChange={setConsent}
          id="policy-update-consent"
          initialCountryCode={initialCountryCode}
        />

        <Button
          type="button"
          className="h-10 w-full"
          disabled={!consent || pending}
          onClick={() => void handleAccept()}
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
      </BlockingDialogContent>
    </Dialog>
  );
}
