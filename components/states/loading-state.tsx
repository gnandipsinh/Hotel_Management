import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  description?: string;
  compact?: boolean;
}

export function LoadingState({
  message = "Loading data...",
  description,
  compact = false,
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-6 px-4" : "py-16 px-4 sm:py-24",
        className,
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        <div className="size-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <Loader2 className="absolute size-4 text-primary animate-pulse" aria-hidden="true" />
      </div>
      {message && (
        <p className="mt-4 text-sm font-semibold tracking-tight text-foreground">
          {message}
        </p>
      )}
      {description && (
        <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      <span className="sr-only">Loading, please wait</span>
    </div>
  );
}
