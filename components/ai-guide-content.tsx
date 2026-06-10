import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { AiGuide } from "@/data/ai-guides";
import { GeoDirectAnswer } from "@/components/geo-direct-answer";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type AiGuideContentProps = {
  guide: AiGuide;
};

export function AiGuideContent({ guide }: AiGuideContentProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/guide" className="hover:text-foreground hover:underline">
          Guide
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{guide.category}</span>
      </nav>

      <header className="mt-6">
        <p className="text-sm font-medium text-primary">{guide.category}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {guide.title}
        </h1>
        <GeoDirectAnswer answer={guide.summary} />
        <p className="geo-page-summary mt-4 text-lg text-muted-foreground leading-relaxed">
          {guide.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={guide.publishedAt}>
            {formatDate(guide.publishedAt)}
          </time>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden />
            {guide.readingTimeMinutes} min read
          </span>
        </div>
      </header>

      <section
        id="core-steps"
        className="ai-content-core mt-10 scroll-mt-24"
        aria-labelledby="steps-heading"
      >
        <h2 id="steps-heading" className="text-2xl font-bold tracking-tight">
          Step-by-step: create your invoice
        </h2>
        <ol className="ai-content-steps mt-6 space-y-6">
          {guide.steps.map((step) => (
            <li
              key={step.step}
              id={`step-${step.step}`}
              className="scroll-mt-24 rounded-2xl border border-border/50 bg-card/50 p-6"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                  aria-hidden
                >
                  {step.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  {step.items ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {step.items.map((item) => (
                        <li key={item.slice(0, 40)}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-14">
        <h2
          id="contextual-architecture"
          className="text-2xl font-bold tracking-tight"
        >
          Contextual architecture
        </h2>

        <section
          className="mt-8"
          aria-labelledby="definitions-heading"
        >
          <h3 id="definitions-heading" className="text-xl font-semibold tracking-tight">
            Definitions
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Key terms for Indian freelance invoicing — GST, SAC, UPI, export, TDS, and more.
          </p>
          <dl className="geo-key-facts mt-6 space-y-5 rounded-2xl border border-border/50 bg-card/50 p-6">
            {guide.definitions.map((item) => (
              <div key={item.term}>
                <dt className="font-semibold text-foreground">{item.term}</dt>
                <dd className="geo-fact-answer mt-1 text-sm text-muted-foreground leading-relaxed">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {guide.tables.map((table) => (
          <section
            key={table.id}
            className="mt-10"
            aria-labelledby={`table-${table.id}`}
          >
            <h3
              id={`table-${table.id}`}
              className="text-xl font-semibold tracking-tight"
            >
              {table.caption}
            </h3>
            <div className="ai-content-table mt-4 overflow-x-auto rounded-xl border border-border/50">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <caption className="sr-only">{table.caption}</caption>
                <thead className="border-b border-border/50 bg-muted/50">
                  <tr>
                    {table.headers.map((header) => (
                      <th key={header} className="px-4 py-3 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr
                      key={row.join("-").slice(0, 48)}
                      className="border-b border-border/30 last:border-0"
                    >
                      {row.map((cell) => (
                        <td
                          key={cell.slice(0, 32)}
                          className="px-4 py-3 text-muted-foreground align-top"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {guide.comparisons.map((comparison) => (
          <section
            key={comparison.id}
            className="mt-10"
            aria-labelledby={`comparison-${comparison.id}`}
          >
            <h3
              id={`comparison-${comparison.id}`}
              className="text-xl font-semibold tracking-tight"
            >
              {comparison.caption}
            </h3>
            <div className="ai-content-table mt-4 overflow-x-auto rounded-xl border border-border/50">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <caption className="sr-only">{comparison.caption}</caption>
                <thead className="border-b border-border/50 bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Aspect</th>
                    <th className="px-4 py-3 font-semibold">
                      {comparison.leftLabel}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {comparison.rightLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row) => (
                    <tr
                      key={row.aspect}
                      className="border-b border-border/30 last:border-0"
                    >
                      <th className="px-4 py-3 font-medium text-foreground">
                        {row.aspect}
                      </th>
                      <td className="px-4 py-3 text-muted-foreground align-top">
                        {row.left}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground align-top">
                        {row.right}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      {/* FAQ */}
      <section
        id="guide-faq"
        className="mt-14 scroll-mt-24"
        aria-labelledby="guide-faq-heading"
      >
        <h2 id="guide-faq-heading" className="text-2xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-4">
          {guide.faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-border/50 bg-card/50 p-5"
            >
              <summary className="cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="faq-answer mt-3 text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 text-center">
        <h2 className="text-xl font-semibold">Create your India invoice free</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          {siteConfig.name} supports INR, UPI, GST fields, and PDF export for
          Indian freelancers.
        </p>
        <Button className="mt-5 gap-2" asChild>
          <Link href="/signup">
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Related links */}
      <aside className="mt-12 border-t border-border/50 pt-10">
        <h2 className="text-lg font-semibold">Related resources</h2>
        <ul className="mt-4 space-y-3">
          {guide.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-primary hover:underline"
              >
                {link.label}
              </Link>
              {link.description && (
                <p className="text-xs text-muted-foreground">{link.description}</p>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
