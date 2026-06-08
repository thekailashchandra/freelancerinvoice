"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  gradient: string;
}

function formatValue(
  value: number,
  prefix: string,
  suffix: string,
  decimals: number
) {
  const formatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
  return `${prefix}${formatted}${suffix}`;
}

export function AnalyticsCard({
  title,
  value,
  icon: Icon,
  prefix = "",
  suffix = "",
  decimals = 0,
  gradient,
}: AnalyticsCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">
              {title}
            </p>
            <p className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              {formatValue(value, prefix, suffix, decimals)}
            </p>
          </div>
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br sm:h-10 sm:w-10",
              gradient
            )}
          >
            <Icon className="h-4 w-4 text-white sm:h-[18px] sm:w-[18px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
