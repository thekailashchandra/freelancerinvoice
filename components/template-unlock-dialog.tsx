"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  razorpayEnabled: boolean;
  onPayWithRazorpay: () => void;
  payingRazorpay?: boolean;
};

export function TemplateUnlockDialog({
  open,
  onOpenChange,
  templateName,
  displayAmount,
  razorpayEnabled,
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
            Premium templates are a one-time {displayAmount} unlock. Payment is
            verified automatically — no manual confirmation.
          </DialogDescription>
        </DialogHeader>

        {razorpayEnabled ? (
          <Button
            className="w-full"
            size="lg"
            onClick={onPayWithRazorpay}
            disabled={payingRazorpay}
          >
            {payingRazorpay ? "Opening Razorpay…" : `Pay ${displayAmount} with Razorpay`}
          </Button>
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Template payments are not available right now. You can keep using the
            free Classic template.
          </p>
        )}

        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          Keep using Classic (free)
        </Button>

        {!razorpayEnabled ? (
          <p className="text-center text-xs text-muted-foreground">
            <Link href="/login" className="underline-offset-2 hover:underline">
              Sign in
            </Link>{" "}
            if you have an account.
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
