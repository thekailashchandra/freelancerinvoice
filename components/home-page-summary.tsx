"use client";

import { siteConfig } from "@/data/site";
import { useTranslation } from "@/components/locale-provider";
import { formatMessage } from "@/lib/i18n/format-message";

/** Homepage-only summary - distinct from the canonical entity statement on /about. */
export function HomePageSummary() {
  const { t } = useTranslation();
  const name = siteConfig.name;

  return (
    <section
      className="rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8"
      aria-labelledby="home-summary-heading"
    >
      <h2 id="home-summary-heading" className="text-xl font-bold tracking-tight">
        {t("landing.homeSummary.title")}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {t("landing.homeSummary.p1")}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {formatMessage(t("landing.homeSummary.p2"), { name })}
      </p>
      <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
        {(["b1", "b2", "b3", "b4"] as const).map((id) => (
          <li key={id} className="flex gap-2">
            <span className="text-primary" aria-hidden>
              •
            </span>
            <span>{t(`landing.homeSummary.${id}`)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
