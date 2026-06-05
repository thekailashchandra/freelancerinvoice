"use client";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { collapsed, toggle, hydrated } = useSidebarCollapsed();

  return (
    <div className="flex min-h-screen">
      <div
        className={cn(
          "hidden shrink-0 border-r border-border/50 transition-[width] duration-200 md:block",
          collapsed ? "w-[4.5rem]" : "w-52 lg:w-56"
        )}
      >
        <div className={cn("h-full", collapsed ? "px-2 py-3" : "p-3 lg:p-4")}>
          <Sidebar
            collapsed={collapsed && hydrated}
            onToggle={toggle}
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-3 md:p-4 lg:p-5">{children}</main>
      </div>
    </div>
  );
}
