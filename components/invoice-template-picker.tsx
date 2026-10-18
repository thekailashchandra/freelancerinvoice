"use client";

import { Check } from "lucide-react";
import {
  invoiceTemplates,
  type InvoiceTemplateId,
} from "@/lib/invoice-templates";
import { cn } from "@/lib/utils";

type InvoiceTemplatePickerProps = {
  value: InvoiceTemplateId;
  /** Kept for call-site compatibility. */
  market?: string;
  onChange: (id: InvoiceTemplateId) => void;
  /** Dense grid for the create invoice workspace. */
  compact?: boolean;
};

export function InvoiceTemplatePicker({
  value,
  onChange,
  compact = false,
}: InvoiceTemplatePickerProps) {
  if (compact) {
    return (
      <section aria-labelledby="template-picker-heading" className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3
            id="template-picker-heading"
            className="text-sm font-semibold tracking-tight"
          >
            Template
          </h3>
          <p className="text-[11px] text-muted-foreground">
            All included with Cloud
          </p>
        </div>
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
          {invoiceTemplates.map((template) => {
            const selected = value === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onChange(template.id)}
                aria-pressed={selected}
                className={cn(
                  "group relative flex min-w-0 flex-col gap-1.5 rounded-lg border p-1.5 text-left transition-colors",
                  selected
                    ? "border-foreground bg-foreground/[0.04] ring-1 ring-foreground/20"
                    : "border-border bg-card hover:border-foreground/30 hover:bg-muted/40"
                )}
              >
                <span
                  className={cn(
                    "block h-5 w-full overflow-hidden rounded border border-border/60",
                    template.swatchClass
                  )}
                  aria-hidden
                >
                  <span className="flex h-full flex-col justify-between p-1">
                    <span className="block h-0.5 w-3 rounded bg-white/40" />
                    <span className="block space-y-0.5">
                      <span className="block h-0.5 w-full rounded bg-white/25" />
                      <span className="block h-0.5 w-2/3 rounded bg-white/25" />
                    </span>
                  </span>
                </span>
                <span className="flex items-center justify-between gap-1">
                  <span className="truncate text-[10px] font-medium">
                    {template.name}
                  </span>
                  {selected ? (
                    <Check className="h-3 w-3 shrink-0" aria-hidden />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

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
          Every layout is included with Cloud. Set your brand color in Settings
          to match your identity.
        </p>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:snap-none xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        {invoiceTemplates.map((template) => {
          const selected = value === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              className={cn(
                "group relative flex min-w-[78%] shrink-0 snap-start flex-col rounded-xl border p-4 text-left transition-all sm:min-w-0",
                selected
                  ? "border-foreground bg-foreground/[0.04] ring-1 ring-foreground/20"
                  : "border-border bg-card hover:border-foreground/30 hover:bg-muted/30"
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
                  <Check className="h-4 w-4 shrink-0 text-foreground" aria-hidden />
                ) : null}
              </div>

              <p className="mt-2 text-xs text-muted-foreground">Included</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
