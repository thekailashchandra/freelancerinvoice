"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";

type SiteLogoProps = {
  /** compact = sidebar/nav; full = landing header */
  variant?: "compact" | "full";
  className?: string;
  href?: string | null;
  priority?: boolean;
};

/**
 * Monochrome wordmark. Drawn in markup instead of a raster asset so it stays
 * crisp in both themes and needs no separate light/dark files.
 */
export function SiteLogo({
  variant = "compact",
  className,
  href = "/",
}: SiteLogoProps) {
  const isFull = variant === "full";

  const content = (
    <span
      className={cn(
        "inline-flex shrink-0 items-center",
        isFull ? "gap-3" : "gap-2.5",
        className
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-[7px] bg-foreground font-semibold leading-none text-background",
          isFull ? "h-9 w-9 text-[12px]" : "h-8 w-8 text-[11px]"
        )}
        aria-hidden
      >
        IF
      </span>
      <span className="flex flex-col justify-center">
        <span
          className={cn(
            "display-serif leading-none tracking-[-0.02em]",
            isFull ? "text-[22px]" : "text-[18px]"
          )}
        >
          Invoice<span className="text-muted-foreground"> for </span>Freelance
        </span>
        {isFull ? (
          <span className="eyebrow mt-1.5 text-[8px] text-muted-foreground">
            Freelancer billing studio
          </span>
        ) : null}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={siteConfig.name}
        className="inline-flex shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {content}
      </Link>
    );
  }

  return content;
}
