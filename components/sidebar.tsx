"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { navItems } from "@/data/navigation";
import { PrivacyConsentLink } from "@/components/privacy-consent-link";
import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({
  onNavigate,
  collapsed = false,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-start gap-1.5 overflow-hidden px-1",
          collapsed ? "flex-col items-center" : "justify-between"
        )}
      >
        <div
          className={cn(
            "min-w-0 py-0.5",
            collapsed ? "order-2 flex justify-center" : "order-1 flex-1"
          )}
        >
          <SiteLogo
            variant="compact"
            href="/dashboard"
            priority
            className={cn(collapsed && "mx-auto scale-[0.72] origin-center")}
          />
        </div>
        {onToggle && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggle}
            className={cn(
              "h-7 w-7 shrink-0 rounded-full border-border bg-background shadow-sm",
              collapsed ? "order-1" : "order-2"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>

      <nav className={cn("mt-6 flex flex-1 flex-col gap-1", collapsed && "items-center")}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.title : undefined}
              className={cn(
                "relative flex items-center rounded-xl text-sm font-medium transition-colors",
                collapsed
                  ? "h-10 w-10 justify-center"
                  : "gap-3 px-3 py-2.5",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-violet-600 shadow-lg shadow-primary/25"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="relative z-10">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mt-auto space-y-3">
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/10 to-violet-500/10 p-3 lg:p-4">
            <p className="text-xs font-medium text-muted-foreground">Pro tip</p>
            <p className="mt-1 text-sm">
              Invoices sync to your secure cloud account at invoiceforfreelance.com.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 px-1 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground hover:underline">
              Privacy
            </Link>
            <PrivacyConsentLink className="hover:text-foreground" />
          </div>
        </div>
      )}
    </aside>
  );
}
