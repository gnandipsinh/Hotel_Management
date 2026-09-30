import * as React from "react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  /** Hide breadcrumbs (e.g. when a section renders its own). */
  hideBreadcrumbs?: boolean;
  className?: string;
}

/**
 * Standard page header: breadcrumbs, title, description and actions.
 * Every module page should use this for a consistent hierarchy.
 */
export function PageHeader({
  title,
  description,
  actions,
  hideBreadcrumbs = false,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {!hideBreadcrumbs && (
        <div className="hidden md:block">
          <Breadcrumbs />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
