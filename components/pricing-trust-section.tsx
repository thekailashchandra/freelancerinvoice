import { CheckCircle2, Server, Shield, Wallet } from "lucide-react";
import { siteConfig } from "@/data/site";

const trustPoints = [
  {
    icon: Server,
    title: "Self-hosting is genuinely free",
    body: "The full source is MIT licensed. Run it on your own server with every feature unlocked and no seat or invoice limits.",
  },
  {
    icon: Wallet,
    title: "Cloud pays for the hosted product",
    body: "The monthly Cloud plan covers hosting, backups, payment processing, and support. Preview the product before you subscribe.",
  },
  {
    icon: Shield,
    title: "No ads and no data selling",
    body: "We do not run ads or sell client and invoice data. Your billing records stay private to your account.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent, cancel-anytime pricing",
    body: "₹299/month or ₹999/year in India, and $5/month or $19/year elsewhere. Each payment covers 30 or 365 days, with no automatic renewal mandate.",
  },
] as const;

export function PricingTrustSection() {
  return (
    <section
      className="mt-12 rounded-2xl border border-border bg-card p-8 md:p-10"
      aria-labelledby="pricing-trust-heading"
    >
      <h2 id="pricing-trust-heading" className="display-serif text-2xl">
        How is {siteConfig.name} sustainable?
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
        The open-source edition is free forever. The hosted Cloud plan exists for
        people who would rather not manage infrastructure - and it keeps the
        public instance running.
      </p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {trustPoints.map((point) => (
          <li key={point.title} className="flex gap-3">
            <point.icon
              className="mt-0.5 h-5 w-5 shrink-0 text-foreground"
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
