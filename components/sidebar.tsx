"use client";

import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navItems } from "@/data/navigation";
import { PrivacyConsentLink } from "@/components/privacy-consent-link";
import { useTranslation } from "@/components/locale-provider";
import { NavLink } from "@/components/nav-link";
import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
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
  const mounted = useMounted();
  const { t } = useTranslation();

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
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "h-7 w-7 shrink-0",
              collapsed ? "order-1" : "order-2"
            )}
            aria-label={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>

      <nav
        className={cn(
          "mt-5 flex flex-1 flex-col gap-0.5",
          collapsed && "items-center",
          !mounted && "min-h-[11.5rem]"
        )}
        aria-label="Main navigation"
      >
        {mounted
          ? navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? t(item.titleKey) : undefined}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                    collapsed
                      ? "h-10 w-10 justify-center"
                      : "gap-2.5 px-3 py-2",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{t(item.titleKey)}</span>}
                </NavLink>
              );
            })
          : null}
      </nav>

      {!collapsed && (
        <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 px-1 pt-4 text-xs text-muted-foreground">
          <NavLink href="/privacy" className="hover:text-foreground" showSpinner={false}>
            {t("sidebar.privacy")}
          </NavLink>
          <PrivacyConsentLink className="hover:text-foreground" />
        </div>
      )}
    </aside>
  );
}
