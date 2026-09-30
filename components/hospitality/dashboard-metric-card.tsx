import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface DashboardMetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    label?: string;
    isPositiveGood?: boolean;
  };
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

export function DashboardMetricCard({
  title,
  value,
  icon,
  change,
  subtitle,
  className,
  ...props
}: DashboardMetricCardProps) {
  const isPositive = change && change.value >= 0;
  const isPositiveGood = change?.isPositiveGood ?? true;
  const isGood = isPositive ? isPositiveGood : !isPositiveGood;

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm sm:p-6",
        className,
      )}
      {...props}
    >
      <CardHeader className="p-0 pb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>
        </div>
        <CardTitle className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-mono">
          {value}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 pt-2 text-xs">
        {change && (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center text-xs font-semibold",
                isGood ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="size-3.5 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="size-3.5 stroke-[2.5]" />
              )}
              {Math.abs(change.value)}%
            </span>
            <span className="text-muted-foreground">
              {change.label || "vs. last week"}
            </span>
          </div>
        )}

        {subtitle && !change && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
