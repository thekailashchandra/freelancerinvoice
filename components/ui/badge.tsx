import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/15 text-destructive",
        outline: "text-foreground",
        draft: "border-slate-500/30 bg-slate-500/15 text-slate-400",
        paid: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
        pending: "border-primary/40 bg-primary/20 text-foreground",
        sent: "border-blue-500/30 bg-blue-500/15 text-blue-400",
        overdue: "border-red-500/30 bg-red-500/15 text-red-400",
        void: "border-zinc-500/30 bg-zinc-500/15 text-zinc-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
