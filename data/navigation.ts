import {
  FileText,
  History,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Create Invoice",
    href: "/create",
    icon: PlusCircle,
  },
  {
    title: "Invoice History",
    href: "/history",
    icon: History,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
] as const;

export const brand = {
  name: "InvoiceFlow",
  tagline: "Freelancer Invoice Generator",
  icon: FileText,
};
