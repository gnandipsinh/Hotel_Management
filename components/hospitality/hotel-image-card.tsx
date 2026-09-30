import * as React from "react";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HotelImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  location: string;
  image: string;
  starRating?: string;
  tag?: string;
  onExplore?: () => void;
}

export function HotelImageCard({
  name,
  location,
  image,
  starRating = "5 Star",
  tag,
  onExplore,
  className,
  ...props
}: HotelImageCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-2xl border bg-muted aspect-[16/10] sm:aspect-[16/9] shadow-xs transition-all hover:shadow-sm",
        className,
      )}
      {...props}
    >
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
      />

      {/* Dark Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      {/* Top Floating Badges */}
      <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between">
        {tag ? (
          <Badge className="bg-background/85 text-foreground backdrop-blur-xs text-[10px] shadow-xs">
            {tag}
          </Badge>
        ) : <div />}
        <Badge
          variant="secondary"
          className="gap-1 bg-blue-600 text-white border border-cyan-400/30 text-[10px] font-semibold shadow-xs"
        >
          <Star className="size-3 fill-current text-cyan-300" />
          <span>{starRating}</span>
        </Badge>
      </div>

      {/* Bottom Content Area */}
      <div className="relative p-4 sm:p-5 text-white space-y-2">
        <div>
          <h3 className="text-base font-semibold leading-tight drop-shadow-xs sm:text-lg">
            {name}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-white/80 mt-1">
            <MapPin className="size-3.5 text-white/90 shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        </div>

        {onExplore && (
          <div className="pt-1">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 text-xs bg-white/90 text-slate-900 hover:bg-white backdrop-blur-xs font-medium"
              onClick={onExplore}
            >
              Explore Property
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
