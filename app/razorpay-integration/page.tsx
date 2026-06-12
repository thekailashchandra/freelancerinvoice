import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { razorpayIntegrationGuide } from "@/data/razorpay-integration-guide";
import { isRazorpayEnabled } from "@/lib/razorpay-feature";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Razorpay live integration",
  description:
    "Live Razorpay checkout flow, webhook URL, and order mapping for Invoice for Freelance.",
  robots: { index: false, follow: false },
};

export default function RazorpayIntegrationPage() {
  if (!isRazorpayEnabled()) notFound();

  const guide = razorpayIntegrationGuide;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{guide.title}</h1>
      <p className="mt-3 text-muted-foreground">{guide.description}</p>

      <section className="mt-10 space-y-3 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">{guide.merchantApp.heading}</h2>
        <dl className="grid gap-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-muted-foreground">Email</dt>
            <dd className="font-mono">{guide.merchantApp.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-muted-foreground">Password</dt>
            <dd className="font-mono">{guide.merchantApp.password}</dd>
          </div>
        </dl>
        <p className="text-xs text-muted-foreground">{guide.merchantApp.note}</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/login">Sign in to app</Link>
        </Button>
      </section>

      <section className="mt-8 space-y-3 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">{guide.razorpayDashboard.heading}</h2>
        <p className="text-sm text-muted-foreground">
          Key ID example:{" "}
          <code className="rounded bg-muted px-1">{guide.razorpayDashboard.keyIdExample}</code>
        </p>
        <p className="text-sm text-muted-foreground">
          {guide.razorpayDashboard.keySecretNote}
        </p>
        <p className="text-sm text-muted-foreground">
          Webhook URL:{" "}
          <code className="rounded bg-muted px-1">
            {siteConfig.url}
            {guide.razorpayDashboard.webhookUrl}
          </code>
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/settings">Open Settings</Link>
        </Button>
      </section>

      <section className="mt-8 space-y-3 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Checkout flow</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          {guide.checkoutFlow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-8 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        <h2 className="font-semibold text-foreground">Order mapping</h2>
        <p className="mt-2">
          Receipt prefix:{" "}
          <code className="rounded bg-muted px-1">{guide.orderMapping.receiptPrefix}</code>
        </p>
        <p className="mt-1">
          Notes stored on each order: {guide.orderMapping.notesFields.join(", ")}
        </p>
        <p className="mt-3">
          Client payment URL:{" "}
          <code className="rounded bg-muted px-1">
            {siteConfig.url}
            {guide.samplePayPath}
          </code>
        </p>
      </section>
    </main>
  );
}
