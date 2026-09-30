import * as React from "react";
import { Building2, GitBranch, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HotelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  type: string;
  starRating?: string;
  city: string;
  country: string;
  branchCount: number;
  roomCount?: number;
  status?: "active" | "inactive" | "onboarding";
  onManage?: () => void;
}

export function HotelCard({
  name,
  type,
  starRating = "5 Star Luxury",
  city,
  country,
  branchCount,
  roomCount,
  status = "active",
  onManage,
  className,
  ...props
}: HotelCardProps) {
  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all hover:border-primary/40 hover:shadow-sm",
        className,
      )}
      {...props}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </span>
            <div>
              <CardTitle className="text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                {name}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {starRating} · {type}
              </p>
            </div>
          </div>
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className="text-[10px] capitalize"
          >
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 py-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-3.5 text-muted-foreground/80 shrink-0" />
          <span>
            {city}, {country}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t pt-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <GitBranch className="size-3.5 shrink-0" />
            <span>
              <strong className="font-semibold text-foreground">{branchCount}</strong> {branchCount === 1 ? "Branch" : "Branches"}
            </span>
          </div>
          {typeof roomCount === "number" && (
            <div className="text-right text-muted-foreground">
              <strong className="font-semibold text-foreground">{roomCount}</strong> Total Rooms
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={onManage}
        >
          Manage Property
        </Button>
      </CardFooter>
    </Card>
  );
}
