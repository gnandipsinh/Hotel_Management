import * as React from "react";
import { Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface GuestAvatarProps {
  name: string;
  image?: string;
  isVip?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function GuestAvatar({
  name,
  image,
  isVip = false,
  size = "md",
  className,
}: GuestAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClasses = {
    sm: "size-7 text-[10px]",
    md: "size-9 text-xs",
    lg: "size-12 text-sm",
    xl: "size-16 text-base",
  };

  const crownClasses = {
    sm: "size-3 -top-1 -right-1",
    md: "size-3.5 -top-1.5 -right-1.5",
    lg: "size-4 -top-2 -right-2",
    xl: "size-5 -top-2.5 -right-2.5",
  };

  return (
    <div className="relative inline-flex shrink-0">
      <Avatar
        className={cn(
          sizeClasses[size],
          isVip && "ring-2 ring-cyan-500/80 ring-offset-2 ring-offset-background",
          className,
        )}
      >
        {image && <AvatarImage src={image} alt={name} />}
        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
          {initials || "G"}
        </AvatarFallback>
      </Avatar>

      {isVip && (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full bg-cyan-600 text-white shadow-xs",
            crownClasses[size],
          )}
          title="VIP Guest"
          aria-label="VIP Guest"
        >
          <Crown className="size-2.5 stroke-[2.5]" aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
