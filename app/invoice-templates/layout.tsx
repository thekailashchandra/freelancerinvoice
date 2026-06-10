import { PublicPageShell } from "@/components/public-page-shell";

export default function InvoiceTemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
