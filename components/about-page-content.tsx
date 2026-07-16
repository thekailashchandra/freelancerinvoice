import { FounderSection } from "@/components/founder-section";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutPageContent() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 md:px-8 md:py-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          About {siteConfig.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          A free invoice generator for freelancers — professional PDFs, payment
          tracking, and cloud history without the subscription noise.
        </p>
      </header>

      <FounderSection />

      <section className="mt-12 space-y-5 leading-relaxed text-muted-foreground">
        <p>
          Too many freelancers still rely on Word templates or spreadsheets.
          {` `}
          {siteConfig.name} is purpose-built for solo billing: live preview,
          branded PDFs, multi-currency support, and a searchable invoice history.
        </p>
        <p>
          Getting paid should be straightforward. Clear invoices, sensible
          defaults, and software that stays out of your way.
        </p>
      </section>

      <div className="mt-14">
        <Button className="gap-2" asChild>
          <Link href="/signup">
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
