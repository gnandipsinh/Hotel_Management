/**
 * Central file-category registry — single source of truth for what may be
 * uploaded, how large it may be, where it is stored and whether it is public.
 *
 * This module is intentionally dependency-free and is imported by both the
 * server (upload validation) and the browser (client-side pre-validation).
 * Never duplicate these rules anywhere else.
 */

export const FILE_CATEGORIES = [
  "hotel_logo",
  "hotel_cover",
  "hotel_gallery",
  "room_image",
  "restaurant_image",
  "menu_image",
  "staff_avatar",
  "guest_document",
  "hotel_document",
  "upi_qr",
  "payment_proof",
  "other",
] as const;

export type FileCategory = (typeof FILE_CATEGORIES)[number];

/** Supported image formats (deliberately no SVG — it can carry scripts). */
export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
/** Supported document formats. */
export const DOCUMENT_MIME_TYPES = ["application/pdf"] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
/** Hard server-side cap for any upload, regardless of category. */
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

/** MIME type → canonical file extension. */
export const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

/** Allowed file extensions (as typed by the user) → MIME type. */
export const EXTENSION_MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};

/**
 * Entity requirement per category:
 * - `hotel`: always valid for the tenant
 * - `branch`: a verified branch of the tenant is required
 * - `room`: a verified branch plus a room id (room CRUD arrives in a later phase)
 */
export type CategoryEntity = "hotel" | "branch" | "room";

export interface CategoryConfig {
  label: string;
  allowedMimeTypes: readonly string[];
  maxSizeBytes: number;
  access: "public" | "private";
  entity: CategoryEntity;
  /** Only one active asset per hotel (replace semantics). */
  single: boolean;
  /** Tenant-aware folder template; placeholders are filled server-side only. */
  folder: string;
}

/** `default` folders are built with `hotels/{hotelId}` + branch/entity segments. */
export const FILE_CATEGORY_REGISTRY: Record<FileCategory, CategoryConfig> = {
  hotel_logo: {
    label: "Hotel logo",
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    access: "public",
    entity: "hotel",
    single: true,
    folder: "hotels/{hotelId}/logo",
  },
  hotel_cover: {
    label: "Cover image",
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    access: "public",
    entity: "hotel",
    single: true,
    folder: "hotels/{hotelId}/cover",
  },
  hotel_gallery: {
    label: "Gallery image",
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    access: "public",
    entity: "hotel",
    single: false,
    folder: "hotels/{hotelId}/gallery",
  },
  room_image: {
    label: "Room image",
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    access: "public",
    entity: "room",
    single: false,
    folder: "hotels/{hotelId}/branches/{branchId}/rooms/{entityId}",
  },
  restaurant_image: {
    label: "Restaurant image",
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    access: "public",
    entity: "branch",
    single: false,
    folder: "hotels/{hotelId}/branches/{branchId}/restaurant",
  },
  menu_image: {
    label: "Menu image",
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    access: "public",
    entity: "branch",
    single: false,
    folder: "hotels/{hotelId}/branches/{branchId}/restaurant/menu",
  },
  staff_avatar: {
    label: "Staff photo",
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    access: "public",
    entity: "hotel",
    single: false,
    folder: "hotels/{hotelId}/staff",
  },
  guest_document: {
    label: "Guest document",
    allowedMimeTypes: [...IMAGE_MIME_TYPES, ...DOCUMENT_MIME_TYPES],
    maxSizeBytes: MAX_DOCUMENT_SIZE_BYTES,
    access: "private",
    entity: "hotel",
    single: false,
    folder: "hotels/{hotelId}/guests",
  },
  hotel_document: {
    label: "Hotel document",
    allowedMimeTypes: [...IMAGE_MIME_TYPES, ...DOCUMENT_MIME_TYPES],
    maxSizeBytes: MAX_DOCUMENT_SIZE_BYTES,
    access: "private",
    entity: "hotel",
    single: false,
    folder: "hotels/{hotelId}/documents",
  },
  upi_qr: {
    label: "UPI QR code",
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    access: "public",
    entity: "hotel",
    single: true,
    folder: "hotels/{hotelId}/payments/upi",
  },
  payment_proof: {
    label: "Payment proof",
    allowedMimeTypes: [...IMAGE_MIME_TYPES, ...DOCUMENT_MIME_TYPES],
    maxSizeBytes: MAX_DOCUMENT_SIZE_BYTES,
    access: "private",
    entity: "hotel",
    single: false,
    folder: "hotels/{hotelId}/payments",
  },
  other: {
    label: "Other file",
    allowedMimeTypes: [...IMAGE_MIME_TYPES, ...DOCUMENT_MIME_TYPES],
    maxSizeBytes: MAX_DOCUMENT_SIZE_BYTES,
    access: "public",
    entity: "hotel",
    single: false,
    folder: "hotels/{hotelId}/misc",
  },
};

export function isFileCategory(value: string): value is FileCategory {
  return (FILE_CATEGORIES as readonly string[]).includes(value);
}

export function getCategoryConfig(category: string): CategoryConfig | null {
  return isFileCategory(category) ? FILE_CATEGORY_REGISTRY[category] : null;
}

export function isImageMime(mime: string): boolean {
  return (IMAGE_MIME_TYPES as readonly string[]).includes(mime);
}

export function isPrivateCategory(category: string): boolean {
  return getCategoryConfig(category)?.access === "private";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
