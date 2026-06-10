import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { HubCluster } from "@/data/hub-clusters";
import { getHubClusterPath } from "@/data/hub-clusters";

type HubClusterSpokeNavProps = {
  cluster: HubCluster;
  /** When set, highlights the active spoke article slug. */
  activeArticleSlug?: string;
  variant?: "hub" | "spoke";
};

export function HubClusterSpokeNav({
  cluster,
  activeArticleSlug,
  variant = "spoke",
}: HubClusterSpokeNavProps) {
  const hubPath = getHubClusterPath(cluster);

  return (
    <nav
      className="rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6"
      aria-label="Hub and spoke guides"
    >
      <div className="flex items-start gap-3">
        <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {variant === "hub" ? "Hub & spoke cluster" : "Part of this guide"}
          </p>
          {variant === "spoke" && (
            <p className="mt-1 text-sm">
              <Link href={hubPath} className="font-semibold hover:text-primary hover:underline">
                {cluster.title}
              </Link>
            </p>
          )}
          {variant === "hub" && (
            <p className="mt-1 text-sm font-semibold">{cluster.title}</p>
          )}
          <ol className="mt-4 space-y-2">
            {cluster.spokes.map((spoke, index) => {
              const isActive = spoke.articleSlug === activeArticleSlug;
              return (
                <li key={spoke.slug}>
                  <Link
                    href={`/blog/${spoke.articleSlug}`}
                    className={`flex items-start gap-2 text-sm leading-snug ${
                      isActive
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground hover:text-primary hover:underline"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="shrink-0 text-primary">{index + 1}.</span>
                    <span>{spoke.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
          {variant === "spoke" && (
            <Link
              href={hubPath}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Read the full hub guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
