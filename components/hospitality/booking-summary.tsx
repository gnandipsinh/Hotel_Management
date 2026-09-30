import * as React from "react";
import { Calendar, CreditCard, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge, type BookingStatus } from "@/components/hospitality/booking-status-badge";
import { cn } from "@/lib/utils";

export interface BookingSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  reservationId: string;
  guestName: string;
  roomNumber: string;
  roomCategory: string;
  checkInDate: string;
  checkOutDate: string;
  nightsCount: number;
  totalAmount: number;
  currencySymbol?: string;
  status: BookingStatus;
  onViewDetails?: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function BookingSummary({
  reservationId,
  guestName,
  roomNumber,
  roomCategory,
  checkInDate,
  checkOutDate,
  nightsCount,
  totalAmount,
  currencySymbol = "₹",
  status,
  onViewDetails,
  onAction,
  actionLabel = "View Folio",
  className,
  ...props
}: BookingSummaryProps) {
  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all hover:border-primary/40 hover:shadow-sm p-4 sm:p-5",
        className,
      )}
      {...props}
    >
      <CardHeader className="p-0 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-muted-foreground uppercase">
                {reservationId}
              </span>
              <BookingStatusBadge status={status} />
            </div>
            <h4 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {guestName}
            </h4>
          </div>
          <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary font-mono">
            Room {roomNumber}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 p-0 py-2 text-xs text-muted-foreground">
        <p className="font-medium text-foreground/80">{roomCategory}</p>

        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5 shrink-0 text-muted-foreground/80" />
          <span>
            {checkInDate} → {checkOutDate} ({nightsCount} {nightsCount === 1 ? "Night" : "Nights"})
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border/50 pt-2 text-xs">
          <span className="text-muted-foreground">Total Bill Amount:</span>
          <span className="font-bold text-foreground font-mono">
            {currencySymbol}
            {totalAmount.toLocaleString()}
          </span>
        </div>
      </CardContent>

      <CardFooter className="mt-2 p-0 pt-2 border-t border-border/50 flex items-center gap-2">
        {onViewDetails && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-1 text-xs h-8"
            onClick={onViewDetails}
          >
            Details
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 text-xs h-8"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
