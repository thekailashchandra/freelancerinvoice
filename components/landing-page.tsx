import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  FileText,
  History,
  Shield,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Professional invoices",
    description:
      "Create polished invoices with live preview, your logo, and PDF export.",
  },
  {
    icon: Cloud,
    title: "Cloud sync",
    description:
      "Your invoices and clients are saved securely — access them from anywhere.",
  },
  {
    icon: History,
    title: "History & search",
    description:
      "Track paid, pending, and overdue invoices with powerful filters.",
  },
  {
    icon: Shield,
    title: "Your data, protected",
    description:
      "Row-level security keeps every account isolated in Supabase.",
  },
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-8">
        <SiteLogo variant="full" href="/" priority />
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        <section className="py-16 text-center md:py-24">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            Built for freelancers & agencies
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Invoicing that&apos;s{" "}
            <span className="gradient-text">simple, fast, and cloud-backed</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {siteConfig.name} helps you create beautiful invoices, track payments,
            and manage clients — without spreadsheets or messy PDFs.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2 px-8">
              <Link href="/signup">
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl border border-border/50 p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href={siteConfig.url}
            className="text-foreground hover:underline"
          >
            {siteConfig.name}
          </a>
        </p>
      </footer>
    </div>
  );
}
