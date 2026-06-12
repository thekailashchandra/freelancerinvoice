import { Suspense } from "react";
import { CreateInvoiceClient } from "./create-invoice-client";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchClients } from "@/lib/clients-repository";
import { fetchInvoiceById } from "@/lib/invoice-repository";
import { fetchProfile } from "@/lib/profile-repository";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function CreateInvoicePage({ searchParams }: PageProps) {
  const { id: editId } = await searchParams;

  const [initialSettings, initialInvoice, initialClients] = await Promise.all([
    fetchProfile(),
    editId ? fetchInvoiceById(editId) : Promise.resolve(null),
    fetchClients(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="@container mx-auto w-full max-w-[1600px]">
          <div className="flex flex-col gap-5 @min-[680px]:grid @min-[680px]:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] @min-[680px]:gap-6">
            <Skeleton className="h-[600px] rounded-2xl" />
            <Skeleton className="h-[600px] rounded-2xl" />
          </div>
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
