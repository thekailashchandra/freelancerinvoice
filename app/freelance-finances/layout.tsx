import { PublicPageShell } from "@/components/public-page-shell";

export default function FreelanceFinancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
