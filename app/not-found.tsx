import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public-page-shell";
import { Button } from "@/components/ui/button";
import { privateAppRobots } from "@/data/seo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested could not be found.",
  robots: privateAppRobots,
};

export default function NotFound() {
  return (
    <PublicPageShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center md:px-8">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          That URL does not exist. Try the home page, guides, or pricing instead.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/guide">Browse guides</Link>
          </Button>
        </div>
      </div>
    </PublicPageShell>
  );
}
