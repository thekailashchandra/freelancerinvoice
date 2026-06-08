"use client";

import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import {
  NavigationProvider,
  useNavigation,
} from "@/components/navigation-provider";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { cn } from "@/lib/utils";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { collapsed, toggle, hydrated } = useSidebarCollapsed();
  const { pending } = useNavigation();

  return (
    <div className="flex min-h-screen">
      <div
        className={cn(
          "hidden shrink-0 border-r border-border transition-[width] duration-200 md:block",
          collapsed ? "w-16" : "w-52 lg:w-56"
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
        <main
          className={cn(
            "flex-1 px-4 py-4 pb-20 transition-opacity duration-300 md:px-5 md:py-5 md:pb-5 lg:px-6",
            pending && "pointer-events-none opacity-60"
          )}
        >
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </NavigationProvider>
  );
}
