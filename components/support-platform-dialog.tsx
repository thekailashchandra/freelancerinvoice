"use client";

import Link from "next/link";
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

type SupportPlatformDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SupportPlatformDialog({
  open,
  onOpenChange,
}: SupportPlatformDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" aria-hidden />
            Support {siteConfig.name}
          </DialogTitle>
          <DialogDescription className="text-left leading-relaxed">
            Your PDF is ready. {siteConfig.name} is free to use. If this tool
            saves you time on freelance billing, consider a voluntary contribution
            to help keep the platform running and improving.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SupportTipLink
            showIcon={false}
            className={cn(buttonVariants(), "flex-1 no-underline hover:no-underline")}
          >
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
          Maybe later
        </Button>
      </DialogContent>
    </Dialog>
  );
}
