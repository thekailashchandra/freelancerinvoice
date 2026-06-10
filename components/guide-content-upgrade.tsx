import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import type { GuideContentUpgrade } from "@/data/guides";
import { Button } from "@/components/ui/button";

type GuideContentUpgradeProps = {
  upgrade: GuideContentUpgrade;
};

export function GuideContentUpgradeBlock({ upgrade }: GuideContentUpgradeProps) {
  return (
    <aside
      className="my-10 rounded-2xl border border-primary/25 bg-primary/5 p-6 md:p-8"
      aria-labelledby="content-upgrade-heading"
    >
      <div className="flex items-start gap-3">
        <FileText className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Free template
          </p>
          <h2 id="content-upgrade-heading" className="mt-1 text-lg font-bold">
            {upgrade.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {upgrade.description}
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border/50 bg-background/80 p-4 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
            {upgrade.items.join("\n")}
          </pre>
          {upgrade.ctaHref && upgrade.ctaLabel && (
            <Button className="mt-5 gap-2" size="sm" asChild>
              <Link href={upgrade.ctaHref}>
                {upgrade.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
