"use client";

import * as React from "react";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { FileCategory } from "@/lib/storage/file-categories";
import { deleteFileAsset } from "@/lib/media/api";
import type { FileAssetDto } from "@/types/media";
import { FileUpload } from "@/components/media/file-upload";
import { ImagePreview, PreviewActionButton, type ImageAspect } from "@/components/media/image-preview";
import { Skeleton } from "@/components/ui/skeleton";

export interface ImageUploadProps {
  hotelId: string;
  category: FileCategory;
  label?: string;
  description?: string;
  branchId?: string;
  entityType?: string;
  entityId?: string;
  /** Currently stored asset (single-value slots: logo, cover, QR). */
  asset: FileAssetDto | null;
  aspect?: ImageAspect;
  loading?: boolean;
  onChanged?: (asset: FileAssetDto | null) => void;
  className?: string;
}

/**
 * Single-image slot: preview + zoom, replace (dropzone), delete.
 * Used for hotel logo, hotel cover and UPI QR.
 */
export function ImageUpload({
  hotelId,
  category,
  label,
  description,
  branchId,
  entityType,
  entityId,
  asset,
  aspect = "square",
  loading = false,
  onChanged,
  className,
}: ImageUploadProps) {
  const [busy, setBusy] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = async () => {
    if (!asset) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setConfirmDelete(true);
    setBusy(true);
    try {
      await deleteFileAsset(asset.id, hotelId);
      toast.success("Image removed");
      onChanged?.(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete the image");
    } finally {
      setBusy(false);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <Skeleton
          className={cn(
            "w-full rounded-lg",
            aspect === "wide"
              ? "aspect-[3/1]"
              : aspect === "video"
                ? "aspect-video"
                : "aspect-square",
          )}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-3", className)}>
      {asset ? (
        <>
          <ImagePreview
            src={asset.url}
            alt={asset.originalName}
            caption={`${(asset.size / 1024).toFixed(0)} KB · ${asset.mimeType}`}
            aspect={aspect}
            badge={
              <Badge variant="secondary" className="bg-background/85 backdrop-blur">
                {category === "hotel_logo"
                  ? "Logo"
                  : category === "hotel_cover"
                    ? "Cover"
                    : "QR"}
              </Badge>
            }
            actions={
              <PreviewActionButton
                label="Delete image"
                tone="destructive"
                onClick={handleDelete}
              >
                {busy ? (
                  <Loader2Icon className="animate-spin" />
                ) : confirmDelete ? (
                  <span className="px-0.5 text-[10px] font-semibold">Sure?</span>
                ) : (
                  <Trash2Icon />
                )}
              </PreviewActionButton>
            }
          />
          <FileUpload
            hotelId={hotelId}
            category={category}
            branchId={branchId}
            entityType={entityType}
            entityId={entityId}
            single
            compact
            replaceFileId={asset.id}
            label="Drop a new image to replace"
            onUploaded={(next) => onChanged?.(next)}
          />
        </>
      ) : (
        <FileUpload
          hotelId={hotelId}
          category={category}
          branchId={branchId}
          entityType={entityType}
          entityId={entityId}
          single
          label={label ?? "Upload image"}
          description={description}
          onUploaded={(next) => onChanged?.(next)}
        />
      )}
    </div>
  );
}
