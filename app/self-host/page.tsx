import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Github, Server, Terminal } from "lucide-react";
import { PublicPageShell } from "@/components/public-page-shell";
import { Button } from "@/components/ui/button";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Self-host for free";
const description =
  "Run Invoice for Freelance on your own server with every feature unlocked. Open source, MIT licensed, and free forever.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/self-host") },
  ...buildSocialMetadata({ title, description, path: "/self-host" }),
};

const STEPS = [
  {
    title: "Clone the repository",
    body: "Get the source onto your machine or server.",
    code: `git clone ${siteConfig.githubUrl || "<repository-url>"}
cd invoice-for-freelance
npm install`,
  },
  {
    title: "Connect Supabase",
    body: "Create a Supabase project, then copy the publishable and secret keys into .env.local.",
    code: `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...`,
  },
  {
    title: "Run the migrations",
    body: "Apply every SQL file in supabase/migrations in order, including 018_cloud_subscription.sql, 019_brand_color.sql, 020_invoice_template.sql, 021_invoice_additional_charges.sql, and 022_subscription_provider.sql.",
    code: `supabase db push
# or paste the files into the Supabase SQL editor`,
  },
  {
    title: "Disable cloud billing",
    body: "One flag unlocks PDF export, printing, receipts, and every template.",
    code: `NEXT_PUBLIC_SELF_HOSTED=true`,
  },
] as const;

export default function SelfHostPage() {
  return (
    <PublicPageShell>
      <div className="mx-auto max-w-5xl px-6 py-14 md:px-8 md:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="eyebrow text-muted-foreground">Self-hosted edition</p>
            <h1 className="display-serif mt-4 text-4xl leading-[1.02] sm:text-5xl">
              Your invoices.
              <br />
              Your server.
              <br />
              No subscription.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              The same codebase that powers our Cloud runs on your infrastructure
              with billing disabled. Every feature, no invoice limits, no seat
              limits, MIT licensed.
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              {[
                "PDF download and printing included",
                "Every invoice template included",
                "Your Supabase database and storage",
                "No license fee or recurring charge",
                "Community-supported and forkable",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {siteConfig.githubUrl ? (
                <Button asChild size="lg" className="gap-2">
                  <a
                    href={siteConfig.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    View the repository
                  </a>
                </Button>
              ) : null}
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/pricing">
                  Compare with Cloud
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" aria-hidden />
              <p className="eyebrow text-[9px] text-muted-foreground">
                Four steps
              </p>
            </div>
            <ol className="mt-6 space-y-7">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[10px]">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                      <pre className="mt-3 overflow-x-auto rounded-lg bg-foreground p-3 font-mono text-[10px] leading-relaxed text-background">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex items-center gap-1.5 border-t border-border pt-4 text-[11px] text-muted-foreground">
              <Terminal className="h-3.5 w-3.5" aria-hidden />
              Need details? Read docs/SELF_HOSTING.md in the repository.
            </p>
          </aside>
        </div>

        <section className="mt-16 border-t border-border pt-10">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                q: "Do I need Supabase?",
                a: "Yes, for auth, Postgres, and file storage. You can use Supabase Cloud or a self-hosted Supabase instance.",
              },
              {
                q: "Is billing code removed?",
                a: "No - it is disabled by an environment flag. You can enable Razorpay later if you run your own paid cloud.",
              },
              {
                q: "What is the license?",
                a: "MIT. Fork it, modify it, and run it commercially on your own infrastructure.",
              },
            ].map((item) => (
              <div key={item.q}>
                <h2 className="text-sm font-medium">{item.q}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PublicPageShell>
  );
}
