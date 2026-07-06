import {
  FileText,
  History,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react";
import { siteConfig } from "@/data/site";

export const navItems = [
  {
    titleKey: "nav.dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "nav.createInvoice",
    href: "/create-invoice",
    icon: PlusCircle,
  },
  {
    titleKey: "nav.invoiceHistory",
    href: "/invoice-history",
    icon: History,
  },
  {
    titleKey: "nav.customers",
    href: "/customers",
    icon: Users,
  },
  {
    titleKey: "nav.settings",
    href: "/settings",
    icon: Settings,
  },
] as const;

export const brand = {
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  url: siteConfig.url,
  icon: FileText,
};
