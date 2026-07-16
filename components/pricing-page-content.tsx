import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Printer,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import { SupportTipLink } from "@/components/support-tip-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { invoiceTemplates } from "@/lib/invoice-templates";
import { cn } from "@/lib/utils";

const freeFeatures = [
  "Unlimited invoices",
  "Live preview with your branding",
  "Classic template — PDF export free",
  "Cloud invoice history",
  "Payment status tracking",
  "Multi-currency & GST-ready fields",
];

const premiumTemplateNames = invoiceTemplates
  .filter((template) => template.isPremium)
  .map((template) => template.name);

export function PricingPageContent() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-20">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Simple pricing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
          Everyday invoicing is free. Optional one-time purchases unlock premium
          templates when you want them.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-md">
        <div className="rounded-2xl border border-border/60 p-8 text-center">
          <p className="text-sm text-muted-foreground">Core product</p>
          <p className="mt-2 text-5xl font-bold tracking-tight">
            $0
            <span className="text-lg font-normal text-muted-foreground">
              /month
            </span>
          </p>

          <ul className="mt-8 space-y-3 text-left text-sm">
            {freeFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button size="lg" className="mt-8 w-full gap-2" asChild>
            <Link href="/signup">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <section className="mt-14 border-t border-border/40 pt-14">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 className="text-xl font-semibold">Optional templates</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Unlock {premiumTemplateNames.join(", ")} as a one-time purchase —
              $1 internationally or ₹99 in India. Preview free; pay only to
              export or print a premium layout.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              <Printer className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
              Classic always stays free to export and print.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 border-t border-border/40 pt-12 text-center">
        <Heart className="mx-auto h-6 w-6 text-primary" aria-hidden />
        <h2 className="mt-3 text-xl font-semibold">Support the platform</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          Voluntary tips on Ko-fi help keep {siteConfig.name} free for freelancers.
        </p>
        <SupportTipLink
          showIcon={false}
          className={cn(
            buttonVariants({ size: "default", variant: "outline" }),
            "mt-5 no-underline hover:no-underline"
          )}
        >
          Tip on Ko-fi
        </SupportTipLink>
      </section>
    </div>
  );
}
