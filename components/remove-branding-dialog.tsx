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

type RemoveBrandingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayAmount: string;
  onConfirmPaid: () => void;
  confirming?: boolean;
};

export function RemoveBrandingDialog({
  open,
  onOpenChange,
  displayAmount,
  onConfirmPaid,
  confirming = false,
}: RemoveBrandingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" aria-hidden />
            Remove invoice footer
          </DialogTitle>
          <DialogDescription className="text-left leading-relaxed">
            Support {siteConfig.name} with a {displayAmount} tip on Ko-fi, then
            confirm below to remove the &ldquo;Powered by&rdquo; footer from
            your invoices.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 sm:flex-row">
          <SupportTipLink
            showIcon={false}
            className={cn(buttonVariants(), "flex-1 no-underline hover:no-underline")}
          >
            Tip {displayAmount} on Ko-fi
          </SupportTipLink>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onConfirmPaid}
            disabled={confirming}
          >
            {confirming ? "Saving…" : "I've contributed — remove footer"}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          Keep footer for now
        </Button>
      </DialogContent>
    </Dialog>
  );
}
