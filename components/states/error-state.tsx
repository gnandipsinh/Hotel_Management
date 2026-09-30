import { TriangleAlertIcon, RotateCcwIcon, SearchXIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  kind?: "error" | "not-found";
  className?: string;
}

/**
 * Error / failure state with an actionable message — never generic
 * "Something went wrong" copy.
 */
export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Try again",
  kind = "error",
  className,
}: ErrorStateProps) {
  const isNotFound = kind === "not-found";
  const Icon = isNotFound ? SearchXIcon : TriangleAlertIcon;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center",
        isNotFound ? "border-border" : "border-destructive/40",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-full",
          isNotFound ? "bg-muted text-muted-foreground" : "bg-destructive/10 text-destructive",
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold">
        {title ?? (isNotFound ? "Page not found" : "Unable to load data")}
      </p>
      <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
        {description ??
          (isNotFound
            ? "The page you are looking for does not exist or has been moved."
            : "We could not complete this request. Check your connection and try again.")}
      </p>
      {onRetry && (
        <Button type="button" size="sm" variant="outline" className="mt-1.5" onClick={onRetry}>
          <RotateCcwIcon aria-hidden="true" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
