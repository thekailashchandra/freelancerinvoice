import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { TemplatePage } from "@/data/template-pages";
import {
  getRelatedTemplatePages,
  templatePages,
} from "@/data/template-pages";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type TemplatePageContentProps = {
  page: TemplatePage;
};

export function TemplatePageContent({ page }: TemplatePageContentProps) {
  const related = getRelatedTemplatePages(page);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/features" className="hover:text-foreground hover:underline">
          Features
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{page.category}</span>
      </nav>

      <header className="mt-6">
        <p className="text-sm font-medium text-primary">{page.category}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {page.title}
        </h1>
        <p className="geo-page-summary mt-4 text-lg text-muted-foreground leading-relaxed">
          {page.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={page.publishedAt}>{formatDate(page.publishedAt)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden />
            {page.readingTimeMinutes} min read
          </span>
        </div>
      </header>

      <nav
        className="mt-10 rounded-xl border border-border/50 bg-card/50 p-5"
        aria-label="Table of contents"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          On this page
        </h2>
        <ol className="mt-3 space-y-2 text-sm">
          {page.sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-foreground hover:text-primary hover:underline"
              >
                {index + 1}. {section.heading}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#template-faq"
              className="text-foreground hover:text-primary hover:underline"
            >
              {page.sections.length + 1}. Frequently asked questions
            </a>
          </li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {page.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              {section.heading}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground leading-relaxed">
                {section.list.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ul>
            )}
            {section.note && (
              <p className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                {section.note}
              </p>
            )}
          </section>
        ))}
      </div>

      <section
        id="template-faq"
        className="mt-14 scroll-mt-24"
        aria-labelledby="template-faq-heading"
      >
        <h2
          id="template-faq-heading"
          className="text-2xl font-bold tracking-tight"
        >
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-4">
          {page.faqItems.map((item) => (
            <details
              key={item.question}
              className="group glass rounded-xl border border-border/50 p-5"
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

      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 text-center">
        <h2 className="text-xl font-semibold">Create this invoice free</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
          Use {siteConfig.name} to build a professional invoice with live
          preview, your logo, PDF export, and cloud history.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button className="gap-2" asChild>
            <Link href="/signup">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </div>

      {related.length > 0 && (
        <aside className="mt-12 border-t border-border/50 pt-10">
          <h2 className="text-lg font-semibold">Related invoice templates</h2>
          <ul className="mt-4 space-y-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/${item.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <aside className="mt-12 border-t border-border/50 pt-10">
        <h2 className="text-lg font-semibold">All invoice templates</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {templatePages.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/${item.slug}`}
                className={`text-sm hover:text-primary hover:underline ${
                  item.slug === page.slug
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                }`}
                aria-current={item.slug === page.slug ? "page" : undefined}
              >
                {item.title.split(" — ")[0]}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <aside className="mt-10 rounded-xl border border-border/50 bg-card/50 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          More resources
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/guide" className="text-primary hover:underline">
              Freelancer billing guides
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-primary hover:underline">
              Invoicing blog
            </Link>
          </li>
          <li>
            <Link href="/features" className="text-primary hover:underline">
              All product features
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-primary hover:underline">
              Contact support
            </Link>
          </li>
        </ul>
      </aside>
    </article>
  );
}
