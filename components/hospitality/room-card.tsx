import * as React from "react";
import { BedDouble, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoomStatusBadge, type RoomStatus } from "@/components/hospitality/room-status-badge";
import { cn } from "@/lib/utils";

export interface RoomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  roomNumber: string;
  category: string;
  floor: number;
  status: RoomStatus;
  ratePerNight?: number;
  currencySymbol?: string;
  currentGuest?: string;
  onSelect?: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function RoomCard({
  roomNumber,
  category,
  floor,
  status,
  ratePerNight,
  currencySymbol = "₹",
  currentGuest,
  onSelect,
  onAction,
  actionLabel = "View Room",
  className,
  ...props
}: RoomCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all hover:border-primary/40 hover:shadow-sm cursor-pointer select-none",
        className,
      )}
      {...props}
    >
      <CardHeader className="pb-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground font-mono">
                {roomNumber}
              </span>
              <span className="text-xs text-muted-foreground">Floor {floor}</span>
            </div>
            <p className="text-xs font-medium text-foreground/80 mt-0.5">{category}</p>
          </div>
          <RoomStatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-2 py-2 text-xs">
        {currentGuest ? (
          <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 p-2 text-muted-foreground">
            <User className="size-3.5 shrink-0 text-primary" />
            <span className="truncate font-medium text-foreground">{currentGuest}</span>
          </div>
        ) : (
          <div className="text-[11px] text-muted-foreground italic py-1">
            Vacant · Ready for assignment
          </div>
        )}

        {typeof ratePerNight === "number" && (
          <div className="flex items-center justify-between border-t border-border/40 pt-2 text-xs">
            <span className="text-muted-foreground">Standard Tariff:</span>
            <span className="font-semibold text-foreground">
              {currencySymbol}
              {ratePerNight.toLocaleString()}/night
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-xs h-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onAction?.();
          }}
        >
          <BedDouble className="size-3.5" />
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
