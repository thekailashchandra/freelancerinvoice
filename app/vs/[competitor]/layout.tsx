import { PublicPageShell } from "@/components/public-page-shell";

export default function ComparisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
