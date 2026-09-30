"use client";

import * as React from "react";
import {
  EXTENSION_MIME_MAP,
  formatBytes,
  getCategoryConfig,
  type FileCategory,
} from "@/lib/storage/file-categories";
import { ApiClientError, uploadWithProgress } from "@/lib/media/api";
import type { FileAssetDto } from "@/types/media";

export type UploadStatus = "uploading" | "success" | "error";

export interface UploadItem {
  localId: string;
  file: File;
  fileName: string;
  size: number;
  previewUrl: string | null;
  progress: number;
  status: UploadStatus;
  error?: string;
  asset?: FileAssetDto;
  replaceFileId?: string;
}

export interface UseFileUploadOptions {
  hotelId: string;
  category: FileCategory;
  branchId?: string;
  entityType?: string;
  entityId?: string;
  /** Accept only one file at a time (logo, cover, QR). */
  single?: boolean;
  /** When set, every upload replaces this existing asset. */
  replaceFileId?: string;
  onUploaded?: (asset: FileAssetDto) => void;
  onError?: (message: string) => void;
}

/**
 * Client-side pre-validation mirroring the server rules (the server remains
 * the authority — it re-validates MIME, extension, size and content bytes).
 */
export function validateFileClient(file: File, category: FileCategory): string | null {
  const config = getCategoryConfig(category);
  if (!config) return "Unsupported file category";

  const dot = file.name.lastIndexOf(".");
  const extension = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "";
  const mime = EXTENSION_MIME_MAP[extension];
  if (!mime || !config.allowedMimeTypes.includes(mime)) {
    return `Only ${config.allowedMimeTypes.map((m) => m.split("/")[1].toUpperCase()).join(", ")} files are allowed for ${config.label.toLowerCase()}`;
  }
  if (file.size === 0) return "The file is empty";
  if (file.size > config.maxSizeBytes) {
    return `File is too large (${formatBytes(file.size)}). Maximum is ${formatBytes(config.maxSizeBytes)}`;
  }
  return null;
}

export function acceptAttributeFor(category: FileCategory): string {
  const config = getCategoryConfig(category);
  if (!config) return "*/*";
  const extensions = Object.entries(EXTENSION_MIME_MAP)
    .filter(([, mime]) => config.allowedMimeTypes.includes(mime))
    .map(([ext]) => `.${ext}`);
  return extensions.join(",");
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function useFileUpload(options: UseFileUploadOptions) {
  const {
    hotelId,
    category,
    branchId,
    entityType,
    entityId,
    single,
    replaceFileId,
    onUploaded,
    onError,
  } = options;
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const itemsRef = React.useRef<UploadItem[]>([]);
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const updateItem = React.useCallback((localId: string, patch: Partial<UploadItem>) => {
    setItems((current) =>
      current.map((item) => (item.localId === localId ? { ...item, ...patch } : item)),
    );
  }, []);

  const remove = React.useCallback((localId: string) => {
    setItems((current) => {
      const target = current.find((item) => item.localId === localId);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.localId !== localId);
    });
  }, []);

  const reset = React.useCallback(() => {
    for (const item of itemsRef.current) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }
    setItems([]);
  }, []);

  // Revoke any object URLs still held when the component unmounts.
  React.useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      }
    };
  }, []);

  const runUpload = React.useCallback(
    async (item: UploadItem): Promise<FileAssetDto | null> => {
      updateItem(item.localId, { status: "uploading", progress: 0, error: undefined });

      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("hotelId", hotelId);
      formData.append("category", category);
      if (branchId) formData.append("branchId", branchId);
      if (entityType) formData.append("entityType", entityType);
      if (entityId) formData.append("entityId", entityId);
      const replace = item.replaceFileId ?? replaceFileId;
      if (replace) formData.append("replaceFileId", replace);

      try {
        const asset = await uploadWithProgress("/api/files", formData, (percent) =>
          updateItem(item.localId, { progress: percent }),
        );
        updateItem(item.localId, { status: "success", progress: 100, asset });
        onUploaded?.(asset);
        return asset;
      } catch (error) {
        const message =
          error instanceof ApiClientError ? error.message : "Upload failed — please retry";
        updateItem(item.localId, { status: "error", error: message, progress: 0 });
        onError?.(message);
        return null;
      }
    },
    [branchId, category, entityId, entityType, hotelId, onError, onUploaded, replaceFileId, updateItem],
  );

  const upload = React.useCallback(
    async (file: File, replaceFileId?: string): Promise<FileAssetDto | null> => {
      const validationError = validateFileClient(file, category);
      if (validationError) {
        onError?.(validationError);
        return null;
      }

      const localId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const item: UploadItem = {
        localId,
        file,
        fileName: file.name,
        size: file.size,
        previewUrl: isImageFile(file) ? URL.createObjectURL(file) : null,
        progress: 0,
        status: "uploading",
        replaceFileId,
      };

      setItems((current) => {
        if (single) {
          for (const entry of current) {
            if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl);
          }
          return [item];
        }
        return [...current, item];
      });
      return runUpload(item);
    },
    [category, onError, runUpload, single],
  );

  const uploadMany = React.useCallback(
    async (files: FileList | File[]): Promise<void> => {
      const list = Array.from(files);
      if (list.length === 0) return;
      const queue = single ? list.slice(0, 1) : list;
      // Sequential uploads keep progress readable and avoid burst requests.
      for (const file of queue) {
        await upload(file);
      }
    },
    [single, upload],
  );

  const retry = React.useCallback(
    async (localId: string): Promise<void> => {
      const item = itemsRef.current.find((entry) => entry.localId === localId);
      if (!item) return;
      await runUpload(item);
    },
    [runUpload],
  );

  const isUploading = items.some((item) => item.status === "uploading");

  return {
    items,
    isUploading,
    upload,
    uploadMany,
    retry,
    remove,
    reset,
  };
}
