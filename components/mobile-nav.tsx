"use client";

import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/navigation";
import { NavLink } from "@/components/nav-link";
import { useTranslation } from "@/components/locale-provider";
import { useNavPending } from "@/components/navigation-provider";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

function MobileNavItem({
  href,
  label,
  active,
  icon: Icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: (typeof navItems)[number]["icon"];
}) {
  const isPending = useNavPending(href);

  return (
    <NavLink
      href={href}
      showSpinner={false}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-all duration-200",
        active ? "text-primary" : "text-muted-foreground active:text-foreground",
        isPending && "scale-95"
      )}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary/80" />
      ) : (
        <Icon className={cn("h-5 w-5 shrink-0", active && "stroke-[2.5]")} />
      )}
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const mounted = useMounted();
  const { t } = useTranslation();

  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm md:hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-14 max-w-lg items-stretch justify-around px-2">
        {mounted &&
          navItems.map((item) => (
          <MobileNavItem
            key={item.href}
            href={item.href}
            active={pathname.startsWith(item.href)}
            icon={item.icon}
            label={
              item.href === "/create-invoice"
                ? t("mobileNav.create")
                : item.href === "/invoice-history"
                  ? t("mobileNav.history")
                  : item.href === "/customers"
                    ? t("nav.customers")
                    : t(item.titleKey)
            }
          />
          ))}
      </div>
    </nav>
  );
}
