import * as React from "react";
import { BedDouble, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomStatusBadge, type RoomStatus } from "@/components/hospitality/room-status-badge";
import { cn } from "@/lib/utils";

export interface RoomGridItem {
  roomNumber: string;
  floor: number;
  category: string;
  status: RoomStatus;
}

export interface RoomAvailabilityProps extends React.HTMLAttributes<HTMLDivElement> {
  rooms: RoomGridItem[];
  onRoomClick?: (room: RoomGridItem) => void;
  selectedRoomNumber?: string;
}

export function RoomAvailability({
  rooms,
  onRoomClick,
  selectedRoomNumber,
  className,
  ...props
}: RoomAvailabilityProps) {
  const [filter, setFilter] = React.useState<RoomStatus | "all">("all");

  const counts = React.useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter((r) => r.status === "available").length;
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const cleaning = rooms.filter((r) => r.status === "cleaning").length;
    const reserved = rooms.filter((r) => r.status === "reserved").length;
    return { total, available, occupied, cleaning, reserved };
  }, [rooms]);

  const filteredRooms = React.useMemo(() => {
    if (filter === "all") return rooms;
    return rooms.filter((r) => r.status === filter);
  }, [rooms, filter]);

  return (
    <Card className={cn("rounded-2xl border bg-card p-5 shadow-xs sm:p-6", className)} {...props}>
      <CardHeader className="p-0 pb-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BedDouble className="size-4" />
              </span>
              <CardTitle className="text-base font-semibold text-foreground">
                Room Availability Grid
              </CardTitle>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {counts.available} of {counts.total} rooms ready for check-in
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                filter === "all"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              All ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => setFilter("available")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                filter === "available"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20",
              )}
            >
              Available ({counts.available})
            </button>
            <button
              type="button"
              onClick={() => setFilter("occupied")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                filter === "occupied"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-blue-500/10 text-blue-800 dark:text-blue-300 hover:bg-blue-500/20",
              )}
            >
              Occupied ({counts.occupied})
            </button>
            <button
              type="button"
              onClick={() => setFilter("cleaning")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                filter === "cleaning"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "bg-purple-500/10 text-purple-800 dark:text-purple-300 hover:bg-purple-500/20",
              )}
            >
              Cleaning ({counts.cleaning})
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-2">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {filteredRooms.map((room) => {
            const isSelected = selectedRoomNumber === room.roomNumber;
            const borderColors = {
              available: "hover:border-emerald-500/50 bg-emerald-500/5",
              occupied: "hover:border-blue-500/50 bg-blue-500/5",
              reserved: "hover:border-amber-500/50 bg-amber-500/5",
              cleaning: "hover:border-purple-500/50 bg-purple-500/5",
              maintenance: "hover:border-rose-500/50 bg-rose-500/5",
              outOfService: "hover:border-slate-500/50 bg-slate-500/5",
            };

            return (
              <button
                key={room.roomNumber}
                type="button"
                onClick={() => onRoomClick?.(room)}
                className={cn(
                  "flex flex-col items-center justify-between rounded-xl border p-2.5 text-center transition-all cursor-pointer",
                  borderColors[room.status] || "bg-card",
                  isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                )}
              >
                <span className="font-mono text-xs font-bold text-foreground">
                  {room.roomNumber}
                </span>
                <span className="text-[10px] text-muted-foreground truncate w-full">
                  F{room.floor} · {room.category.split(" ")[0]}
                </span>
                <span className="mt-1">
                  <RoomStatusBadge status={room.status} showDot={false} className="px-1.5 py-0 text-[9px]" />
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
