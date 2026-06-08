import * as React from "react";
import { Heart } from "lucide-react";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

type SupportTipLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  showIcon?: boolean;
};

export const SupportTipLink = React.forwardRef<
  HTMLAnchorElement,
  SupportTipLinkProps
>(({ className, showIcon = true, children, ...props }, ref) => {
  return (
    <a
      ref={ref}
      href={siteConfig.supportTipUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium hover:underline",
        className
      )}
      {...props}
    >
      {showIcon && <Heart className="h-4 w-4" aria-hidden />}
      {children ?? "Tip on Ko-fi"}
    </a>
  );
});
SupportTipLink.displayName = "SupportTipLink";
