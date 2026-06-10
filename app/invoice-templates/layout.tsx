import { PublicPageShell } from "@/components/public-page-shell";
export const revalidate = 86400;

export default function InvoiceTemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
