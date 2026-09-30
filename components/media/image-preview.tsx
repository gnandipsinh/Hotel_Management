"use client";

import * as React from "react";
import Image from "next/image";
import { ExpandIcon, FileTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ImageAspect = "square" | "video" | "wide";

const ASPECT_CLASS: Record<ImageAspect, string> = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[3/1]",
};

export interface ImagePreviewProps {
  src: string;
  alt: string;
  /** Rendered under the image inside the zoom dialog. */
  caption?: string;
  aspect?: ImageAspect;
  /** Overlay badge, e.g. a "Primary" chip. */
  badge?: React.ReactNode;
  /** Overlay action buttons (top-right). */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Clickable image tile with an accessible zoom dialog.
 * `next/image` provides lazy loading and responsive sizing.
 */
export function ImagePreview({
  src,
  alt,
  caption,
  aspect = "square",
  badge,
  actions,
  className,
}: ImagePreviewProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        className={cn(
          "group/preview relative overflow-hidden rounded-lg border bg-muted",
          ASPECT_CLASS[aspect],
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute inset-0 h-full w-full cursor-zoom-in"
          aria-label={`Preview ${alt}`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-200 group-hover/preview:scale-[1.02]"
          />
        </button>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-md bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity hover:bg-background focus-visible:opacity-100 group-hover/preview:opacity-100"
          aria-label={`Expand ${alt}`}
          tabIndex={-1}
        >
          <ExpandIcon className="size-3.5" />
        </button>

        {badge && <div className="absolute left-1.5 top-1.5">{badge}</div>}
        {actions && (
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover/preview:opacity-100">
            {actions}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">{alt}</DialogTitle>
            {caption && <DialogDescription>{caption}</DialogDescription>}
          </DialogHeader>
          <div className="relative max-h-[70vh] w-full overflow-hidden rounded-lg bg-muted">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={src}
                alt={alt}
                fill
                unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export interface FilePreviewProps {
  fileName: string;
  url: string;
  mimeType: string;
  className?: string;
}

/** Non-image asset tile (PDF/document) with an open action. */
export function FilePreview({ fileName, url, mimeType, className }: FilePreviewProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/50 p-3 text-center transition-colors hover:bg-muted",
        className,
      )}
    >
      <FileTextIcon className="size-7 text-muted-foreground" aria-hidden="true" />
      <span className="line-clamp-2 w-full break-words text-xs text-muted-foreground">
        {fileName}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
        {mimeType.replace(/^(application|image)\//, "")}
      </span>
    </a>
  );
}

/** Round icon button used as an overlay action on preview tiles. */
export function PreviewActionButton({
  label,
  onClick,
  tone = "default",
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: "default" | "destructive";
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="icon-xs"
      variant={tone === "destructive" ? "destructive" : "secondary"}
      onClick={onClick}
      aria-label={label}
      className="size-7 bg-background/85 backdrop-blur hover:bg-background"
    >
      {children}
    </Button>
  );
}
