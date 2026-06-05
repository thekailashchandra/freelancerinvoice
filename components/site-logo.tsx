"use client";

import Image from "next/image";
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

export function SiteLogo({
  variant = "compact",
  className,
  href = "/",
  priority = false,
}: SiteLogoProps) {
  const isFull = variant === "full";

  const lightClass = cn(
    "w-auto object-contain object-left dark:hidden",
    isFull ? "h-16 md:h-24" : "h-14"
  );
  const darkClass = cn(
    "hidden w-auto object-contain object-left dark:block",
    isFull ? "h-14 md:h-20" : "h-12"
  );

  const content = (
    <span className={cn("relative inline-flex shrink-0 items-center", className)}>
      <Image
        src={siteConfig.logos.light}
        alt={siteConfig.name}
        width={isFull ? 480 : 300}
        height={isFull ? 96 : 56}
        className={lightClass}
        priority={priority}
      />
      <Image
        src={siteConfig.logos.dark}
        alt={siteConfig.name}
        width={isFull ? 400 : 260}
        height={isFull ? 80 : 48}
        className={darkClass}
        priority={priority}
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
