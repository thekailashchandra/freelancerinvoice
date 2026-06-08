import type { InvoiceStatus } from "@/types/invoice";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const labels: Record<InvoiceStatus, string> = {
  draft: "Draft",
  paid: "Paid",
  pending: "Pending",
  sent: "Sent",
  overdue: "Overdue",
  void: "Void",
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
