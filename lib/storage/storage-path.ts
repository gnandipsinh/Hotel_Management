/**
 * Tenant-aware storage key construction.
 *
 * Keys are ALWAYS built by the backend from validated ObjectIds plus the
 * category folder template. Clients never supply a path segment — this is what
 * makes cross-tenant key crafting and path traversal impossible.
 */

import { randomUUID } from "crypto";
import { Types } from "mongoose";
import { ApiError } from "@/lib/db/errors";
import { EXTENSION_MIME_MAP, getCategoryConfig, type FileCategory } from "@/lib/storage/file-categories";

/** True when a key is safe to use as a relative filesystem/provider path. */
export function isSafeStorageKey(key: string): boolean {
  if (!key || key.length > 512) return false;
  if (key.startsWith("/") || key.includes("\\")) return false;
  if (key.includes("..") || key.includes("./")) return false;
  if (key.includes("\0")) return false;
  return key.split("/").every((segment) => segment.length > 0 && segment !== "." && segment !== "..");
}

/**
 * Reduce a client-provided file name to a safe base name.
 * Strips any directory components and everything outside `[a-z0-9._-]`.
 */
export function sanitizeFileName(originalName: string): string {
  const base = originalName.split(/[\\/]/).pop() || "file";
  const dotIndex = base.lastIndexOf(".");
  const stem = dotIndex > 0 ? base.slice(0, dotIndex) : base;
  const extension = dotIndex > 0 ? base.slice(dotIndex) : "";
  const safeStem = stem
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 64);
  const safeExtension = extension.toLowerCase().replace(/[^a-z0-9.]/g, "").slice(0, 10);
  return `${safeStem || "file"}${safeExtension}`;
}

function assertObjectId(value: string | undefined, field: string): string {
  if (!value || !Types.ObjectId.isValid(value)) {
    throw ApiError.badRequest(`Invalid ${field}`);
  }
  return value;
}

export interface BuildStorageKeyInput {
  hotelId: string;
  category: FileCategory;
  branchId?: string;
  entityId?: string;
  originalName: string;
}

export interface BuiltStorageKey {
  /** Full storage key, e.g. `hotels/64f…/gallery/6a0…​.png`. */
  key: string;
  /** Folder portion (also the Cloudinary folder/public prefix). */
  folder: string;
  /** Generated file name portion (`<uuid>.<ext>`). */
  fileName: string;
  extension: string;
}

/**
 * Build the storage key for an upload. Throws `400 INVALID_INPUT` when the
 * category does not apply to the supplied entity ids.
 */
export function buildStorageKey(input: BuildStorageKeyInput): BuiltStorageKey {
  const config = getCategoryConfig(input.category);
  if (!config) throw ApiError.badRequest("Unsupported file category");

  const hotelId = assertObjectId(input.hotelId, "hotelId");
  const replacements: Record<string, string> = { "{hotelId}": hotelId };

  if (config.folder.includes("{branchId}")) {
    replacements["{branchId}"] = assertObjectId(input.branchId, "branchId");
  } else if (input.branchId) {
    // Branch supplied for a non-branch folder: still validate it, keep folder stable.
    assertObjectId(input.branchId, "branchId");
  }

  if (config.folder.includes("{entityId}")) {
    replacements["{entityId}"] = assertObjectId(input.entityId, "entityId");
  } else if (input.entityId) {
    assertObjectId(input.entityId, "entityId");
  }

  const folder = Object.entries(replacements).reduce(
    (acc, [placeholder, value]) => acc.replace(placeholder, value),
    config.folder,
  );

  const safeName = sanitizeFileName(input.originalName);
  const extension = safeName.includes(".") ? safeName.split(".").pop()! : "";
  if (!EXTENSION_MIME_MAP[extension]) {
    throw ApiError.badRequest("Unsupported file extension");
  }

  const fileName = `${randomUUID()}.${extension}`;
  const key = `${folder}/${fileName}`;

  if (!isSafeStorageKey(key)) {
    throw ApiError.badRequest("Invalid storage path");
  }

  return { key, folder, fileName, extension };
}
