import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart } from "lucide-react";
import { siteConfig } from "@/data/site";
import { SupportPayPalLink } from "@/components/support-paypal-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const includedFeatures = [
  "Unlimited freelancer invoices",
  "Live invoice preview with your branding",
  "One-click PDF export",
  "Cloud-backed invoice history",
  "Payment status tracking",
  "Multi-currency and country-specific payment fields",
  "Logo and signature on invoices",
  "GST support for Indian freelancers",
];

export function PricingPageContent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <header className="text-center">
        <p className="text-sm font-medium text-primary">Simple pricing</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
          Free for freelancers
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          {siteConfig.name} costs nothing to use. Create invoices, export PDFs,
          and manage your billing history at no charge.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-lg">
        <div className="glass rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center shadow-lg">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Forever free
          </p>
          <p className="mt-3 text-5xl font-bold tracking-tight">
            $0
            <span className="text-lg font-normal text-muted-foreground">
              /month
            </span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            No credit card. No trial that expires.
          </p>

          <ul className="mt-8 space-y-3 text-left text-sm">
            {includedFeatures.map((feature) => (
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

      <section className="mt-16 rounded-2xl border border-border/50 bg-card/50 p-8 text-center md:p-10">
        <Heart className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold">Support this platform</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground leading-relaxed">
          {siteConfig.name} is built and maintained as a free tool for
          independent contractors. If it helps your freelance business, you can
          support ongoing development with a voluntary contribution through
          PayPal. Any amount is appreciated.
        </p>
        <SupportPayPalLink
          showIcon={false}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-6 no-underline hover:no-underline"
          )}
        >
          Support via PayPal
        </SupportPayPalLink>
        <p className="mt-4 text-xs text-muted-foreground">
          Contributions are optional and do not unlock extra features.
        </p>
      </section>
    </div>
  );
}
