import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { razorpayIntegrationGuide } from "@/data/razorpay-integration-guide";
import { isRazorpayEnabled } from "@/lib/razorpay-feature";
import { getAuthenticatedRazorpayAccess } from "@/lib/razorpay-access";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Razorpay integration",
  robots: { index: false, follow: false },
};

export default async function RazorpayIntegrationPage() {
  if (!isRazorpayEnabled()) notFound();

  const access = await getAuthenticatedRazorpayAccess();
  if (!access.userFacing) notFound();

  const guide = razorpayIntegrationGuide;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{guide.title}</h1>
      <p className="mt-3 text-muted-foreground">{guide.description}</p>
      <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
        Internal owner preview — Razorpay is not enabled for app users yet.
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="text-lg font-semibold">{guide.merchantApp.heading}</h2>
        <p className="text-sm text-muted-foreground">{guide.merchantApp.note}</p>
        <dl className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <div className="flex justify-between gap-4 py-1">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-mono">{guide.merchantApp.email}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-lg font-semibold">{guide.razorpayDashboard.heading}</h2>
        <p className="text-sm text-muted-foreground">
          Key ID example:{" "}
          <code className="rounded bg-muted px-1">{guide.razorpayDashboard.keyIdExample}</code>
        </p>
        <p className="text-sm text-muted-foreground">
          {guide.razorpayDashboard.keySecretNote}
        </p>
        <p className="text-sm">
          Webhook URL:{" "}
          <code className="rounded bg-muted px-1">
            {siteConfig.url}
            {guide.razorpayDashboard.webhookUrl}
          </code>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Checkout flow</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          {guide.checkoutFlow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
