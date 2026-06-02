"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { navItems } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title =
    navItems.find((n) => pathname.startsWith(n.href))?.title ?? siteConfig.name;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border/50 bg-background/60 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        <div>
          <h1 className="text-lg font-semibold tracking-tight md:text-xl">
            {title}
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            {navItems.find((n) => pathname.startsWith(n.href))?.title ??
              "Overview"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
