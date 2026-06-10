import type { GuideStep } from "@/data/guides/types";

type GuideStepListProps = {
  steps: GuideStep[];
};

export function GuideStepList({ steps }: GuideStepListProps) {
  return (
    <ol className="ai-content-steps mt-4 space-y-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-4"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
            aria-hidden
          >
            {index + 1}
          </span>
          <div>
            <p className="font-semibold text-foreground">{step.title}</p>
            {step.description ? (
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
