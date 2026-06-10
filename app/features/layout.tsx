import { PublicPageShell } from "@/components/public-page-shell";

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
