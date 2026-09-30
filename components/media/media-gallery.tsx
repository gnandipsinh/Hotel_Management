"use client";

import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon, Loader2Icon, StarIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states/empty-state";
import { SkeletonCards } from "@/components/states/skeletons";
import type { FileAssetDto } from "@/types/media";
import {
  ImagePreview,
  PreviewActionButton,
} from "@/components/media/image-preview";

export interface MediaGalleryProps {
  assets: FileAssetDto[];
  loading?: boolean;
  /** File id currently being mutated (shows a spinner on its action). */
  busyId?: string | null;
  onSetPrimary?: (asset: FileAssetDto) => void;
  onMove?: (asset: FileAssetDto, direction: -1 | 1) => void;
  onDelete?: (asset: FileAssetDto) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

/**
 * Responsive image grid with primary selection, manual reordering
 * (sortOrder) and delete — ordered by the server's `sort` field.
 */
export function MediaGallery({
  assets,
  loading = false,
  busyId = null,
  onSetPrimary,
  onMove,
  onDelete,
  emptyTitle = "No images yet",
  emptyDescription = "Upload images to build this gallery.",
  className,
}: MediaGalleryProps) {
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  if (loading) return <SkeletonCards cards={4} className={className} />;

  if (assets.length === 0) {
    return (
      <EmptyState
        compact
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {assets.map((asset) => {
        const busy = busyId === asset.id;
        return (
          <div key={asset.id} className="flex min-w-0 flex-col gap-1.5">
            <ImagePreview
              src={asset.url}
              alt={asset.originalName}
              caption={`${asset.mimeType} · ${(asset.size / 1024).toFixed(0)} KB`}
              badge={
                asset.isPrimary ? (
                  <Badge
                    variant="secondary"
                    className="bg-background/85 text-[10px] backdrop-blur"
                  >
                    <StarIcon className="size-3" aria-hidden="true" /> Primary
                  </Badge>
                ) : undefined
              }
              actions={
                <>
                  {onMove && (
                    <>
                      <PreviewActionButton
                        label={`Move ${asset.originalName} earlier`}
                        onClick={() => onMove(asset, -1)}
                      >
                        <ArrowLeftIcon />
                      </PreviewActionButton>
                      <PreviewActionButton
                        label={`Move ${asset.originalName} later`}
                        onClick={() => onMove(asset, 1)}
                      >
                        <ArrowRightIcon />
                      </PreviewActionButton>
                    </>
                  )}
                  {onSetPrimary && !asset.isPrimary && (
                    <PreviewActionButton
                      label={`Make ${asset.originalName} primary`}
                      onClick={() => onSetPrimary(asset)}
                    >
                      <StarIcon />
                    </PreviewActionButton>
                  )}
                  {onDelete && (
                    <PreviewActionButton
                      label={
                        confirmId === asset.id
                          ? `Confirm deletion of ${asset.originalName}`
                          : `Delete ${asset.originalName}`
                      }
                      tone="destructive"
                      onClick={() => {
                        if (confirmId === asset.id) {
                          setConfirmId(null);
                          onDelete(asset);
                        } else {
                          setConfirmId(asset.id);
                        }
                      }}
                    >
                      {busy ? (
                        <Loader2Icon className="animate-spin" />
                      ) : confirmId === asset.id ? (
                        <span className="px-0.5 text-[10px] font-semibold">Sure?</span>
                      ) : (
                        <Trash2Icon />
                      )}
                    </PreviewActionButton>
                  )}
                </>
              }
            />
            <p className="truncate text-xs text-muted-foreground">
              {asset.originalName}
            </p>
          </div>
        );
      })}
    </div>
  );
}
