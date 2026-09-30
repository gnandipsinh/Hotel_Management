import * as React from "react";
import { BedDouble, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface OccupancyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  occupiedRooms: number;
  totalRooms: number;
  cleaningCount?: number;
  arrivalsToday?: number;
  departuresToday?: number;
}

export function OccupancyCard({
  occupiedRooms,
  totalRooms,
  cleaningCount = 4,
  arrivalsToday = 12,
  departuresToday = 8,
  className,
  ...props
}: OccupancyCardProps) {
  const percentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const availableRooms = Math.max(totalRooms - occupiedRooms, 0);

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
            Property Occupancy
          </span>
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BedDouble className="size-4" />
          </span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-mono">
            {percentage}%
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {occupiedRooms} of {totalRooms} rooms occupied
          </span>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="mt-3">
          <Progress value={percentage} className="h-2.5" />
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4 border-t border-border/50">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-muted/40 p-2">
            <span className="text-[11px] text-muted-foreground">Available</span>
            <p className="mt-0.5 font-bold text-foreground font-mono">{availableRooms}</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-2">
            <span className="text-[11px] text-muted-foreground">Arrivals</span>
            <p className="mt-0.5 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              +{arrivalsToday}
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 p-2">
            <span className="text-[11px] text-muted-foreground">Turnover</span>
            <p className="mt-0.5 font-bold text-amber-600 dark:text-amber-400 font-mono">
              {cleaningCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
