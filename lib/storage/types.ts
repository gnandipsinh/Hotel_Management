/**
 * Provider-independent storage contracts.
 *
 * The application only ever talks to these interfaces; the concrete provider
 * (Cloudinary in production, local filesystem in dev/test) is selected at
 * runtime by `lib/storage/provider.ts`. Nothing outside `lib/storage/` may
 * import a concrete adapter.
 */

export type StorageProviderName = "cloudinary" | "local";

export interface StorageFileInput {
  /** Raw file bytes. */
  buffer: Buffer;
  /** Sanitized file name (no directories, no traversal). */
  fileName: string;
  /** Authoritative MIME type (derived from magic bytes, not the browser). */
  mimeType: string;
}

export interface StorageUploadOptions {
  /** Tenant-aware storage key, e.g. `hotels/<id>/logo/<uuid>.png`. */
  key: string;
  /** Private assets must never be reachable through a public URL. */
  access: "public" | "private";
}

export interface StorageObject {
  /** Provider-specific identifier (storage key / Cloudinary public id). */
  key: string;
  /** Public delivery URL, or an empty string for private objects. */
  url: string;
  size: number;
  mimeType: string;
  provider: StorageProviderName;
}

/** Delivery-time image transformations (provider-native). */
export interface UrlTransform {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit";
  /** `"auto"` lets the provider negotiate the best format. */
  format?: "auto" | "webp" | "jpg" | "png";
  quality?: "auto" | number;
}

export interface RetrievedFile {
  buffer: Buffer;
  mimeType: string;
  size: number;
}

/**
 * Storage capabilities required by the application.
 * `validateFile()` lives in `lib/storage/validate.ts` (shared by all providers).
 */
export interface StorageProvider {
  readonly name: StorageProviderName;

  /** Persist bytes under an already-built tenant-aware key. */
  uploadFile(input: StorageFileInput, options: StorageUploadOptions): Promise<StorageObject>;

  /** Remove an object. Must resolve successfully when the object is missing. */
  deleteFile(key: string): Promise<void>;

  /** Read an object's bytes. Returns `null` when the object does not exist. */
  getFile(key: string): Promise<RetrievedFile | null>;

  /** Public delivery URL with optional delivery-time transformations. */
  getPublicUrl(key: string, transform?: UrlTransform): string;

  /** Short-lived signed URL (bearer credential). Never returned to untrusted callers. */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;

  /** Optional delivery-time transform presets (provider-native, e.g. Cloudinary). */
  getTransformedUrl?(key: string, preset: "thumb" | "card" | "gallery" | "full"): string;
}
