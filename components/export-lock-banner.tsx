"use client";

import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SubscriptionPricing } from "@/lib/subscription";
import { cn } from "@/lib/utils";

type ExportLockBannerProps = {
  billingEnabled: boolean;
  active: boolean;
  pricing: SubscriptionPricing;
  onUpgrade: () => void;
  className?: string;
};

export function ExportLockBanner({
  billingEnabled,
  active,
  pricing,
  onUpgrade,
  className,
}: ExportLockBannerProps) {
  if (!billingEnabled || active) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50">
          <Lock className="h-3 w-3" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-medium">
            Preview mode - export and print are locked
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            Build invoices free. Cloud unlocks PDF download and clean printing
            at {pricing.displayAmount}
            {pricing.intervalLabel}.
          </p>
        </div>
      </div>
      <Button size="sm" className="h-8 shrink-0 gap-1.5 self-start sm:self-auto" onClick={onUpgrade}>
        Unlock Cloud
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
