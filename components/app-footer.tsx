import Link from "next/link";
import { siteConfig } from "@/data/site";

export function AppFooter() {
  return (
    <footer className="hidden border-t border-border/50 py-4 text-center text-xs text-muted-foreground md:block">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>© {new Date().getFullYear()} {siteConfig.name}</span>
        <Link href="/pricing" className="hover:text-foreground hover:underline">
          Pricing
        </Link>
        <Link href="/subscribe" className="hover:text-foreground hover:underline">
          Cloud plan
        </Link>
      </div>
    </footer>
  );
}
