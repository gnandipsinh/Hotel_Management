/**
 * Cloudinary storage adapter — the production provider.
 *
 * Activated automatically when `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`
 * and `CLOUDINARY_API_SECRET` are present in the environment. Credentials are
 * read server-side only and never leave the process.
 *
 * - Images are delivered through Cloudinary delivery-time transformations
 *   (thumbnail / card / gallery / full) — no permanent duplicate files.
 * - Private categories upload with `type: "authenticated"` so public delivery
 *   URLs can never reach them; access goes through signed URLs only.
 */

import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import type {
  RetrievedFile,
  StorageFileInput,
  StorageObject,
  StorageProvider,
  StorageUploadOptions,
  UrlTransform,
} from "@/lib/storage/types";
import { ApiError } from "@/lib/db/errors";

const CLOUDINARY_FOLDER = "hotel_saas";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function resourceTypeFor(mimeType: string): "image" | "raw" {
  return mimeType.startsWith("image/") ? "image" : "raw";
}

export class CloudinaryStorageProvider implements StorageProvider {
  readonly name = "cloudinary" as const;

  constructor() {
    if (!isCloudinaryConfigured()) {
      throw ApiError.internal("Cloudinary is not configured");
    }
  }

  async uploadFile(input: StorageFileInput, options: StorageUploadOptions): Promise<StorageObject> {
    const resourceType = resourceTypeFor(input.mimeType);
    const uploadType = options.access === "private" ? "authenticated" : "upload";

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDER,
          public_id: options.key,
          resource_type: resourceType,
          type: uploadType,
          overwrite: false,
          unique_filename: false,
          access_mode: options.access === "private" ? "authenticated" : "public",
        },
        (error: unknown, uploaded?: UploadApiResponse) => {
          if (error || !uploaded) {
            reject(ApiError.internal("File storage upload failed"));
            return;
          }
          resolve(uploaded);
        },
      );
      stream.end(input.buffer);
    });

    const providerKey = `${CLOUDINARY_FOLDER}/${result.public_id}`;

    return {
      key: providerKey,
      url: options.access === "private" ? "" : result.secure_url ?? "",
      size: input.buffer.length,
      mimeType: input.mimeType,
      provider: this.name,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const publicId = this.toPublicId(key);
    try {
      const resourceType = this.guessResourceType(key);
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        type: "upload",
        invalidate: true,
      });
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        type: "authenticated",
        invalidate: true,
      });
    } catch {
      // A missing/already-deleted object must not fail the caller.
    }
  }

  async getFile(key: string): Promise<RetrievedFile | null> {
    try {
      const url = await this.getSignedUrl(key);
      const response = await fetch(url);
      if (!response.ok) return null;
      const buffer = Buffer.from(await response.arrayBuffer());
      return {
        buffer,
        mimeType: response.headers.get("content-type") || "",
        size: buffer.length,
      };
    } catch {
      return null;
    }
  }

  getPublicUrl(key: string, transform?: UrlTransform): string {
    const options: Record<string, unknown> = {
      secure: true,
      sign_url: false,
      type: "upload",
    };
    if (transform) {
      if (transform.width) options.width = transform.width;
      if (transform.height) options.height = transform.height;
      if (transform.crop) options.crop = transform.crop;
      if (transform.format) options.format = transform.format;
      if (transform.quality) options.quality = transform.quality;
      else if (transform.width || transform.height) options.quality = "auto";
    }
    return cloudinary.url(this.toPublicId(key), options);
  }

  /**
   * Delivery-time transform presets: thumbnail / card / gallery / full.
   * Implemented as a convenience on top of `getPublicUrl`.
   */
  getTransformedUrl(key: string, preset: "thumb" | "card" | "gallery" | "full"): string {
    switch (preset) {
      case "thumb":
        return this.getPublicUrl(key, { width: 160, height: 160, crop: "fill", format: "auto" });
      case "card":
        return this.getPublicUrl(key, { width: 480, height: 320, crop: "fill", format: "auto" });
      case "gallery":
        return this.getPublicUrl(key, { width: 1200, height: 800, crop: "limit", format: "auto" });
      default:
        return this.getPublicUrl(key);
    }
  }

  async getSignedUrl(key: string, expiresInMs: number = 10 * 60 * 1000): Promise<string> {
    const publicId = this.toPublicId(key);
    const expiresAt = Math.floor(Date.now() / 1000) + Math.floor(expiresInMs / 1000);
    const isPrivate = key.includes("/payments") || key.includes("/documents") || key.includes("/guests");
    return cloudinary.url(publicId, {
      secure: true,
      type: isPrivate ? "authenticated" : "upload",
      sign_url: true,
      expires_at: expiresAt,
    });
  }

  private toPublicId(key: string): string {
    if (!key.startsWith(`${CLOUDINARY_FOLDER}/`)) {
      throw ApiError.badRequest("Invalid storage key");
    }
    return key;
  }

  private guessResourceType(key: string): "image" | "raw" {
    return /\.(png|jpe?g|webp)$/i.test(key) ? "image" : "raw";
  }
}

export function createCloudinaryStorageProvider(): CloudinaryStorageProvider {
  return new CloudinaryStorageProvider();
}
