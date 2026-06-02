import { Suspense } from "react";
import { CreateInvoiceClient } from "./create-invoice-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <Skeleton className="h-[600px] rounded-2xl" />
          <Skeleton className="h-[600px] rounded-2xl" />
        </div>
      }
    >
      <CreateInvoiceClient />
    </Suspense>
  );
}
