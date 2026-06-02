import {
  FileText,
  History,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from "lucide-react";
import { siteConfig } from "@/data/site";

export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Invoice",
    href: "/create-invoice",
    icon: PlusCircle,
  },
  {
    title: "Invoice History",
    href: "/invoice-history",
    icon: History,
  },
  {
    title: "Settings",
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
