import { CheckCircle2, Heart, Shield } from "lucide-react";
import { siteConfig } from "@/data/site";

const trustPoints = [
  {
    icon: CheckCircle2,
    title: "No ads, no data selling",
    body: "Core invoicing stays free. We do not run ads or sell your client and invoice data.",
  },
  {
    icon: Shield,
    title: "No feature paywall on essentials",
    body: "Create invoices, export PDFs with the Classic template, print, and use cloud history without a subscription.",
  },
  {
    icon: Heart,
    title: "Optional support keeps it running",
    body: "Voluntary Ko-fi tips and optional premium template unlocks help fund hosting and improvements — never required to invoice professionally.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent optional costs",
    body: "Premium layouts are a one-time unlock per template when checkout is available. You can always use Classic at $0.",
  },
] as const;

export function PricingTrustSection() {
  return (
    <section
      className="mt-12 rounded-2xl border border-border/50 bg-card/50 p-8 md:p-10"
      aria-labelledby="pricing-trust-heading"
    >
      <h2 id="pricing-trust-heading" className="text-2xl font-bold">
        How is {siteConfig.name} free? What&apos;s the catch?
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
        There is no catch on everyday invoicing. We built a focused freelancer
        tool and keep the core product open so you can bill clients without
        signing up for expensive accounting software.
      </p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {trustPoints.map((point) => (
          <li key={point.title} className="flex gap-3">
            <point.icon
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <div>
              <p className="font-semibold text-foreground">{point.title}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {point.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
