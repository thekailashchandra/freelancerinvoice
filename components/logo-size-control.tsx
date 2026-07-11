"use client";

import { Label } from "@/components/ui/label";
import { resolveLogoHeight } from "@/lib/invoice-design";

type LogoSizeControlProps = {
  value?: number;
  onChange: (height: number) => void;
  id?: string;
  disabled?: boolean;
};

export function LogoSizeControl({
  value,
  onChange,
  id = "logoHeight",
  disabled,
}: LogoSizeControlProps) {
  const height = resolveLogoHeight(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>Logo size on invoice</Label>
        <span className="text-xs text-muted-foreground">{height}px</span>
      </div>
      <input
        id={id}
        type="range"
        min={32}
        max={200}
        step={4}
        value={height}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
      <p className="text-xs text-muted-foreground">
        Adjust how large your logo appears on invoice templates and PDFs.
      </p>
    </div>
  );
}
