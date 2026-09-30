/**
 * Storage provider factory and provider-independent capability helpers.
 *
 * Selection order:
 *   1. explicit override (tests / failure injection)
 *   2. Cloudinary when its credentials are configured
 *   3. local filesystem (development and automated tests)
 */

import type { StorageProvider } from "@/lib/storage/types";
import { isCloudinaryConfigured, CloudinaryStorageProvider } from "@/lib/storage/cloudinary-storage";
import { createLocalStorageProvider } from "@/lib/storage/local-storage";

let overrideProvider: StorageProvider | null = null;
let cachedProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (overrideProvider) return overrideProvider;
  if (!cachedProvider) {
    cachedProvider = isCloudinaryConfigured()
      ? new CloudinaryStorageProvider()
      : createLocalStorageProvider();
  }
  return cachedProvider;
}

/** Test-only: inject a provider (e.g. a failing one) or reset to the default. */
export function setStorageProvider(provider: StorageProvider | null): void {
  overrideProvider = provider;
  if (provider === null) cachedProvider = null;
}

export function getActiveProviderName(): "cloudinary" | "local" {
  return getStorageProvider().name;
}

/** `uploadFile()` capability, bound to the active provider. */
export function uploadFile(...args: Parameters<StorageProvider["uploadFile"]>) {
  return getStorageProvider().uploadFile(...args);
}

/** `deleteFile()` capability, bound to the active provider. */
export function deleteFile(...args: Parameters<StorageProvider["deleteFile"]>) {
  return getStorageProvider().deleteFile(...args);
}

/** `getFile()` capability, bound to the active provider. */
export function getFile(...args: Parameters<StorageProvider["getFile"]>) {
  return getStorageProvider().getFile(...args);
}

/** `getPublicUrl()` capability, bound to the active provider. */
export function getPublicUrl(...args: Parameters<StorageProvider["getPublicUrl"]>) {
  return getStorageProvider().getPublicUrl(...args);
}

/** `getSignedUrl()` capability, bound to the active provider. */
export function getSignedUrl(...args: Parameters<StorageProvider["getSignedUrl"]>) {
  return getStorageProvider().getSignedUrl(...args);
}

/** Delivery-time image transform presets shared by every provider. */
export type ImagePreset = "thumb" | "card" | "gallery" | "full";

export function getImageUrl(key: string, preset: ImagePreset): string {
  const provider = getStorageProvider();
  if (provider.name === "cloudinary" && provider.getTransformedUrl) {
    return provider.getTransformedUrl(key, preset);
  }
  // The local adapter serves one original through the content route; the UI
  // applies responsive rendering (`next/image` + `sizes`) instead of variants.
  return provider.getPublicUrl(key);
}
