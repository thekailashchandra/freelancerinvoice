"use client";

import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
                <CheckCircle2 className="h-5 w-5" aria-hidden />
                PDF downloaded
              </DialogTitle>
              <DialogDescription className="text-left leading-relaxed">
                Your invoice PDF is ready and has been downloaded.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/invoice-history">Back to invoices</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/pricing">View plans</Link>
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
