import { PublicPageShell } from "@/components/public-page-shell";
import { MARKETING_ISR_SECONDS } from "@/lib/cache-config";

export const revalidate = MARKETING_ISR_SECONDS;

export default function InvoiceTemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
