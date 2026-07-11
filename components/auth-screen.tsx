"use client";

import Link from "next/link";
import { LocaleCountrySwitcher } from "@/components/locale-country-switcher";
import { SiteLogo } from "@/components/site-logo";
import { CalmLoader } from "@/components/calm-loader";
import { cn } from "@/lib/utils";

function AuthPageBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.9_0.2_98/0.12),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,oklch(0.1_0_0/0.4))]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.99 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.99 0 0 / 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

/** Full-page auth shell — centers card + optional content (e.g. FAQ) together. */
export function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-page relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:py-14">
      <AuthPageBackground />
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <LocaleCountrySwitcher />
      </div>
      <div className="relative z-10 w-full max-w-[400px] space-y-8">{children}</div>
    </div>
  );
}

type AuthScreenProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  loading?: boolean;
  loadingMessage?: string;
  compact?: boolean;
};

export function AuthScreen({
  title,
  description,
  children,
  footer,
  loading = false,
  loadingMessage = "Please wait…",
  compact = false,
}: AuthScreenProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60 bg-card/90 shadow-2xl shadow-black/20 backdrop-blur-md ring-1 ring-white/5",
        compact ? "p-6 sm:p-7" : "p-8 sm:p-9"
      )}
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-background/85 backdrop-blur-sm calm-overlay-enter">
          <CalmLoader message={loadingMessage} size="sm" />
        </div>
      )}

      <div
        className={cn(
          "flex flex-col items-center text-center",
          compact ? "mb-5" : "mb-8"
        )}
      >
        <SiteLogo
          variant="compact"
          href="/"
          className={cn("scale-90 opacity-95", compact ? "mb-4" : "mb-6")}
        />
        <h1
          className={cn(
            "font-semibold tracking-tight text-foreground",
            compact ? "text-lg sm:text-xl" : "text-xl sm:text-[1.35rem]"
          )}
        >
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className={compact ? "space-y-3.5" : "space-y-5"}>{children}</div>

      <div
        className={cn(
          "border-t border-border/50",
          compact ? "mt-5 pt-4" : "mt-8 pt-6"
        )}
      >
        {footer}
      </div>
    </div>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="relative py-0.5">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-border/60" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-card/90 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

export function AuthAlert({
  children,
  variant = "error",
}: {
  children: React.ReactNode;
  variant?: "error" | "info";
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-3.5 py-3 text-sm leading-relaxed",
        variant === "error" &&
          "border-destructive/25 bg-destructive/8 text-destructive",
        variant === "info" &&
          "border-border/60 bg-muted/40 text-muted-foreground"
      )}
    >
      {children}
    </div>
  );
}

export function AuthFooterLinks({
  primary,
  secondary,
}: {
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      <Link
        href={primary.href}
        className="font-medium text-foreground/80 transition-colors hover:text-foreground"
      >
        {primary.label}
      </Link>
      <span className="mx-2 text-border" aria-hidden>
        ·
      </span>
      <Link
        href={secondary.href}
        className="font-medium text-foreground transition-colors hover:text-primary"
      >
        {secondary.label}
      </Link>
    </p>
  );
}
