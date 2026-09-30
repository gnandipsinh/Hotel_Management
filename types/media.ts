import type { FileAssetStatus } from "@/models/FileAsset";

/** Safe FileAsset representation returned by the media APIs. */
export interface FileAssetDto {
  id: string;
  hotelId: string;
  branchId?: string;
  originalName: string;
  storageProvider: string;
  url: string;
  secureUrl?: string;
  mimeType: string;
  extension: string;
  size: number;
  category: string;
  entityType?: string;
  entityId?: string;
  width?: number;
  height?: number;
  status: FileAssetStatus;
  access: "public" | "private";
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface HotelOption {
  id: string;
  name: string;
  slug: string;
  status: string;
}

export interface BranchOption {
  id: string;
  hotelId: string;
  name: string;
  code: string;
  status: string;
}
