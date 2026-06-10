import { PublicPageShell } from "@/components/public-page-shell";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
