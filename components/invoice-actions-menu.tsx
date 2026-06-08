"use client";

import Link from "next/link";
import {
  Ban,
  CheckCircle2,
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { invoiceActionState } from "@/lib/invoice-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoiceActionsMenuProps {
  invoice: Invoice;
  displayStatus: InvoiceStatus;
  busyAction?: "paid" | "void" | "delete" | null;
  onMarkPaid?: (id: string) => void | Promise<void>;
  onVoid?: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

export function InvoiceActionsMenu({
  invoice,
  displayStatus,
  busyAction = null,
  onMarkPaid,
  onVoid,
  onDelete,
}: InvoiceActionsMenuProps) {
  const { canEdit, canMarkPaid, canVoid } = invoiceActionState(displayStatus);
  const isBusy = busyAction !== null;

  const handleDelete = () => {
    const label = invoice.invoice.invoiceNumber || "this invoice";
    if (
      !window.confirm(
        `Delete ${label}? This cannot be undone.`
      )
    ) {
      return;
    }
    void onDelete(invoice.id);
  };

  const handleVoid = () => {
    const label = invoice.invoice.invoiceNumber || "this invoice";
    if (
      !window.confirm(
        `Void ${label}? It will be marked cancelled and locked from editing.`
      )
    ) {
      return;
    }
    void onVoid?.(invoice.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={isBusy}
          aria-label="Invoice actions"
        >
          {isBusy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href={`/invoice-history/${invoice.id}`}>
            <Eye />
            View
          </Link>
        </DropdownMenuItem>

        {canEdit && (
          <DropdownMenuItem asChild>
            <Link href={`/create-invoice?id=${invoice.id}`}>
              <Pencil />
              Edit
            </Link>
          </DropdownMenuItem>
        )}

        {canMarkPaid && onMarkPaid && (
          <DropdownMenuItem
            onClick={() => void onMarkPaid(invoice.id)}
            disabled={busyAction === "paid"}
          >
            <CheckCircle2 className="text-emerald-600" />
            Mark as paid
          </DropdownMenuItem>
        )}

        {canVoid && onVoid && (
          <DropdownMenuItem
            onClick={handleVoid}
            disabled={busyAction === "void"}
          >
            <Ban />
            Void invoice
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          disabled={busyAction === "delete"}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
