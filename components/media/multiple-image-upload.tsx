"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { FileCategory } from "@/lib/storage/file-categories";
import type { FileAssetDto } from "@/types/media";
import { FileUpload } from "@/components/media/file-upload";

export interface MultipleImageUploadProps {
  hotelId: string;
  category: FileCategory;
  branchId?: string;
  entityType?: string;
  entityId?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  onUploaded?: (asset: FileAssetDto) => void;
  className?: string;
}

/**
 * Multi-file upload zone (galleries, room images, restaurant images, documents).
 * Pair it with `MediaGallery` or `FileList` to render the stored assets.
 */
export function MultipleImageUpload({
  hotelId,
  category,
  branchId,
  entityType,
  entityId,
  label,
  description,
  disabled,
  onUploaded,
  className,
}: MultipleImageUploadProps) {
  return (
    <FileUpload
      hotelId={hotelId}
      category={category}
      branchId={branchId}
      entityType={entityType}
      entityId={entityId}
      disabled={disabled}
      label={label}
      description={description}
      onUploaded={onUploaded}
      className={cn(className)}
    />
  );
}
