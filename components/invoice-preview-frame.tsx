"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  getInvoicePageSpec,
  resolveInvoicePageSize,
  type InvoicePageSize,
} from "@/lib/invoice-design";
import { cn } from "@/lib/utils";

type InvoicePreviewFrameProps = {
  pageSize?: InvoicePageSize;
  className?: string;
  /** Blocks browser print of unpaid premium template previews */
  exportLocked?: boolean;
  /** Upper bound for preview scale (1 = full document width). */
  maxScale?: number;
  children: React.ReactNode;
};

/** Scales a fixed-width invoice document to fit the available preview area. */
export const InvoicePreviewFrame = memo(function InvoicePreviewFrame({
  pageSize,
  className,
  exportLocked = false,
  maxScale = 1,
  children,
}: InvoicePreviewFrameProps) {
  const spec = getInvoicePageSpec(resolveInvoicePageSize(pageSize));
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  const updateScale = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const available = viewport.clientWidth - 4;
    setScale(Math.min(maxScale, available / spec.widthPx));
  }, [maxScale, spec.widthPx]);

  useEffect(() => {
    updateScale();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const ro = new ResizeObserver(updateScale);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [updateScale]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => setContentHeight(content.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(content);
    return () => ro.disconnect();
  }, [children]);

  const scaledHeight =
    contentHeight !== null ? contentHeight * scale : undefined;

  return (
    <div
      ref={viewportRef}
      className={cn("w-full", exportLocked && "template-export-locked", className)}
      style={scaledHeight !== undefined ? { height: scaledHeight } : undefined}
    >
      <div
        className="mx-auto"
        style={{
          width: spec.widthPx * scale,
          height: scaledHeight,
          overflow: "hidden",
        }}
      >
        <div
          ref={contentRef}
          style={{
            width: spec.widthPx,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
});
