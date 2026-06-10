import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

type ConversionLandingHeroProps = {
  title: ReactNode;
  summary: string;
  badge?: string;
};

export function ConversionLandingHero({
  title,
  summary,
  badge = "No signup required to build & download PDFs",
}: ConversionLandingHeroProps) {
  return (
    <header className="py-10 text-center md:py-14" aria-labelledby="hero-heading">
      <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" aria-hidden />
        {badge}
      </div>
      <h1
        id="hero-heading"
        className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
      >
        {title}
      </h1>
      <p className="seo-hero-summary geo-page-summary mx-auto mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed">
        {summary}
      </p>
    </header>
  );
}
