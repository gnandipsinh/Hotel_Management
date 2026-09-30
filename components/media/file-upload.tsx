"use client";

import * as React from "react";
import { FileIcon, Loader2Icon, UploadCloudIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatBytes, getCategoryConfig, type FileCategory } from "@/lib/storage/file-categories";
import {
  acceptAttributeFor,
  useFileUpload,
  type UploadItem,
} from "@/hooks/use-file-upload";
import { UploadProgress } from "@/components/media/upload-progress";
import { UploadError } from "@/components/media/upload-status";
import type { FileAssetDto } from "@/types/media";

export interface FileUploadProps {
  hotelId: string;
  category: FileCategory;
  branchId?: string;
  entityType?: string;
  entityId?: string;
  /** Restrict to a single file per interaction. */
  single?: boolean;
  /** Replace this asset on the next upload. */
  replaceFileId?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  /** Compact dropzone (used for "replace" affordances). */
  compact?: boolean;
  onUploaded?: (asset: FileAssetDto) => void;
  className?: string;
}

function QueueRow({
  item,
  onRetry,
  onRemove,
}: {
  item: UploadItem;
  onRetry: (localId: string) => void;
  onRemove: (localId: string) => void;
}) {
  return (
    <div className="flex w-full min-w-0 items-center gap-3 rounded-lg border bg-card p-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {item.previewUrl ? (
          // Object URL preview (no next/image optimisation for local blobs)
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.previewUrl} alt="" className="size-full object-cover" />
        ) : (
          <FileIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        {item.status === "uploading" && (
          <UploadProgress progress={item.progress} fileName={item.fileName} />
        )}
        {item.status === "success" && (
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">{item.fileName}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
              Uploaded · {formatBytes(item.size)}
            </p>
          </div>
        )}
        {item.status === "error" && (
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">{item.fileName}</p>
            <UploadError
              message={item.error || "Upload failed"}
              onRetry={() => onRetry(item.localId)}
              className="mt-1 border-0 bg-transparent px-0 py-0"
            />
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => onRemove(item.localId)}
        aria-label={`Remove ${item.fileName}`}
        className="shrink-0"
      >
        {item.status === "uploading" ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <XIcon />
        )}
      </Button>
    </div>
  );
}

/**
 * Reusable drag & drop / click-to-upload zone with client-side validation,
 * live progress, retry and per-file error messages.
 */
export function FileUpload({
  hotelId,
  category,
  branchId,
  entityType,
  entityId,
  single = false,
  replaceFileId,
  disabled = false,
  label,
  description,
  compact = false,
  onUploaded,
  className,
}: FileUploadProps) {
  const config = getCategoryConfig(category);
  const [dragActive, setDragActive] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { items, isUploading, uploadMany, retry, remove } = useFileUpload({
    hotelId,
    category,
    branchId,
    entityType,
    entityId,
    single,
    replaceFileId,
    onUploaded: (asset) => {
      toast.success(`${config?.label ?? "File"} uploaded`);
      onUploaded?.(asset);
    },
    onError: (message) => setValidationError(message),
  });

  const accept = acceptAttributeFor(category);
  const title = label ?? (single ? "Upload a file" : "Drag & drop files here");
  const hint =
    description ??
    `${config?.allowedMimeTypes.map((m) => m.split("/")[1].toUpperCase()).join(", ") || "Files"} · up to ${formatBytes(config?.maxSizeBytes ?? 0)}`;

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (disabled) return;
    setValidationError(null);
    await uploadMany(event.dataTransfer.files);
  };

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-3", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-center transition-colors outline-none",
          compact ? "px-3 py-4" : "px-4 py-8 sm:py-10",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/60",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UploadCloudIcon className="size-5" aria-hidden="true" />
        </span>
        <p className={cn("text-sm font-semibold", compact && "text-xs")}>{title}</p>
        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">{hint}</p>
        {!compact && (
          <Button type="button" size="sm" variant="outline" className="mt-1.5" disabled={disabled}>
            Choose {single ? "file" : "files"}
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={!single}
        hidden
        disabled={disabled}
        onChange={async (event) => {
          const files = event.target.files;
          if (files && files.length > 0) {
            setValidationError(null);
            await uploadMany(files);
          }
          event.target.value = "";
        }}
      />

      {validationError && (
        <UploadError message={validationError} onDismiss={() => setValidationError(null)} />
      )}

      {items.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          {items.map((item) => (
            <QueueRow key={item.localId} item={item} onRetry={retry} onRemove={remove} />
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {isUploading ? "Upload in progress" : ""}
      </p>
    </div>
  );
}
