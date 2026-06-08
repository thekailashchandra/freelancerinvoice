import { PublicPageShell } from "@/components/public-page-shell";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
