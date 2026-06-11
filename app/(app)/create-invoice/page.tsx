import { Suspense } from "react";
import { CreateInvoiceClient } from "./create-invoice-client";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchClientsAction } from "@/lib/actions/clients";
import { fetchInvoiceByIdAction } from "@/lib/actions/invoices";
import { fetchProfileAction } from "@/lib/actions/profile";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function CreateInvoicePage({ searchParams }: PageProps) {
  const { id: editId } = await searchParams;

  const [initialSettings, initialInvoice, initialClients] = await Promise.all([
    fetchProfileAction(),
    editId ? fetchInvoiceByIdAction(editId) : Promise.resolve(null),
    fetchClientsAction(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <Skeleton className="h-[600px] rounded-2xl" />
          <Skeleton className="h-[600px] rounded-2xl" />
        </div>
      }
    >
      <CreateInvoiceClient
        editId={editId ?? null}
        initialSettings={initialSettings}
        initialInvoice={initialInvoice}
        initialClients={initialClients}
      />
    </Suspense>
  );
}
