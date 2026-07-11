import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { TopicalPillar } from "@/data/topical-pillars";
import { getPillarArticles, topicalAuthorityHub } from "@/data/topical-pillars";
import { PageFaqSection } from "@/components/page-faq-section";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PillarHubContentProps = {
  pillar: TopicalPillar;
};

export function PillarHubContent({ pillar }: PillarHubContentProps) {
  const articles = getPillarArticles(pillar);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/freelance-finances" className="hover:underline">
          {topicalAuthorityHub.title}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{pillar.shortTitle}</span>
      </nav>

      <header className="mt-6">
        <p className="text-sm font-medium text-primary">Pillar</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {pillar.title}
        </h1>
        <p className="geo-page-summary mt-4 text-lg text-muted-foreground leading-relaxed">
          {pillar.description}
        </p>
      </header>

      <section className="mt-12" aria-labelledby="pillar-topics-heading">
        <h2 id="pillar-topics-heading" className="text-xl font-bold">
          Core topics
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {pillar.topics.map((topic) => (
            <li key={topic.slug}>
              <article className="h-full rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="font-semibold">
                  <Link
                    href={`/blog/${topic.articleSlug}`}
                    className="hover:text-primary"
                  >
                    {topic.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {topic.description}
                </p>
                <Link
                  href={`/blog/${topic.articleSlug}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="pillar-articles-heading">
        <h2 id="pillar-articles-heading" className="text-xl font-bold">
          All articles in this pillar
        </h2>
        <ul className="mt-6 space-y-6">
          {articles.map((article) => (
            <li
              key={article.slug}
              className="rounded-2xl border border-border/50 bg-card/50 p-6"
            >
              <p className="text-xs font-medium uppercase text-primary">
                {article.category}
              </p>
              <h3 className="mt-2 text-lg font-semibold">
                <Link
                  href={`/blog/${article.slug}`}
                  className="hover:text-primary"
                >
                  {article.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {article.description}
              </p>
              <p className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {article.readingTimeMinutes} min
                </span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="pillar-tools-heading">
        <h2 id="pillar-tools-heading" className="text-lg font-semibold">
          Related tools
        </h2>
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          {pillar.relatedProductLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-primary hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Button className="mt-6 gap-2" asChild>
          <Link href="/signup">
            Start invoicing free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      <PageFaqSection faqItems={pillar.faqItems} includeSchema={false} />

      <nav className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href="/freelance-finances" className="text-primary hover:underline">
          ← All pillars
        </Link>
        <Link href="/blog" className="text-muted-foreground hover:underline">
          Blog index
        </Link>
      </nav>
    </main>
  );
}
