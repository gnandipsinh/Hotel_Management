import * as React from "react";
import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface RevenueCardProps extends React.HTMLAttributes<HTMLDivElement> {
  totalRevenue: number;
  currencySymbol?: string;
  adr: number; // Average Daily Rate
  revPar: number; // Revenue Per Available Room
  changePercentage?: number;
  periodLabel?: string;
}

export function RevenueCard({
  totalRevenue,
  currencySymbol = "₹",
  adr,
  revPar,
  changePercentage = 12.4,
  periodLabel = "vs. last week",
  className,
  ...props
}: RevenueCardProps) {
  const isPositive = changePercentage >= 0;

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card p-5 shadow-xs sm:p-6",
        className,
      )}
      {...props}
    >
      <CardHeader className="p-0 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Room & F&B Revenue
          </span>
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="size-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-mono">
            {currencySymbol}
            {totalRevenue.toLocaleString()}
          </CardTitle>
          {typeof changePercentage === "number" && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-semibold",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {Math.abs(changePercentage)}%
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">{periodLabel}</p>
      </CardHeader>

      <CardContent className="p-0 pt-3 border-t border-border/50">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">ADR (Avg Daily Rate)</span>
            <p className="text-sm font-semibold text-foreground font-mono">
              {currencySymbol}
              {adr.toLocaleString()}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">RevPAR</span>
            <p className="text-sm font-semibold text-foreground font-mono">
              {currencySymbol}
              {revPar.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
