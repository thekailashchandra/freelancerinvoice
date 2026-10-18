"use client";

import { Button } from "@/components/ui/button";
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
  /** Kept for call-site compatibility; branding removal is included with Cloud. */
  displayAmount?: string;
  onConfirmPaid: () => void;
  confirming?: boolean;
};

export function RemoveBrandingDialog({
  open,
  onOpenChange,
  onConfirmPaid,
  confirming = false,
}: RemoveBrandingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove the invoice footer</DialogTitle>
          <DialogDescription className="text-left leading-relaxed">
            Branding-free invoices are included with the Cloud plan. Remove the
            &ldquo;Powered by&rdquo; footer from every invoice you export.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            onClick={onConfirmPaid}
            disabled={confirming}
          >
            {confirming ? "Saving…" : "Remove footer"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
