"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { brand, navItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const BrandIcon = brand.icon;

  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-lg shadow-primary/30">
          <BrandIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold tracking-tight">{brand.name}</p>
          <p className="text-xs text-muted-foreground">{brand.tagline}</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
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
          Save invoices locally — your data stays on this device.
        </p>
      </div>
    </aside>
  );
}
