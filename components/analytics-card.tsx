"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/animated-counter";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  gradient: string;
  delay?: number;
}

export function AnalyticsCard({
  title,
  value,
  icon: Icon,
  prefix = "",
  suffix = "",
  decimals = 0,
  gradient,
  delay = 0,
}: AnalyticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="group overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                <AnimatedCounter
                  value={value}
                  prefix={prefix}
                  suffix={suffix}
                  decimals={decimals}
                />
              </p>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                gradient
              )}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div
            className={cn(
              "mt-4 h-1 w-full rounded-full bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity",
              gradient
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
