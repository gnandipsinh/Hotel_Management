import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary";

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "border-transparent bg-success/15 text-success",
  warning: "border-transparent bg-warning/20 text-warning-foreground",
  danger: "border-transparent bg-destructive/10 text-destructive",
  info: "border-transparent bg-info/15 text-info",
  neutral: "border-transparent bg-muted text-muted-foreground",
  primary: "border-transparent bg-primary/10 text-primary",
};

/** Canonical status → tone maps (values come from docs/domain-glossary.md). */
export const BOOKING_STATUS_TONES: Record<string, StatusTone> = {
  Confirmed: "success",
  Pending: "warning",
  "Checked-in": "info",
  "Checked-out": "neutral",
  Cancelled: "danger",
  "No-show": "danger",
};

export const ROOM_STATUS_TONES: Record<string, StatusTone> = {
  Available: "success",
  Occupied: "info",
  Reserved: "primary",
  Cleaning: "warning",
  Dirty: "warning",
  Maintenance: "danger",
  "Out of Service": "danger",
};

export function StatusBadge({
  tone = "neutral",
  children,
  className,
  dot = true,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASSES[tone], className)}>
      {dot && (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-current"
        />
      )}
      {children}
    </Badge>
  );
}
