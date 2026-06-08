import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuideNavMenu } from "@/components/guide-nav-menu";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function PublicSiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-8">
      <SiteLogo variant="full" href="/" priority />
      <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
        <GuideNavMenu />
        <Button variant="ghost" asChild className="hidden sm:inline-flex">
          <Link href="/pricing">Pricing</Link>
        </Button>
        <ThemeToggle />
        <Button variant="ghost" asChild className="hidden sm:inline-flex">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" className="sm:size-default">
          <Link href="/signup">
            <span className="hidden sm:inline">Get started free</span>
            <span className="sm:hidden">Sign up</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </nav>
    </header>
  );
}
