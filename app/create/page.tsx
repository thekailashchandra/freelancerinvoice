import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateInvoiceClient } from "./create-invoice-client";

function CreateFallback() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
      <Skeleton className="h-[600px] rounded-2xl" />
      <Skeleton className="h-[600px] rounded-2xl" />
    </div>
  );
}

export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<CreateFallback />}>
      <CreateInvoiceClient />
    </Suspense>
  );
}
