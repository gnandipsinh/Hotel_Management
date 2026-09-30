/**
 * Server-side file validation (`validateFile` capability).
 *
 * Order: category → size → extension → magic bytes → category MIME rules →
 * dimensions. The browser-declared MIME type is accepted only as a hint and
 * never used to decide whether a file is allowed.
 */

import { ApiError } from "@/lib/db/errors";
import {
  EXTENSION_MIME_MAP,
  MIME_EXTENSION_MAP,
  formatBytes,
  getCategoryConfig,
} from "@/lib/storage/file-categories";
import { extractImageDimensions, sniffMimeType } from "@/lib/storage/file-signature";
import { sanitizeFileName } from "@/lib/storage/storage-path";

export interface ValidateFileInput {
  buffer: Buffer;
  /** Original client file name (any path components are stripped). */
  fileName: string;
  /** Browser-declared MIME type — used for diagnostics only. */
  declaredMimeType?: string;
  category: string;
}

export interface ValidatedFile {
  /** Display-safe base name derived from the client file name. */
  originalName: string;
  /** Authoritative MIME type determined from the file's bytes. */
  mimeType: string;
  extension: string;
  size: number;
  width?: number;
  height?: number;
}

function reject(message: string, field = "file"): never {
  throw ApiError.badRequest(message, { [field]: [message] });
}

export function validateFile(input: ValidateFileInput): ValidatedFile {
  const { buffer, fileName, category } = input;

  const config = getCategoryConfig(category);
  if (!config) reject("Unsupported file category", "category");

  if (!buffer || buffer.length === 0) reject("The file is empty");

  if (buffer.length > config.maxSizeBytes) {
    reject(
      `File is too large (${formatBytes(buffer.length)}). Maximum allowed size for ${config.label.toLowerCase()} is ${formatBytes(config.maxSizeBytes)}.`,
      "size",
    );
  }

  const originalName = sanitizeFileName(fileName);
  const dotIndex = originalName.lastIndexOf(".");
  const extension = dotIndex > 0 ? originalName.slice(dotIndex + 1) : "";
  const declaredExtensionMime = EXTENSION_MIME_MAP[extension];
  if (!declaredExtensionMime) {
    reject(`Unsupported file extension${extension ? ` ".${extension}"` : ""}`, "extension");
  }

  const mimeType = sniffMimeType(buffer);
  if (!mimeType) {
    reject("File content does not match any supported format", "content");
  }

  if (!config.allowedMimeTypes.includes(mimeType)) {
    reject(
      `${MIME_EXTENSION_MAP[mimeType]?.toUpperCase() ?? mimeType} files are not allowed for ${config.label.toLowerCase()}`,
      "content",
    );
  }

  // Extension must agree with the actual bytes (blocks renamed executables etc).
  if (declaredExtensionMime !== mimeType) {
    reject("File extension does not match the file content", "extension");
  }

  const result: ValidatedFile = {
    originalName,
    mimeType,
    extension: MIME_EXTENSION_MAP[mimeType],
    size: buffer.length,
  };

  if (mimeType !== "application/pdf") {
    const dimensions = extractImageDimensions(buffer, mimeType);
    if (dimensions) {
      result.width = dimensions.width;
      result.height = dimensions.height;
    }
  }

  return result;
}
