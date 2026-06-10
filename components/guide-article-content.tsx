import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { GuideArticle } from "@/data/guides";
import {
  getPillarForArticle,
  getRelatedPillarArticles,
} from "@/data/topical-pillars";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type GuideArticleContentProps = {
  article: GuideArticle;
  /** URL prefix for article links, e.g. "/guide" or "/blog". */
  basePath?: string;
  indexLabel?: string;
};

export function GuideArticleContent({
  article,
  basePath = "/guide",
  indexLabel = "Guide",
}: GuideArticleContentProps) {
  const pillar = getPillarForArticle(article.slug);
  const related = getRelatedPillarArticles(article.slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/freelance-finances"
          className="hover:text-foreground hover:underline"
        >
          Freelance Finances
        </Link>
        <span className="mx-2">/</span>
        {pillar ? (
          <>
            <Link
              href={`/blog/pillar/${pillar.slug}`}
              className="hover:text-foreground hover:underline"
            >
              {pillar.shortTitle}
            </Link>
            <span className="mx-2">/</span>
          </>
        ) : null}
        <Link href={basePath} className="hover:text-foreground hover:underline">
          {indexLabel}
        </Link>
      </nav>

      <header className="mt-6">
        <p className="text-sm font-medium text-primary">{article.category}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {article.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden />
            {article.readingTimeMinutes} min read
          </span>
        </div>
      </header>

      <nav
        className="mt-10 rounded-xl border border-border/50 bg-card/50 p-5"
        aria-label="Table of contents"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          In this guide
        </h2>
        <ol className="mt-3 space-y-2 text-sm">
          {article.sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-foreground hover:text-primary hover:underline"
              >
                {index + 1}. {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {article.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              {section.heading}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
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

      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 text-center">
        <h2 className="text-xl font-semibold">Put this into practice</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
          Create professional freelancer invoices with live preview, PDF export,
          and cloud history using {siteConfig.name}.
        </p>
        <Button className="mt-5 gap-2" asChild>
          <Link href="/signup">
            Create your first invoice
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {related.length > 0 && (
        <aside className="mt-12 border-t border-border/50 pt-10">
          <h2 className="text-lg font-semibold">
            {pillar ? `More in ${pillar.shortTitle}` : "Related articles"}
          </h2>
          <ul className="mt-4 space-y-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`${basePath}/${item.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
