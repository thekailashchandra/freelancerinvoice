"use client";

import { useMemo, useState } from "react";
import { COUNTRY_OPTIONS, getCountryLabel } from "@/lib/country";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CountrySelectProps = {
  value: string;
  onValueChange: (code: string) => void;
  className?: string;
};

export function CountrySelect({
  value,
  onValueChange,
  className,
}: CountrySelectProps) {
  const [search, setSearch] = useState("");
  const displayLabel = getCountryLabel(value);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRY_OPTIONS;
    return COUNTRY_OPTIONS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <Select
      value={value}
      onValueChange={(code) => {
        onValueChange(code);
        setSearch("");
      }}
    >
      <SelectTrigger className={cn("h-10", className)}>
        <SelectValue placeholder="Select country">
          {displayLabel || "Select country"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[min(24rem,70vh)]">
        <div
          className="sticky top-0 z-10 border-b border-border/60 bg-popover p-2"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Search countries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No countries found
          </p>
        ) : (
          filtered.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
