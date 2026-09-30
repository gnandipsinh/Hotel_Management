import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  compact?: boolean;
  className?: string;
}

/**
 * Empty state used by every data section, e.g. "No bookings yet".
 */
export function EmptyState({
  icon: Icon = InboxIcon,
  title = "No records yet",
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center",
        compact ? "px-4 py-8" : "px-6 py-14",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold">{title}</p>
      {description && (
        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <Button
          type="button"
          size="sm"
          className="mt-1.5"
          onClick={action.onClick}
          asChild={Boolean(action.href)}
        >
          {action.href ? <Link href={action.href}>{action.label}</Link> : action.label}
        </Button>
      )}
    </div>
  );
}
