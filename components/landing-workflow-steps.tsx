import { Download, Eye, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const defaultSteps: LandingWorkflowStep[] = [
  {
    icon: PenLine,
    title: "Fill in your invoice",
    description:
      "Add your business details, client info, line items, and payment terms in the editable form.",
  },
  {
    icon: Eye,
    title: "Preview updates live",
    description:
      "Watch a professional invoice layout update in real time as you type — no refresh needed.",
  },
  {
    icon: Download,
    title: "Download your PDF",
    description:
      "Generate a client-ready PDF instantly. No signup required to export from the landing page.",
  },
];

export type LandingWorkflowStep = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type LandingWorkflowStepsProps = {
  steps?: LandingWorkflowStep[];
  heading?: string;
  subheading?: string;
};

export function LandingWorkflowSteps({
  steps = defaultSteps,
  heading = "Three steps to a professional invoice",
  subheading = "Start using the tool immediately — most freelancers finish their first PDF in under five minutes.",
}: LandingWorkflowStepsProps) {
  return (
    <section className="py-12" aria-labelledby="workflow-heading">
      <h2
        id="workflow-heading"
        className="text-center text-2xl font-bold tracking-tight md:text-3xl"
      >
        {heading}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
        {subheading}
      </p>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative flex flex-col items-center rounded-2xl border border-border/50 bg-card/50 px-6 py-8 text-center"
          >
            <span
              className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              aria-hidden
            >
              {index + 1}
            </span>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <step.icon className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <h3 className="font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
