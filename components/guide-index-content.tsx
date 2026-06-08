import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { guideArticles } from "@/data/guides";
import { siteConfig } from "@/data/site";
import { formatDate } from "@/lib/utils";

export function GuideIndexContent() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-primary">Freelancer Guide</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
          Invoicing, billing, and tax guides for freelancers
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Practical articles from {siteConfig.name} on international billing,
          freelance taxes, payment terms, GST invoicing, and professional
          invoice formatting. Written for independent contractors who want to
          get paid faster and stay organized.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {guideArticles.map((article) => (
          <article
            key={article.slug}
            className="glass flex flex-col rounded-2xl border border-border/50 p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {article.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-snug">
              <Link
                href={`/guide/${article.slug}`}
                className="hover:text-primary"
              >
                {article.title}
              </Link>
            </h2>
            <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
              {article.description}
            </p>
            <div className="mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {article.readingTimeMinutes} min read
              </span>
            </div>
            <Link
              href={`/guide/${article.slug}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Read article
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
