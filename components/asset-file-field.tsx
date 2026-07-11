"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AssetKind } from "@/lib/supabase/asset-storage";

type AssetFileFieldProps = {
  id: string;
  label: string;
  kind: AssetKind;
  imageUrl: string | null;
  onUpload: (kind: AssetKind, file: File) => Promise<string | null>;
  onDelete?: (kind: AssetKind) => Promise<void>;
};

export function AssetFileField({
  id,
  label,
  kind,
  imageUrl,
  onUpload,
  onDelete,
}: AssetFileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!onDelete || !imageUrl) return;

    setDeleting(true);
    try {
      await onDelete(kind);
    } finally {
      setDeleting(false);
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
          <p className="min-w-0 flex-1 text-xs text-muted-foreground">
            {onDelete
              ? "Choose a new file to replace, or remove it."
              : "Saved to your profile. Choose a new file to replace."}
          </p>
          {onDelete ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 text-destructive hover:text-destructive"
              disabled={deleting || uploading}
              onClick={() => void handleDelete()}
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Remove
            </Button>
          ) : null}
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
          disabled={uploading || deleting}
          onChange={handleChange}
        />
        {uploading && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
