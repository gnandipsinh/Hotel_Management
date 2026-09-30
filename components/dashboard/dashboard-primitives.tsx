import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** 1. Metric Grid — Responsive KPI grid */
export interface MetricGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

export function MetricGrid({
  columns = 4,
  className,
  children,
  ...props
}: MetricGridProps) {
  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn("grid gap-4 sm:gap-5", colClasses[columns], className)}
      {...props}
    >
      {children}
    </div>
  );
}

/** 2. Content Grid — Main dashboard split (e.g. 2/3 main + 1/3 sidebar) */
export interface ContentGridProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "split" | "equal" | "single";
}

export function ContentGrid({
  layout = "split",
  className,
  children,
  ...props
}: ContentGridProps) {
  const layoutClasses = {
    split: "grid-cols-1 lg:grid-cols-3",
    equal: "grid-cols-1 lg:grid-cols-2",
    single: "grid-cols-1",
  };

  return (
    <div
      className={cn("grid gap-6", layoutClasses[layout], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function ContentMain({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-6 lg:col-span-2", className)} {...props} />;
}

export function ContentAside({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-6", className)} {...props} />;
}

/** 3. Chart Container — Premium card container for hospitality analytics */
export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function ChartContainer({
  title,
  subtitle,
  actions,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <Card className={cn("rounded-2xl border bg-card p-5 shadow-xs sm:p-6", className)} {...props}>
      <CardHeader className="p-0 pb-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">{children}</CardContent>
    </Card>
  );
}

/** 4. Activity Section — Wrapper for front desk / operations logs */
export interface ActivitySectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  viewAllAction?: React.ReactNode;
}

export function ActivitySection({
  title,
  viewAllAction,
  className,
  children,
  ...props
}: ActivitySectionProps) {
  return (
    <Card className={cn("rounded-2xl border bg-card p-5 shadow-xs sm:p-6", className)} {...props}>
      <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-foreground">
          {title}
        </CardTitle>
        {viewAllAction}
      </CardHeader>
      <CardContent className="p-0 pt-2">{children}</CardContent>
    </Card>
  );
}

/** 5. Table Section — Wrapper for operational data tables */
export interface TableSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  toolbar?: React.ReactNode;
}

export function TableSection({
  title,
  subtitle,
  toolbar,
  className,
  children,
  ...props
}: TableSectionProps) {
  return (
    <Card className={cn("rounded-2xl border bg-card shadow-xs overflow-hidden", className)} {...props}>
      <CardHeader className="p-5 pb-4 border-b border-border/50">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

/** 6. Sidebar Widget — Compact utility cards for sidebars */
export interface SidebarWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: React.ReactNode;
}

export function SidebarWidget({
  title,
  icon,
  className,
  children,
  ...props
}: SidebarWidgetProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-muted/30 p-4 text-xs space-y-2.5",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 font-semibold text-foreground">
        {icon}
        <span>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}
