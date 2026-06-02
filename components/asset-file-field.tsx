"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AssetKind } from "@/lib/supabase/asset-storage";

type AssetFileFieldProps = {
  id: string;
  label: string;
  kind: AssetKind;
  imageUrl: string | null;
  onUpload: (kind: AssetKind, file: File) => Promise<string | null>;
};

export function AssetFileField({
  id,
  label,
  kind,
  imageUrl,
  onUpload,
}: AssetFileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(kind, file);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {imageUrl ? (
        <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/50 bg-background p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={label}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            Saved to your profile. Choose a new file to replace.
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No {label.toLowerCase()} yet.</p>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={handleChange}
        />
        {uploading && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
