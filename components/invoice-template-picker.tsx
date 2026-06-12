"use client";

import { Check, Lock } from "lucide-react";
import {
  getInvoiceTemplate,
  getTemplatePricing,
  invoiceTemplates,
  type InvoiceTemplateId,
} from "@/lib/invoice-templates";
import type { MarketRegion } from "@/lib/geo-market";
import { useTemplateUnlockLookup } from "@/hooks/use-template-unlocked";
import { cn } from "@/lib/utils";

type InvoiceTemplatePickerProps = {
  value: InvoiceTemplateId;
  market: MarketRegion;
  onChange: (id: InvoiceTemplateId) => void;
};

export function InvoiceTemplatePicker({
  value,
  market,
  onChange,
}: InvoiceTemplatePickerProps) {
  const pricing = getTemplatePricing(market);
  const isUnlocked = useTemplateUnlockLookup();

  return (
    <section aria-labelledby="template-picker-heading" className="space-y-3">
      <div>
        <h3
          id="template-picker-heading"
          className="text-base font-semibold tracking-tight"
        >
          Invoice template
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Classic is free. Premium layouts unlock with a one-time{" "}
          <span className="font-medium text-foreground">{pricing.label}</span>{" "}
          tip on Ko-fi.
        </p>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:snap-none xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        {invoiceTemplates.map((template) => {
          const selected = value === template.id;
          const unlocked =
            !template.isPremium || isUnlocked(template.id);

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              className={cn(
                "group relative flex min-w-[78%] shrink-0 snap-start flex-col rounded-xl border p-4 text-left transition-all sm:min-w-0",
                selected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "mb-3 h-16 w-full overflow-hidden rounded-lg border border-border/60",
                  template.swatchClass
                )}
              >
                <div className="flex h-full flex-col justify-between p-2">
                  <div className="h-2 w-8 rounded bg-white/30" />
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded bg-white/20" />
                    <div className="h-1.5 w-2/3 rounded bg-white/20" />
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{template.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
                {selected ? (
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                ) : null}
              </div>

              <p className="mt-2 text-xs font-medium">
                {template.isPremium ? (
                  unlocked ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Lock className="h-3 w-3" aria-hidden />
                      {pricing.displayAmount}
                    </span>
                  )
                ) : (
                  <span className="text-muted-foreground">Free</span>
                )}
              </p>
            </button>
          );
        })}
      </div>

      {getInvoiceTemplate(value).isPremium &&
      !isUnlocked(value) ? (
        <p className="text-xs text-muted-foreground">
          Preview any premium template before paying. PDF download requires a
          one-time {pricing.displayAmount} unlock.
        </p>
      ) : null}
    </section>
  );
}
