import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, ROOM_STATUS_TONES, type StatusTone } from "@/components/data/status-badge";
import { MOCK_ROOM_TILES } from "@/lib/mock-dashboard";
import { cn } from "@/lib/utils";

const TILE_BG: Record<StatusTone, string> = {
  success: "bg-success/10 border-success/30",
  warning: "bg-warning/10 border-warning/40",
  danger: "bg-destructive/10 border-destructive/30",
  info: "bg-info/10 border-info/30",
  neutral: "bg-muted border-border",
  primary: "bg-primary/10 border-primary/30",
};

export function RoomStatusTiles() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold">Room status</CardTitle>
        <span className="text-xs text-muted-foreground">12 of 84 shown</span>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {MOCK_ROOM_TILES.map((room) => {
            const tone = ROOM_STATUS_TONES[room.status] ?? "neutral";
            return (
              <div
                key={room.number}
                title={`${room.number} · ${room.type} · ${room.status}${room.detail ? ` — ${room.detail}` : ""}`}
                className={cn(
                  "flex min-w-0 flex-col gap-1 rounded-lg border p-2",
                  TILE_BG[tone],
                )}
              >
                <span className="truncate text-sm font-semibold tabular-nums">
                  {room.number}
                </span>
                <span className="truncate text-[0.625rem] text-muted-foreground">
                  {room.status}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 border-t pt-3">
          <StatusBadge tone="success">Available</StatusBadge>
          <StatusBadge tone="info">Occupied</StatusBadge>
          <StatusBadge tone="primary">Reserved</StatusBadge>
          <StatusBadge tone="warning">Cleaning / Dirty</StatusBadge>
          <StatusBadge tone="danger">Maintenance / OOO</StatusBadge>
        </div>
      </CardContent>
    </Card>
  );
}
