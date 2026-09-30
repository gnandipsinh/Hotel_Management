import type { LucideIcon } from "lucide-react";
import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { KpiMetric, KpiTone } from "@/types/dashboard";

const TONE_ICON_BG: Record<KpiTone, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  danger: "bg-destructive/10 text-destructive",
};

export function KpiCard({ metric, icon: Icon }: { metric: KpiMetric; icon: LucideIcon }) {
  const tone = metric.tone ?? "default";
  const trend = metric.trend;

  return (
    <Card className="gap-0 py-4">
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
          <span
            aria-hidden="true"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              TONE_ICON_BG[tone],
            )}
          >
            <Icon className="size-4" />
          </span>
        </div>

        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          {metric.value}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-[0.6875rem] font-medium",
                trend.direction === "up" && "text-success",
                trend.direction === "down" && "text-destructive",
                trend.direction === "neutral" && "text-muted-foreground",
              )}
            >
              {trend.direction === "up" && <ArrowUpRightIcon className="size-3" aria-hidden="true" />}
              {trend.direction === "down" && <ArrowDownRightIcon className="size-3" aria-hidden="true" />}
              {trend.direction === "neutral" && <MinusIcon className="size-3" aria-hidden="true" />}
              {trend.value}
            </span>
          )}
          {metric.sublabel && (
            <span className="text-[0.6875rem] text-muted-foreground">
              {metric.sublabel}
              {trend ? ` · ${trend.label}` : ""}
            </span>
          )}
          {!metric.sublabel && trend && (
            <span className="text-[0.6875rem] text-muted-foreground">{trend.label}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
