"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useNavigationOptional } from "@/components/navigation-provider";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.ComponentProps<typeof Link> {
  active?: boolean;
  showSpinner?: boolean;
}

export function NavLink({
  href,
  onClick,
  showSpinner = true,
  className,
  children,
  ...props
}: NavLinkProps) {
  const navigation = useNavigationOptional();
  const hrefStr = typeof href === "string" ? href : (href.pathname ?? "");
  const isPending = navigation?.pendingHref === hrefStr;
  const otherPending = Boolean(
    navigation?.pendingHref && navigation.pendingHref !== hrefStr
  );

  return (
    <Link
      href={href}
      onClick={(e) => {
        navigation?.startNavigation(hrefStr);
        onClick?.(e);
      }}
      className={cn(
        className,
        isPending && "pointer-events-none",
        otherPending && "opacity-60"
      )}
      aria-busy={isPending}
      {...props}
    >
      {children}
      {showSpinner && isPending && (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin opacity-70" />
      )}
    </Link>
  );
}
