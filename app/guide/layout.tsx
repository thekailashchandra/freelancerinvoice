import { PublicPageShell } from "@/components/public-page-shell";

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
