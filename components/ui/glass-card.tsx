import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  interactive?: boolean;
}

export function GlassCard({
  className,
  glow = false,
  interactive = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/70 p-5 shadow-xs backdrop-blur-md transition-all dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none sm:p-6",
        interactive &&
          "cursor-pointer hover:border-primary/40 hover:bg-white/85 hover:shadow-sm dark:hover:border-white/20 dark:hover:bg-slate-900/80",
        glow && "ring-1 ring-primary/20 shadow-primary/5",
        className,
      )}
      {...props}
    />
  );
}

export function GlassCardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pb-4", className)} {...props} />;
}

export function GlassCardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold tracking-tight text-foreground sm:text-lg", className)}
      {...props}
    />
  );
}

export function GlassCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-muted-foreground leading-relaxed", className)} {...props} />;
}

export function GlassCardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0", className)} {...props} />;
}

export function GlassCardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center pt-4 border-t border-border/50", className)} {...props} />;
}
