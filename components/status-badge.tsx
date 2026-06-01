import type { InvoiceStatus } from "@/types/invoice";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const labels: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
};

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={status} className={cn("capitalize", className)}>
      {labels[status]}
    </Badge>
  );
}
