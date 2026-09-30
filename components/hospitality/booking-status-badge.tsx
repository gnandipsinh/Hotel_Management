import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type BookingStatus =
  | "confirmed"
  | "checkedIn"
  | "checkedOut"
  | "pending"
  | "cancelled"
  | "noShow";

interface BookingStatusConfig {
  label: string;
  badgeClass: string;
}

const BOOKING_STATUS_CONFIG: Record<BookingStatus, BookingStatusConfig> = {
  confirmed: {
    label: "Confirmed",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  checkedIn: {
    label: "Checked In",
    badgeClass: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20",
  },
  checkedOut: {
    label: "Checked Out",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
  noShow: {
    label: "No Show",
    badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  },
};

export interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({
  status,
  className,
}: BookingStatusBadgeProps) {
  const config = BOOKING_STATUS_CONFIG[status] || BOOKING_STATUS_CONFIG.confirmed;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        config.badgeClass,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
