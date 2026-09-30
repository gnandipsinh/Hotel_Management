import * as React from "react";
import { GitBranch, MapPin, Phone, Star, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BranchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  code: string;
  city: string;
  state?: string;
  address?: string;
  phone?: string;
  managerName?: string;
  isPrimary?: boolean;
  roomCount?: number;
  onManage?: () => void;
}

export function BranchCard({
  name,
  code,
  city,
  state,
  address,
  phone,
  managerName,
  isPrimary = false,
  roomCount,
  onManage,
  className,
  ...props
}: BranchCardProps) {
  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all hover:border-primary/40 hover:shadow-sm",
        isPrimary && "border-primary/40 bg-primary/5 dark:bg-primary/10",
        className,
      )}
      {...props}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              <Badge variant="outline" className="font-mono text-[10px] uppercase">
                {code}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3.5 shrink-0" />
              <span>
                {city}
                {state ? `, ${state}` : ""}
              </span>
            </p>
          </div>
          {isPrimary && (
            <Badge className="bg-primary text-primary-foreground text-[10px]">
              <Star className="mr-1 size-3 fill-current" /> Primary
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 py-2 text-xs text-muted-foreground">
        {address && <p className="truncate">{address}</p>}
        {managerName && (
          <div className="flex items-center gap-1.5 text-foreground/80">
            <User className="size-3.5 shrink-0" />
            <span>Manager: {managerName}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="size-3.5 shrink-0" />
            <span>{phone}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/50 flex items-center justify-between">
        {typeof roomCount === "number" && (
          <span className="text-xs text-muted-foreground font-medium">
            {roomCount} Rooms
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs h-8 ml-auto"
          onClick={onManage}
        >
          Branch Console
        </Button>
      </CardFooter>
    </Card>
  );
}
