"use client";

import { useMemo, useState } from "react";
import { CURRENCY_OPTIONS } from "@/lib/currency";
import { getCurrencyFlag, getCurrencyLabel } from "@/lib/currency-display";
import { limitCurrencyOptions } from "@/lib/select-limits";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CurrencySelectProps = {
  value: string;
  onValueChange: (code: string) => void;
  className?: string;
  compact?: boolean;
};

export function CurrencySelect({
  value,
  onValueChange,
  className,
  compact = false,
}: CurrencySelectProps) {
  const [search, setSearch] = useState("");
  const flag = getCurrencyFlag(value);
  const label = getCurrencyLabel(value);

  const { items: filtered, truncated } = useMemo(
    () => limitCurrencyOptions(CURRENCY_OPTIONS, search, value),
    [search, value]
  );

  return (
    <Select
      value={value}
      onValueChange={(code) => {
        onValueChange(code);
        setSearch("");
      }}
    >
      <SelectTrigger className={cn(compact ? "h-9 min-w-[7rem]" : "h-10", className)}>
        <SelectValue>
          <span className="flex items-center gap-2">
            <span aria-hidden className="text-base leading-none">
              {flag}
            </span>
            <span>{compact ? value : label}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[min(24rem,70vh)]">
        <div
          className="sticky top-0 z-10 border-b border-border/60 bg-popover p-2"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Search currencies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        {truncated && !search.trim() && (
          <p className="px-3 py-2 text-center text-xs text-muted-foreground">
            Popular currencies — search for more
          </p>
        )}
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No currencies found
          </p>
        ) : (
          filtered.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              <span className="flex items-center gap-2">
                <span aria-hidden className="text-base leading-none">
                  {getCurrencyFlag(c.code)}
                </span>
                <span>{c.label}</span>
              </span>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
