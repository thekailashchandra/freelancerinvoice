"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, MessageSquarePlus, Settings, Shield } from "lucide-react";
import { toast } from "sonner";
import { signOutClient } from "@/lib/api/app-client";
import { useProfile } from "@/hooks/use-profile";
import { useTranslation } from "@/components/locale-provider";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(companyName: string, email: string): string {
  const name = companyName.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return siteConfig.initials;
}

export function UserMenu() {
  const router = useRouter();
  const { settings, loading } = useProfile();
  const { t } = useTranslation();
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/admin/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { isSuperadmin?: boolean }) => {
        if (!cancelled) setIsSuperadmin(Boolean(data.isSuperadmin));
      })
      .catch(() => {
        if (!cancelled) setIsSuperadmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const initials = getInitials(
    settings.companyName,
    settings.companyEmail
  );
  const displayName =
    settings.companyName.trim() || settings.companyEmail || t("userMenu.account");

  const handleSignOut = async () => {
    try {
      await signOutClient();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full p-0 hover:opacity-90"
          aria-label="Account menu"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {loading ? "…" : initials}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate font-medium">{displayName}</p>
          {settings.companyEmail && (
            <p className="truncate text-xs font-normal text-muted-foreground">
              {settings.companyEmail}
            </p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings />
            {t("userMenu.settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/support" className="cursor-pointer">
            <MessageSquarePlus />
            {t("userMenu.support")}
          </Link>
        </DropdownMenuItem>
        {isSuperadmin ? (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield />
              Admin
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => {
            void handleSignOut().catch(() => {
              toast.error(t("userMenu.signOutFailed"));
            });
          }}
        >
          <LogOut />
          {t("userMenu.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
