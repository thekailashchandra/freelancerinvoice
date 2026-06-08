"use client";

import { Heart } from "lucide-react";
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
import { invoiceBrandingText } from "@/lib/invoice-branding";

type RemoveBrandingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmContributed: () => void;
  confirming?: boolean;
};

export function RemoveBrandingDialog({
  open,
  onOpenChange,
  onConfirmContributed,
  confirming = false,
}: RemoveBrandingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" aria-hidden />
            Remove invoice branding
          </DialogTitle>
          <DialogDescription className="text-left leading-relaxed">
            {siteConfig.name} is free to use. A small &ldquo;{invoiceBrandingText}
            &rdquo; line appears at the bottom of printed, saved, and PDF invoices.
            If you&apos;d like to remove it, please support the project with any
            amount you choose on Ko-fi — then confirm below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SupportTipLink
            showIcon={false}
            className={cn(buttonVariants(), "flex-1 no-underline hover:no-underline")}
          >
            Tip on Ko-fi
          </SupportTipLink>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onConfirmContributed}
            disabled={confirming}
          >
            {confirming ? "Saving…" : "I've contributed — remove branding"}
          </Button>
        </div>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          Keep branding for now
        </Button>
      </DialogContent>
    </Dialog>
  );
}
