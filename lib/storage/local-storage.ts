/**
 * Local filesystem storage adapter — the default when no cloud credentials are
 * configured (development and automated tests).
 *
 * Bytes are written under `uploads/` (git-ignored) and served through the
 * protected `/api/files/:id/content` route, never as static public files.
 */

import { promises as fs } from "fs";
import path from "path";
import type {
  RetrievedFile,
  StorageFileInput,
  StorageObject,
  StorageProvider,
  StorageUploadOptions,
} from "@/lib/storage/types";
import { signStorageKey } from "@/lib/storage/signed";
import { isSafeStorageKey } from "@/lib/storage/storage-path";
import { ApiError } from "@/lib/db/errors";

const DEFAULT_ROOT = "uploads";
/** Lifetime of locally signed URLs. */
export const SIGNED_URL_TTL_MS = 10 * 60 * 1000;

export function resolveLocalStorageRoot(): string {
  const configured = process.env.LOCAL_STORAGE_DIR;
  const root = configured && configured.trim() ? configured.trim() : DEFAULT_ROOT;
  // Storage root is runtime configuration (env), not a build-time dependency.
  return path.isAbsolute(root)
    ? root
    : path.resolve(/*turbopackIgnore: true*/ process.cwd(), root);
}

/** Resolve a key inside the storage root, refusing any escape attempt. */
function resolveKey(root: string, key: string): string {
  if (!isSafeStorageKey(key)) {
    throw ApiError.badRequest("Invalid storage key");
  }
  const fullPath = path.resolve(root, key);
  if (fullPath !== root && !fullPath.startsWith(root + path.sep)) {
    throw ApiError.badRequest("Invalid storage key");
  }
  return fullPath;
}

export class LocalStorageProvider implements StorageProvider {
  readonly name = "local" as const;
  private readonly root: string;

  constructor(root: string = resolveLocalStorageRoot()) {
    this.root = root;
  }

  async uploadFile(input: StorageFileInput, options: StorageUploadOptions): Promise<StorageObject> {
    const fullPath = resolveKey(this.root, options.key);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, input.buffer);
    return {
      key: options.key,
      url: "",
      size: input.buffer.length,
      mimeType: input.mimeType,
      provider: this.name,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const fullPath = resolveKey(this.root, key);
    try {
      await fs.unlink(fullPath);
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOENT") return; // missing object is not an error
      throw err;
    }
  }

  async getFile(key: string): Promise<RetrievedFile | null> {
    const fullPath = resolveKey(this.root, key);
    try {
      const buffer = await fs.readFile(fullPath);
      const stat = await fs.stat(fullPath);
      return { buffer, mimeType: "", size: stat.size };
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw err;
    }
  }

  /**
   * Local delivery always goes through the id-based content route; this key
   * based URL is a logical reference (signing is applied by `getSignedUrl`).
   */
  getPublicUrl(key: string): string {
    if (!isSafeStorageKey(key)) throw ApiError.badRequest("Invalid storage key");
    return `/api/files/content?key=${encodeURIComponent(key)}`;
  }

  async getSignedUrl(key: string, expiresIn: number = SIGNED_URL_TTL_MS): Promise<string> {
    if (!isSafeStorageKey(key)) throw ApiError.badRequest("Invalid storage key");
    const expiresAt = Date.now() + expiresIn;
    const signature = signStorageKey(key, expiresAt);
    return `/api/files/content?key=${encodeURIComponent(key)}&exp=${expiresAt}&sig=${signature}`;
  }
}

export function createLocalStorageProvider(): LocalStorageProvider {
  return new LocalStorageProvider();
}
