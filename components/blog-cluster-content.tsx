import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogCluster } from "@/data/blog-clusters";
import { getClusterArticles } from "@/data/blog-clusters";
import { PageFaqSection } from "@/components/page-faq-section";
import { formatDate } from "@/lib/utils";

type BlogClusterContentProps = {
  cluster: BlogCluster;
};

export function BlogClusterContent({ cluster }: BlogClusterContentProps) {
  const articles = getClusterArticles(cluster);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{cluster.title}</span>
      </nav>

      <header className="mt-6">
        <p className="text-sm font-medium text-primary">Topic cluster</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {cluster.title}
        </h1>
        <p className="geo-page-summary mt-4 text-lg text-muted-foreground leading-relaxed">
          {cluster.description}
        </p>
      </header>

      <section className="mt-12" aria-labelledby="cluster-articles-heading">
        <h2 id="cluster-articles-heading" className="text-xl font-bold">
          Articles in this cluster
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
              <p className="mt-3 text-xs text-muted-foreground">
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
              </p>
              <Link
                href={`/blog/${article.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Read article
                <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <PageFaqSection faqItems={cluster.faqItems} />

      <nav className="mt-10 text-sm">
        <Link href="/blog" className="text-primary hover:underline">
          ← All blog articles
        </Link>
      </nav>
    </main>
  );
}
