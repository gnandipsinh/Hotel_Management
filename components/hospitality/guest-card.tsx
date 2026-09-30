import * as React from "react";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GuestAvatar } from "@/components/hospitality/guest-avatar";
import { cn } from "@/lib/utils";

export interface GuestCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  email: string;
  phone: string;
  city?: string;
  isVip?: boolean;
  avatarUrl?: string;
  totalStays?: number;
  currentRoom?: string;
  onViewProfile?: () => void;
}

export function GuestCard({
  name,
  email,
  phone,
  city,
  isVip = false,
  avatarUrl,
  totalStays = 1,
  currentRoom,
  onViewProfile,
  className,
  ...props
}: GuestCardProps) {
  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all hover:border-primary/40 hover:shadow-sm",
        className,
      )}
      {...props}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <GuestAvatar name={name} image={avatarUrl} isVip={isVip} size="md" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isVip ? "VIP Guest" : "Standard Guest"} · {totalStays} {totalStays === 1 ? "Stay" : "Stays"}
            </p>
          </div>
          {currentRoom && (
            <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary font-mono">
              Room {currentRoom}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5 py-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 truncate">
          <Mail className="size-3.5 shrink-0" />
          <span className="truncate">{email}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="size-3.5 shrink-0" />
          <span>{phone}</span>
        </div>
        {city && (
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{city}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full text-xs h-8"
          onClick={onViewProfile}
        >
          Guest Folio Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
