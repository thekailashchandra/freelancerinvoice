"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { mobileNavLinks } from "@/data/public-navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function PublicMobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 overflow-y-auto">
        <h2 className="text-lg font-semibold">Menu</h2>
        <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile navigation">
          {mobileNavLinks.map((link) => (
            <SheetClose key={link.href} asChild>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Sign in
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
