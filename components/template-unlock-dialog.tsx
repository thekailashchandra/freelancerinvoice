"use client";

import { Sparkles } from "lucide-react";
import { siteConfig } from "@/data/site";
import { SupportTipLink } from "@/components/support-tip-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { InvoiceTemplateId } from "@/lib/invoice-templates";

type TemplateUnlockDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: InvoiceTemplateId;
  templateName: string;
  displayAmount: string;
  onConfirmPaid: () => void;
  confirming?: boolean;
  razorpayEnabled?: boolean;
  onPayWithRazorpay?: () => void;
  payingRazorpay?: boolean;
};

export function TemplateUnlockDialog({
  open,
  onOpenChange,
  templateName,
  displayAmount,
  onConfirmPaid,
  confirming = false,
  razorpayEnabled = false,
  onPayWithRazorpay,
  payingRazorpay = false,
}: TemplateUnlockDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            Unlock {templateName} template
          </DialogTitle>
          <DialogDescription className="text-left leading-relaxed">
            Premium templates are a one-time {displayAmount} unlock.
            {razorpayEnabled
              ? " Pay with Razorpay (Test Mode supported) or support on Ko-fi, then confirm below."
              : ` Support ${siteConfig.name} on Ko-fi, then confirm below to enable downloads.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {razorpayEnabled && onPayWithRazorpay ? (
            <Button
              className="w-full"
              onClick={onPayWithRazorpay}
              disabled={payingRazorpay || confirming}
            >
              {payingRazorpay ? "Opening Razorpay…" : `Pay ${displayAmount} with Razorpay`}
            </Button>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <SupportTipLink
              showIcon={false}
              className={cn(
                buttonVariants({ variant: razorpayEnabled ? "outline" : "default" }),
                "flex-1 no-underline hover:no-underline"
              )}
            >
              Pay {displayAmount} on Ko-fi
            </SupportTipLink>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onConfirmPaid}
              disabled={confirming || payingRazorpay}
            >
              {confirming ? "Unlocking…" : "I've paid on Ko-fi — unlock"}
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          Keep using Classic (free)
        </Button>
      </DialogContent>
    </Dialog>
  );
}
