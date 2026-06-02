"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems } from "@/data/navigation";
import { SiteLogo } from "@/components/site-logo";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="flex h-full flex-col">
      <div className="px-2 py-2">
        <SiteLogo variant="compact" href="/dashboard" priority />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
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
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-border/50 bg-gradient-to-br from-primary/10 to-violet-500/10 p-4">
        <p className="text-xs font-medium text-muted-foreground">Pro tip</p>
        <p className="mt-1 text-sm">
          Invoices sync to your secure cloud account at invoiceforfreelance.com.
        </p>
      </div>
    </aside>
  );
}
