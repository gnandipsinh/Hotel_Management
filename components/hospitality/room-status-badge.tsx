import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type RoomStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "cleaning"
  | "maintenance"
  | "outOfService";

interface RoomStatusConfig {
  label: string;
  dotColor: string;
  badgeClass: string;
}

const ROOM_STATUS_CONFIG: Record<RoomStatus, RoomStatusConfig> = {
  available: {
    label: "Available",
    dotColor: "bg-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20",
  },
  occupied: {
    label: "Occupied",
    dotColor: "bg-blue-500",
    badgeClass: "bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20",
  },
  reserved: {
    label: "Reserved",
    dotColor: "bg-amber-500",
    badgeClass: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20",
  },
  cleaning: {
    label: "Cleaning",
    dotColor: "bg-purple-500",
    badgeClass: "bg-purple-500/10 text-purple-800 dark:text-purple-300 border-purple-500/20",
  },
  maintenance: {
    label: "Maintenance",
    dotColor: "bg-rose-500",
    badgeClass: "bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/20",
  },
  outOfService: {
    label: "Out of Order",
    dotColor: "bg-slate-500",
    badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
  },
};

export interface RoomStatusBadgeProps {
  status: RoomStatus;
  showDot?: boolean;
  className?: string;
}

export function RoomStatusBadge({
  status,
  showDot = true,
  className,
}: RoomStatusBadgeProps) {
  const config = ROOM_STATUS_CONFIG[status] || ROOM_STATUS_CONFIG.available;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        config.badgeClass,
        className,
      )}
    >
      {showDot && (
        <span
          className={cn("size-1.5 rounded-full shrink-0", config.dotColor)}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}
