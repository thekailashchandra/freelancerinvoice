import { PublicPageShell } from "@/components/public-page-shell";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
