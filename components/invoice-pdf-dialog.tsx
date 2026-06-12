"use client";

import Link from "next/link";
import { CheckCircle2, Heart, Loader2 } from "lucide-react";
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

export type InvoicePdfDialogPhase = "generating" | "success" | "error";

type InvoicePdfDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase: InvoicePdfDialogPhase;
  errorMessage?: string | null;
};

export function InvoicePdfDialog({
  open,
  onOpenChange,
  phase,
  errorMessage,
}: InvoicePdfDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (phase === "generating") return;
        onOpenChange(next);
      }}
    >
      <DialogContent>
        {phase === "generating" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
                Generating PDF
              </DialogTitle>
              <DialogDescription>
                Building your invoice from the live preview. This usually takes a
                few seconds.
              </DialogDescription>
            </DialogHeader>
          </>
        ) : phase === "error" ? (
          <>
            <DialogHeader>
              <DialogTitle>PDF export failed</DialogTitle>
              <DialogDescription className="text-left">
                {errorMessage ?? "Something went wrong. Please try again."}
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />
                PDF downloaded
              </DialogTitle>
              <DialogDescription className="text-left leading-relaxed">
                Your invoice PDF is ready. {siteConfig.name} is free to use — if
                it saves you time, consider supporting the project.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 sm:flex-row">
              <SupportTipLink
                showIcon={false}
                className={cn(
                  buttonVariants(),
                  "flex-1 no-underline hover:no-underline"
                )}
              >
                <Heart className="mr-2 h-4 w-4" aria-hidden />
                Tip on Ko-fi
              </SupportTipLink>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              Continue editing
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
