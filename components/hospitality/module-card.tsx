import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ModuleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  enabled?: boolean;
  recommended?: boolean;
  onToggle?: () => void;
  onOpen?: () => void;
  interactive?: boolean;
}

export function ModuleCard({
  name,
  category,
  description,
  icon,
  enabled = true,
  recommended = false,
  onToggle,
  onOpen,
  interactive = false,
  className,
  ...props
}: ModuleCardProps) {
  return (
    <Card
      onClick={interactive ? onToggle : undefined}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all p-5",
        enabled
          ? "border-primary/30 bg-card shadow-2xs"
          : "border-border bg-muted/30 opacity-70",
        interactive && "cursor-pointer hover:border-primary/50 select-none",
        className,
      )}
      {...props}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-xl transition-colors",
              enabled
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted text-muted-foreground",
            )}
          >
            {icon}
          </span>
          <div className="flex items-center gap-1.5">
            {recommended && (
              <Badge
                variant="secondary"
                className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 text-[10px]"
              >
                Recommended
              </Badge>
            )}
            {interactive && (
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-md border transition-colors",
                  enabled
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-background",
                )}
              >
                {enabled && <Check className="size-3.5 stroke-[3]" />}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h4>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {category}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {onOpen && (
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">
            {enabled ? "Active module" : "Disabled in plan"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1 text-primary hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            Open Console
            <ArrowRight className="size-3" />
          </Button>
        </div>
      )}
    </Card>
  );
}
