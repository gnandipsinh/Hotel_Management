import * as React from "react";
import { cn } from "@/lib/utils";

export interface UploadProgressProps {
  progress: number;
  fileName?: string;
  className?: string;
}

/** Determinate upload progress bar with an accessible percentage. */
export function UploadProgress({ progress, fileName, className }: UploadProgressProps) {
  const clamped = Math.max(0, Math.min(100, progress));
  return (
    <div className={cn("w-full min-w-0", className)}>
      {fileName && (
        <p className="mb-1 truncate text-xs text-muted-foreground">{fileName}</p>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label="Upload progress"
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="mt-1 text-right text-[11px] tabular-nums text-muted-foreground">
        {clamped}%
      </p>
    </div>
  );
}
