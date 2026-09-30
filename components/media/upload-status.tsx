import * as React from "react";
import { CircleCheckIcon, RotateCcwIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface UploadErrorProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/** Inline failure banner with optional retry and dismiss. */
export function UploadError({ message, onRetry, onDismiss, className }: UploadErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex w-full min-w-0 items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive",
        className,
      )}
    >
      <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 break-words">{message}</span>
      <div className="flex shrink-0 items-center gap-1">
        {onRetry && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRetry}
            aria-label="Retry upload"
          >
            <RotateCcwIcon />
          </Button>
        )}
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <XIcon />
          </Button>
        )}
      </div>
    </div>
  );
}

export interface UploadSuccessProps {
  message?: string;
  className?: string;
}

/** Inline confirmation banner shown after a successful upload. */
export function UploadSuccess({ message = "Upload complete", className }: UploadSuccessProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex w-full min-w-0 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400",
        className,
      )}
    >
      <CircleCheckIcon className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="min-w-0 truncate">{message}</span>
    </div>
  );
}
